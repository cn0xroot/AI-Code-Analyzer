from fastapi import APIRouter

from app.api.endpoints import analysis, repos, models_config, history

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(analysis.router)
api_router.include_router(repos.router)
api_router.include_router(models_config.router)
api_router.include_router(history.router)
