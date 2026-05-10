from typing import Optional

from app.services.providers.openai_provider import OpenAIProvider


class OpenAICompatProvider(OpenAIProvider):
    """Generic OpenAI-compatible provider for relay/forwarding services."""

    def __init__(
        self, api_key: str, model_id: str, base_url: Optional[str] = None
    ):
        if not base_url:
            raise ValueError("base_url is required for OpenAI-compatible relay services")
        super().__init__(api_key, model_id, base_url)
