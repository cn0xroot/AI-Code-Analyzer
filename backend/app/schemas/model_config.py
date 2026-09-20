from pydantic import BaseModel
from typing import Optional


class ModelConfigCreate(BaseModel):
    name: str
    provider: str  # "openai", "anthropic", "tongyi", "openai_compat"
    model_id: str
    api_key: str
    base_url: Optional[str] = None
    is_default: bool = False


class ModelConfigResponse(BaseModel):
    id: int
    name: str
    provider: str
    model_id: str
    base_url: Optional[str] = None
    is_default: bool

    model_config = {"from_attributes": True}


class ModelConfigUpdate(BaseModel):
    name: Optional[str] = None
    provider: Optional[str] = None
    model_id: Optional[str] = None
    api_key: Optional[str] = None
    base_url: Optional[str] = None
    is_default: Optional[bool] = None


class AvailableModelsRequest(BaseModel):
    provider: str
    api_key: Optional[str] = None
    base_url: Optional[str] = None
    config_id: Optional[int] = None


class AvailableModelsResponse(BaseModel):
    models: list[str]
