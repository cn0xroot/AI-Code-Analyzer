from typing import Optional, AsyncIterator

from openai import AsyncOpenAI

from app.services.providers.base import BaseAIProvider, AIResponse


class OpenAIProvider(BaseAIProvider):
    def __init__(
        self, api_key: str, model_id: str, base_url: Optional[str] = None
    ):
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
        choice = response.choices[0]
        return AIResponse(
            content=choice.message.content or "",
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
        async for chunk in stream:
            if chunk.choices and chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content
