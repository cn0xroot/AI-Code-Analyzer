from typing import Optional

from app.services.providers.openai_provider import OpenAIProvider

DASHSCOPE_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1"


class TongyiProvider(OpenAIProvider):
    """Tongyi Qianwen via DashScope's OpenAI-compatible API."""

    def __init__(
        self, api_key: str, model_id: str, base_url: Optional[str] = None
    ):
        effective_url = base_url or DASHSCOPE_BASE_URL
        super().__init__(api_key, model_id, effective_url)
