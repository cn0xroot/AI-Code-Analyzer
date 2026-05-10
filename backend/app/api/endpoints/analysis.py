from datetime import datetime, timedelta
import asyncio
import json

from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.analysis import (
    AnalysisCreate, AnalysisTaskResponse, AnalysisStatusResponse, ChatRequest
)

router = APIRouter(prefix="/analysis", tags=["analysis"])

# Timeout: if a task stays in pending/parsing/analyzing for over 10 minutes, mark as failed
TASK_TIMEOUT_MINUTES = 10


def _check_stale_task(task):
    """Check if a task is stale (stuck due to server restart etc)."""
    if task.status in ("pending", "parsing", "analyzing") and task.created_at:
        age = datetime.utcnow() - task.created_at
        if age > timedelta(minutes=TASK_TIMEOUT_MINUTES):
            return True
    return False


@router.post("/", response_model=AnalysisStatusResponse)
async def create_analysis(
    request: AnalysisCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    from app.services.analysis_service import AnalysisService

    service = AnalysisService(db)
    task = service.create_task(request)
    task_id = task.id
    background_tasks.add_task(run_analysis_background, task_id)
    return AnalysisStatusResponse(
        task_id=task_id, status="pending", progress_message="Task queued"
    )


async def run_analysis_background(task_id: int):
    """Run analysis in background with its own database session."""
    from app.database import SessionLocal
    from app.services.analysis_service import AnalysisService

    db = SessionLocal()
    try:
        service = AnalysisService(db)
        await service.run_analysis(task_id)
    except Exception as e:
        # Ensure task is marked as failed even on unexpected errors
        from app.models.analysis import AnalysisTask
        task = db.query(AnalysisTask).filter(AnalysisTask.id == task_id).first()
        if task and task.status not in ("completed", "failed"):
            task.status = "failed"
            task.error_message = f"Unexpected error: {str(e)[:500]}"
            db.commit()
    finally:
        db.close()


@router.get("/{task_id}", response_model=AnalysisTaskResponse)
async def get_analysis(task_id: int, db: Session = Depends(get_db)):
    from app.services.analysis_service import AnalysisService

    service = AnalysisService(db)
    task = service.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Analysis task not found")

    # Auto-detect stale tasks
    if _check_stale_task(task):
        task.status = "failed"
        task.error_message = "Task timed out (server may have restarted). Please retry."
        db.commit()

    return AnalysisTaskResponse(
        id=task.id,
        project_id=task.project_id,
        project_name=task.project.name if task.project else None,
        analysis_type=task.analysis_type,
        status=task.status,
        ai_provider=task.ai_provider,
        ai_model=task.ai_model,
        ai_config_id=task.ai_config_id,
        error_message=task.error_message,
        created_at=task.created_at,
        completed_at=task.completed_at,
        results=task.results,
    )


@router.get("/{task_id}/status", response_model=AnalysisStatusResponse)
async def get_analysis_status(task_id: int, db: Session = Depends(get_db)):
    from app.models.analysis import AnalysisTask

    task = db.query(AnalysisTask).filter(AnalysisTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Auto-detect stale tasks
    if _check_stale_task(task):
        task.status = "failed"
        task.error_message = "Task timed out (server may have restarted). Please retry."
        db.commit()

    return AnalysisStatusResponse(task_id=task.id, status=task.status)


@router.get("/{task_id}/stream")
async def stream_analysis(task_id: int, db: Session = Depends(get_db)):
    """SSE endpoint: stream live AI output for a running analysis task."""
    from app.models.analysis import AnalysisTask
    from app.services.analysis_service import get_live_output

    task = db.query(AnalysisTask).filter(AnalysisTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    async def event_stream():
        last_len = 0
        empty_count = 0
        while True:
            # Re-query status
            db.expire_all()
            task_obj = db.query(AnalysisTask).filter(AnalysisTask.id == task_id).first()
            status = task_obj.status if task_obj else "failed"

            live = get_live_output(task_id)
            streaming_text = live.get("streaming_text", "")
            current_file = live.get("current_file", "")
            phase = live.get("phase", "")

            # Send new content since last push
            new_text = streaming_text[last_len:]
            last_len = len(streaming_text)

            data = {
                "status": status,
                "phase": phase,
                "current_file": current_file,
                "new_text": new_text,
                "full_length": len(streaming_text),
            }
            yield f"data: {json.dumps(data, ensure_ascii=False)}\n\n"

            if status in ("completed", "failed"):
                # Send final with error if any
                final = {
                    "status": status,
                    "phase": "done",
                    "error": task_obj.error_message if task_obj else None,
                }
                yield f"data: {json.dumps(final, ensure_ascii=False)}\n\n"
                break

            if not live and status == "analyzing":
                empty_count += 1
                if empty_count > 600:  # 5 min with no output
                    break
            else:
                empty_count = 0

            await asyncio.sleep(0.5)

    return StreamingResponse(event_stream(), media_type="text/event-stream")


# In-memory chat history per task
_chat_histories = {}


@router.post("/{task_id}/chat")
async def chat_with_analysis(
    task_id: int, request: ChatRequest, db: Session = Depends(get_db)
):
    """Chat about analysis results with AI context. Returns SSE stream."""
    from app.models.analysis import AnalysisTask, AnalysisResult
    from app.models.project import Project
    from app.services.ai_analyzer import AIAnalyzer

    task = db.query(AnalysisTask).filter(AnalysisTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Build context from analysis results
    project = db.query(Project).filter(Project.id == task.project_id).first()
    results = db.query(AnalysisResult).filter(AnalysisResult.task_id == task_id).all()

    context_parts = [
        f"项目名: {project.name if project else 'Unknown'}",
        f"分析类型: {task.analysis_type}",
        f"AI模型: {task.ai_provider}/{task.ai_model}",
    ]
    for r in results:
        context_parts.append(f"\n--- {r.section} ---")
        if r.file_path:
            context_parts.append(f"文件: {r.file_path}")
        if r.content_text:
            context_parts.append(r.content_text[:2000])
        if r.mermaid_code:
            context_parts.append(f"```mermaid\n{r.mermaid_code}\n```")

    context_str = "\n".join(context_parts)

    system_prompt = f"""你是一个代码分析助手。用户已经对一个项目进行了代码分析，以下是分析结果的摘要。
请基于这些分析结果回答用户的问题。回答使用中文，可以使用 Markdown 格式和 Mermaid 图表。

## 分析结果上下文
{context_str[:8000]}"""

    # Maintain chat history
    if task_id not in _chat_histories:
        _chat_histories[task_id] = []

    history = _chat_histories[task_id]
    history.append({"role": "user", "content": request.message})

    # Keep history manageable (last 20 messages)
    if len(history) > 20:
        history[:] = history[-20:]

    ai = AIAnalyzer(db)
    provider = ai.get_provider(request.ai_config_id)

    async def event_stream():
        full_text = ""
        try:
            # Build messages with history
            messages = []
            for msg in history:
                messages.append(msg)

            # Use streaming chat
            async for chunk in provider.chat_stream(system_prompt, _build_chat_user_prompt(messages)):
                full_text += chunk
                data = {"type": "chunk", "content": chunk}
                yield f"data: {json.dumps(data, ensure_ascii=False)}\n\n"

            # Save assistant response to history
            history.append({"role": "assistant", "content": full_text})
            yield f"data: {json.dumps({'type': 'done'})}\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'content': str(e)[:500]}, ensure_ascii=False)}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


def _build_chat_user_prompt(messages: list) -> str:
    """Build a single user prompt from conversation history."""
    if len(messages) == 1:
        return messages[0]["content"]

    parts = []
    for msg in messages[:-1]:
        role = "用户" if msg["role"] == "user" else "助手"
        parts.append(f"[{role}]: {msg['content']}")
    parts.append(f"\n当前问题: {messages[-1]['content']}")
    return "\n".join(parts)
