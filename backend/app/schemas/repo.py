from pydantic import BaseModel
from typing import Optional


class CloneRequest(BaseModel):
    url: str
    branch: Optional[str] = None
    platform: str = "github"  # "github", "gitlab", "gitee"


class CloneResponse(BaseModel):
    project_id: int
    name: str
    local_path: str
    file_count: int


class UploadResponse(BaseModel):
    project_id: int
    name: str
    file_count: int
