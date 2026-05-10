import os
import re
import time
import zipfile
import asyncio
import threading

import git
from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.config import settings
from app.models.project import Project
from app.schemas.repo import CloneRequest, CloneResponse, UploadResponse

# In-memory clone progress tracking
_clone_progress = {}


def get_clone_progress(key: str) -> dict:
    return _clone_progress.get(key, {
        "stage": "idle", "percent": 0,
        "cur_bytes": 0, "total_bytes": 0, "speed": 0, "message": "",
    })


def _parse_size(s: str) -> int:
    """Parse git size strings like '23.72 KiB', '1.5 MiB' to bytes."""
    m = re.match(r'([\d.]+)\s*(B|KiB|MiB|GiB|KB|MB|GB)', s.strip())
    if not m:
        return 0
    val = float(m.group(1))
    unit = m.group(2)
    multipliers = {
        'B': 1, 'KiB': 1024, 'MiB': 1024**2, 'GiB': 1024**3,
        'KB': 1000, 'MB': 1000**2, 'GB': 1000**3,
    }
    return int(val * multipliers.get(unit, 1))


def _parse_git_message(message: str):
    """Parse git progress message like '23.72 KiB | 1011.00 KiB/s'.
    Returns (received_bytes, speed_bytes_per_sec).
    """
    if not message:
        return 0, 0
    parts = message.split('|')
    received = _parse_size(parts[0]) if len(parts) >= 1 else 0
    speed = 0
    if len(parts) >= 2:
        speed_str = parts[1].strip().replace('/s', '')
        speed = _parse_size(speed_str)
    return received, speed


class CloneProgress(git.RemoteProgress):
    """Captures real git clone progress with byte counts for speed calculation."""

    def __init__(self, progress_key: str):
        super().__init__()
        self.progress_key = progress_key

    def update(self, op_code, cur_count, max_count=None, message=""):
        percent = 0
        if max_count and max_count > 0:
            percent = int(cur_count / max_count * 100)

        # Determine stage from op_code
        stage = "cloning"
        if op_code & git.RemoteProgress.COUNTING:
            stage = "counting"
        elif op_code & git.RemoteProgress.COMPRESSING:
            stage = "compressing"
        elif op_code & git.RemoteProgress.RECEIVING:
            stage = "receiving"
        elif op_code & git.RemoteProgress.RESOLVING:
            stage = "resolving"
        elif op_code & git.RemoteProgress.WRITING:
            stage = "writing"

        # Parse real bytes and speed from git message
        msg = (message or "").strip()
        received_bytes, speed_bps = _parse_git_message(msg)

        prev = _clone_progress.get(self.progress_key, {})
        _clone_progress[self.progress_key] = {
            "stage": stage,
            "percent": min(percent, 100),
            "cur_bytes": received_bytes or prev.get("cur_bytes", 0),
            "total_bytes": 0,
            "speed": speed_bps or prev.get("speed", 0),
            "message": msg,
            "objects": f"{int(cur_count)}/{int(max_count)}" if max_count else "",
        }


def _run_clone_sync(url, clone_path, progress_key, branch=None):
    """Run git clone in a thread (blocking IO)."""
    try:
        # Set git proxy if configured
        env = os.environ.copy()
        if settings.GIT_PROXY:
            env["http_proxy"] = settings.GIT_PROXY
            env["https_proxy"] = settings.GIT_PROXY
            env["HTTP_PROXY"] = settings.GIT_PROXY
            env["HTTPS_PROXY"] = settings.GIT_PROXY

        clone_kwargs = {
            "depth": 1,
            "progress": CloneProgress(progress_key),
            "env": env,
        }
        if branch:
            clone_kwargs["branch"] = branch
        git.Repo.clone_from(url, clone_path, **clone_kwargs)
        _clone_progress[progress_key] = {
            **_clone_progress.get(progress_key, {}),
            "stage": "done_clone",
            "percent": 100,
        }
    except Exception as e:
        _clone_progress[progress_key] = {
            **_clone_progress.get(progress_key, {}),
            "stage": "error",
            "percent": 0,
            "message": str(e)[:200],
        }


class CodeFetcher:
    def __init__(self, db: Session):
        self.db = db

    async def clone_remote(self, request: CloneRequest) -> CloneResponse:
        repo_name = request.url.rstrip("/").split("/")[-1].replace(".git", "")
        ts = int(time.time())
        clone_path = os.path.join(settings.CLONE_DIR, f"{repo_name}_{ts}")
        os.makedirs(clone_path, exist_ok=True)

        progress_key = f"{repo_name}_{ts}"
        _clone_progress[progress_key] = {
            "stage": "starting", "percent": 0,
            "cur_bytes": 0, "total_bytes": 0, "speed": 0, "message": "",
        }

        # Run blocking git clone in a thread
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(
            None,
            _run_clone_sync,
            request.url, clone_path, progress_key, request.branch,
        )

        # Check for errors
        final = _clone_progress.get(progress_key, {})
        if final.get("stage") == "error":
            raise RuntimeError(f"Clone failed: {final.get('message', 'unknown error')}")

        _clone_progress[progress_key] = {
            **final, "stage": "counting_files", "percent": 95,
        }

        file_count = self._count_code_files(clone_path)
        project = Project(
            name=repo_name,
            source_type=request.platform,
            source_url=request.url,
            local_path=clone_path,
        )
        self.db.add(project)
        self.db.commit()
        self.db.refresh(project)

        _clone_progress[progress_key] = {
            **final, "stage": "done", "percent": 100,
        }
        threading.Timer(120, lambda: _clone_progress.pop(progress_key, None)).start()

        return CloneResponse(
            project_id=project.id,
            name=repo_name,
            local_path=clone_path,
            file_count=file_count,
        )

    async def handle_upload(
        self, files: list[UploadFile], project_name: str
    ) -> UploadResponse:
        upload_path = os.path.join(
            settings.UPLOAD_DIR, f"{project_name}_{int(time.time())}"
        )
        os.makedirs(upload_path, exist_ok=True)

        for file in files:
            safe_name = os.path.basename(file.filename or "unknown")
            dest = os.path.join(upload_path, safe_name)
            with open(dest, "wb") as f:
                content = await file.read()
                f.write(content)

            if safe_name.endswith(".zip"):
                with zipfile.ZipFile(dest, "r") as zf:
                    zf.extractall(upload_path)
                os.remove(dest)

        file_count = self._count_code_files(upload_path)
        project = Project(
            name=project_name,
            source_type="upload",
            local_path=upload_path,
        )
        self.db.add(project)
        self.db.commit()
        self.db.refresh(project)

        return UploadResponse(
            project_id=project.id,
            name=project_name,
            file_count=file_count,
        )

    def _count_code_files(self, path: str) -> int:
        extensions = settings.SUPPORTED_EXTENSIONS.split(",")
        skip_dirs = {
            "node_modules", "vendor", "__pycache__", "venv",
            ".git", "build", "dist", ".venv", "env",
        }
        count = 0
        for root, dirs, files in os.walk(path):
            dirs[:] = [d for d in dirs if not d.startswith(".") and d not in skip_dirs]
            for f in files:
                if any(f.endswith(ext) for ext in extensions):
                    count += 1
        return count
