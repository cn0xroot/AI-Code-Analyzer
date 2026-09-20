from pydantic import BaseModel, field_serializer
from typing import Optional, List
from datetime import datetime, timezone


def as_utc(value: Optional[datetime]) -> Optional[datetime]:
    if value is not None and value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value


class AnalysisCreate(BaseModel):
    source_type: str  # "github", "gitlab", "gitee", "upload"
    source_url: Optional[str] = None
    project_id: Optional[int] = None
    analysis_type: str  # "overview", "function", "logic_flow", "full"
    ai_config_id: int
    target_files: Optional[List[str]] = None
    language: str = "zh"


class AnalysisResultItem(BaseModel):
    id: int
    section: str
    content_text: Optional[str] = None
    mermaid_code: Optional[str] = None
    diagram_type: Optional[str] = None
    file_path: Optional[str] = None

    model_config = {"from_attributes": True}


class AnalysisTaskResponse(BaseModel):
    id: int
    project_id: int
    project_name: Optional[str] = None
    analysis_type: str
    status: str
    ai_provider: str
    ai_model: str
    ai_config_id: Optional[int] = None
    language: Optional[str] = "zh"
    error_message: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    results: List[AnalysisResultItem] = []

    model_config = {"from_attributes": True}

    @field_serializer("created_at", "completed_at")
    def _utc(self, value: Optional[datetime]) -> Optional[datetime]:
        return as_utc(value)


class AnalysisStatusResponse(BaseModel):
    task_id: int
    status: str
    progress_message: Optional[str] = None


class ChatRequest(BaseModel):
    message: str
    ai_config_id: int
    language: Optional[str] = None
