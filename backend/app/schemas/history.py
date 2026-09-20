from pydantic import BaseModel, field_serializer
from typing import Optional, List
from datetime import datetime

from app.schemas.analysis import as_utc


class HistoryItem(BaseModel):
    id: int
    project_id: int
    project_name: Optional[str] = None
    analysis_type: str
    status: str
    ai_provider: str
    ai_model: str
    language: Optional[str] = "zh"
    created_at: datetime
    completed_at: Optional[datetime] = None

    model_config = {"from_attributes": True}

    @field_serializer("created_at", "completed_at")
    def _utc(self, value: Optional[datetime]) -> Optional[datetime]:
        return as_utc(value)


class HistoryList(BaseModel):
    items: List[HistoryItem]
    total: int
