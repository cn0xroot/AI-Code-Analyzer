import os

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse

from app.api.router import api_router
from app.database import engine, Base
from app.config import settings

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.APP_NAME, version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.on_event("startup")
def cleanup_stale_tasks():
    """Mark any tasks stuck in pending/parsing/analyzing as failed on startup."""
    from app.database import SessionLocal
    from app.models.analysis import AnalysisTask

    db = SessionLocal()
    try:
        stale = db.query(AnalysisTask).filter(
            AnalysisTask.status.in_(["pending", "parsing", "analyzing"])
        ).all()
        for task in stale:
            task.status = "failed"
            task.error_message = "Task interrupted by server restart. Please retry."
        if stale:
            db.commit()
    finally:
        db.close()


@app.get("/health")
async def health():
    return {"status": "ok"}


# Serve frontend static files (production build)
_frontend_dist = os.path.join(os.path.dirname(__file__), "../../frontend/dist")
if os.path.isdir(_frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(_frontend_dist, "assets")), name="static")

    @app.get("/{full_path:path}")
    async def serve_spa(request: Request, full_path: str):
        """Serve index.html for all non-API routes (SPA fallback)."""
        file_path = os.path.join(_frontend_dist, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(_frontend_dist, "index.html"))
else:
    @app.get("/")
    async def root_redirect():
        return HTMLResponse(
            "<html><body style='font-family:sans-serif;text-align:center;padding:60px'>"
            "<h2>AI Code Analyzer - Backend API</h2>"
            "<p>API is running. Frontend dev server is at <a href='http://localhost:3000'>http://localhost:3000</a></p>"
            "<p>API docs: <a href='/docs'>/docs</a></p>"
            "</body></html>"
        )
