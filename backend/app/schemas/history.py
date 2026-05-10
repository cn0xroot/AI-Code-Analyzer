from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class HistoryItem(BaseModel):
    id: int
    project_id: int
    project_name: Optional[str] = None
    analysis_type: str
    status: str
    ai_provider: str
    ai_model: str
    created_at: datetime
    completed_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class HistoryList(BaseModel):
    items: List[HistoryItem]
    total: int
