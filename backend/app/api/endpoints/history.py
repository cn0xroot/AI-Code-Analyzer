import shutil

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.analysis import AnalysisTask
from app.models.project import Project
from app.schemas.history import HistoryItem, HistoryList

router = APIRouter(prefix="/history", tags=["history"])


@router.get("/", response_model=HistoryList)
async def list_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    total = db.query(AnalysisTask).count()
    tasks = (
        db.query(AnalysisTask)
        .order_by(AnalysisTask.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    items = [
        HistoryItem(
            id=t.id,
            project_id=t.project_id,
            project_name=t.project.name if t.project else None,
            analysis_type=t.analysis_type,
            status=t.status,
            ai_provider=t.ai_provider,
            ai_model=t.ai_model,
            created_at=t.created_at,
            completed_at=t.completed_at,
        )
        for t in tasks
    ]
    return HistoryList(items=items, total=total)


@router.delete("/{task_id}")
async def delete_history(task_id: int, db: Session = Depends(get_db)):
    task = db.query(AnalysisTask).filter(AnalysisTask.id == task_id).first()
    if task:
        # Check if this is the last task for the project, clean up cloned files
        project_id = task.project_id
        db.delete(task)  # cascade deletes AnalysisResult
        db.commit()

        # If no more tasks reference this project, delete project and files
        remaining = db.query(AnalysisTask).filter(
            AnalysisTask.project_id == project_id
        ).count()
        if remaining == 0:
            project = db.query(Project).filter(Project.id == project_id).first()
            if project:
                # Clean up cloned/uploaded files
                if project.local_path:
                    try:
                        shutil.rmtree(project.local_path, ignore_errors=True)
                    except Exception:
                        pass
                db.delete(project)
                db.commit()

        # Reclaim disk space
        try:
            raw_conn = db.get_bind().raw_connection()
            raw_conn.execute("VACUUM")
            raw_conn.close()
        except Exception:
            pass
    return {"detail": "Deleted"}


@router.delete("/")
async def clear_all_history(db: Session = Depends(get_db)):
    """Delete all analysis history, results, and orphan projects."""
    from app.models.analysis import AnalysisResult

    db.query(AnalysisResult).delete()
    db.query(AnalysisTask).delete()
    db.commit()

    # Clean orphan projects (no tasks)
    from sqlalchemy import not_, exists
    orphans = db.query(Project).filter(
        ~exists().where(AnalysisTask.project_id == Project.id)
    ).all()
    for p in orphans:
        if p.local_path:
            try:
                shutil.rmtree(p.local_path, ignore_errors=True)
            except Exception:
                pass
        db.delete(p)
    db.commit()

    # VACUUM to reclaim space
    try:
        raw_conn = db.get_bind().raw_connection()
        raw_conn.execute("VACUUM")
        raw_conn.close()
    except Exception:
        pass

    return {"detail": "All history cleared"}
