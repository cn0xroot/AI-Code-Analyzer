from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class AnalysisCreate(BaseModel):
    source_type: str  # "github", "gitlab", "gitee", "upload"
    source_url: Optional[str] = None
    project_id: Optional[int] = None
    analysis_type: str  # "overview", "function", "logic_flow", "full"
    ai_config_id: int
    target_files: Optional[List[str]] = None


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
    error_message: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    results: List[AnalysisResultItem] = []

    model_config = {"from_attributes": True}


class AnalysisStatusResponse(BaseModel):
    task_id: int
    status: str
    progress_message: Optional[str] = None


class ChatRequest(BaseModel):
    message: str
    ai_config_id: int
