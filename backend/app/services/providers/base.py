from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional, AsyncIterator


@dataclass
class AIResponse:
    content: str
    model: str
    usage_prompt_tokens: int = 0
    usage_completion_tokens: int = 0


class BaseAIProvider(ABC):
    def __init__(
        self, api_key: str, model_id: str, base_url: Optional[str] = None
    ):
        self.api_key = api_key
        self.model_id = model_id
        self.base_url = base_url

    @abstractmethod
    async def chat(self, system_prompt: str, user_prompt: str) -> AIResponse:
        ...

    @abstractmethod
    async def chat_stream(self, system_prompt: str, user_prompt: str) -> AsyncIterator[str]:
        """Yield content chunks as they arrive from the model."""
        ...
