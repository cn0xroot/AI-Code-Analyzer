from typing import AsyncIterator

from sqlalchemy.orm import Session

from app.models.model_config import AIModelConfig
from app.services.providers.base import BaseAIProvider, AIResponse
from app.services.providers.openai_provider import OpenAIProvider
from app.services.providers.anthropic_provider import AnthropicProvider
from app.services.providers.tongyi_provider import TongyiProvider
from app.services.providers.openai_compat import OpenAICompatProvider

PROVIDER_MAP = {
    "openai": OpenAIProvider,
    "anthropic": AnthropicProvider,
    "tongyi": TongyiProvider,
    "openai_compat": OpenAICompatProvider,
}


class AIAnalyzer:
    def __init__(self, db: Session):
        self.db = db

    def get_provider(self, config_id: int) -> BaseAIProvider:
        config = (
            self.db.query(AIModelConfig)
            .filter(AIModelConfig.id == config_id)
            .first()
        )
        if not config:
            raise ValueError(f"AI model config {config_id} not found")

        provider_class = PROVIDER_MAP.get(config.provider)
        if not provider_class:
            raise ValueError(f"Unknown provider: {config.provider}")

        return provider_class(
            api_key=config.api_key,
            model_id=config.model_id,
            base_url=config.base_url,
        )

    async def analyze(
        self, config_id: int, system_prompt: str, user_prompt: str
    ) -> AIResponse:
        provider = self.get_provider(config_id)
        return await provider.chat(system_prompt, user_prompt)

    async def analyze_stream(
        self, config_id: int, system_prompt: str, user_prompt: str
    ) -> AsyncIterator[str]:
        """Stream AI response chunks."""
        provider = self.get_provider(config_id)
        async for chunk in provider.chat_stream(system_prompt, user_prompt):
            yield chunk
