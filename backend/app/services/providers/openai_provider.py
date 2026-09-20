from typing import Optional, AsyncIterator
from urllib.parse import urlparse

from openai import AsyncOpenAI

from app.services.providers.base import BaseAIProvider, AIResponse

EMPTY_RESPONSE_HINT = (
    "AI 模型未返回任何内容。请检查 Base URL 是否正确（OpenAI 兼容接口通常需以 /v1 结尾）"
    "以及模型 ID 是否可用。"
)


def normalize_base_url(base_url: Optional[str]) -> Optional[str]:
    if not base_url:
        return base_url
    base_url = base_url.rstrip("/")
    if urlparse(base_url).path in ("", "/"):
        base_url += "/v1"
    return base_url


class OpenAIProvider(BaseAIProvider):
    def __init__(
        self, api_key: str, model_id: str, base_url: Optional[str] = None
    ):
        base_url = normalize_base_url(base_url)
        super().__init__(api_key, model_id, base_url)
        kwargs = {"api_key": api_key}
        if base_url:
            kwargs["base_url"] = base_url
        self.client = AsyncOpenAI(**kwargs)

    async def chat(self, system_prompt: str, user_prompt: str) -> AIResponse:
        response = await self.client.chat.completions.create(
            model=self.model_id,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
            max_tokens=4096,
        )
        if isinstance(response, str) or not response.choices:
            raise RuntimeError(EMPTY_RESPONSE_HINT)
        choice = response.choices[0]
        content = choice.message.content or ""
        if not content.strip():
            raise RuntimeError(EMPTY_RESPONSE_HINT)
        return AIResponse(
            content=content,
            model=response.model,
            usage_prompt_tokens=response.usage.prompt_tokens if response.usage else 0,
            usage_completion_tokens=response.usage.completion_tokens if response.usage else 0,
        )

    async def chat_stream(self, system_prompt: str, user_prompt: str) -> AsyncIterator[str]:
        stream = await self.client.chat.completions.create(
            model=self.model_id,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
            max_tokens=4096,
            stream=True,
        )
        received = False
        async for chunk in stream:
            if chunk.choices and chunk.choices[0].delta.content:
                received = True
                yield chunk.choices[0].delta.content
        if not received:
            raise RuntimeError(EMPTY_RESPONSE_HINT)
