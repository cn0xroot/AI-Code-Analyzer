import asyncio
import json
import time

from fastapi import APIRouter, Depends, UploadFile, File, Form, BackgroundTasks
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.repo import CloneRequest, CloneResponse, UploadResponse

router = APIRouter(prefix="/repos", tags=["repos"])


@router.post("/clone", response_model=CloneResponse)
async def clone_repo(request: CloneRequest, db: Session = Depends(get_db)):
    from app.services.code_fetcher import CodeFetcher

    fetcher = CodeFetcher(db)
    return await fetcher.clone_remote(request)


@router.post("/clone/stream")
async def clone_repo_stream(request: CloneRequest, db: Session = Depends(get_db)):
    """Clone a repo and stream progress via SSE."""
    from app.services.code_fetcher import CodeFetcher, _clone_progress, _run_clone_sync
    from app.config import settings
    from app.models.project import Project
    import os

    repo_name = request.url.rstrip("/").split("/")[-1].replace(".git", "")
    ts = int(time.time())
    clone_path = os.path.join(settings.CLONE_DIR, f"{repo_name}_{ts}")
    os.makedirs(clone_path, exist_ok=True)

    progress_key = f"{repo_name}_{ts}"
    _clone_progress[progress_key] = {
        "stage": "starting", "percent": 0,
        "cur_bytes": 0, "total_bytes": 0, "speed": 0, "message": "",
    }

    async def event_stream():
        loop = asyncio.get_event_loop()
        # Start clone in thread
        clone_future = loop.run_in_executor(
            None, _run_clone_sync,
            request.url, clone_path, progress_key, request.branch,
        )

        # Stream progress while cloning
        while not clone_future.done():
            progress = _clone_progress.get(progress_key, {})
            yield f"data: {json.dumps(progress)}\n\n"
            await asyncio.sleep(0.5)

        # Ensure thread result is collected (raises if error in thread)
        await clone_future

        final = _clone_progress.get(progress_key, {})
        if final.get("stage") == "error":
            yield f"data: {json.dumps({'stage': 'error', 'percent': 0, 'message': final.get('message', '')})}\n\n"
            return

        # Count files
        _clone_progress[progress_key] = {**final, "stage": "counting_files", "percent": 95}
        yield f"data: {json.dumps(_clone_progress[progress_key])}\n\n"

        fetcher = CodeFetcher(db)
        file_count = fetcher._count_code_files(clone_path)
        project = Project(
            name=repo_name,
            source_type=request.platform,
            source_url=request.url,
            local_path=clone_path,
        )
        db.add(project)
        db.commit()
        db.refresh(project)

        result = {
            "stage": "done", "percent": 100,
            "cur_bytes": final.get("cur_bytes", 0),
            "total_bytes": final.get("total_bytes", 0),
            "speed": 0, "message": "",
            "result": {
                "project_id": project.id,
                "name": repo_name,
                "local_path": clone_path,
                "file_count": file_count,
            }
        }
        yield f"data: {json.dumps(result)}\n\n"

        _clone_progress.pop(progress_key, None)

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@router.post("/upload", response_model=UploadResponse)
async def upload_code(
    files: list[UploadFile] = File(...),
    project_name: str = Form(default="uploaded_project"),
    db: Session = Depends(get_db),
):
    from app.services.code_fetcher import CodeFetcher

    fetcher = CodeFetcher(db)
    return await fetcher.handle_upload(files, project_name)
