from typing import Optional, AsyncIterator

import anthropic

from app.services.providers.base import BaseAIProvider, AIResponse


class AnthropicProvider(BaseAIProvider):
    def __init__(
        self, api_key: str, model_id: str, base_url: Optional[str] = None
    ):
        super().__init__(api_key, model_id, base_url)
        kwargs = {"api_key": api_key}
        if base_url:
            kwargs["base_url"] = base_url
        self.client = anthropic.AsyncAnthropic(**kwargs)

    async def chat(self, system_prompt: str, user_prompt: str) -> AIResponse:
        response = await self.client.messages.create(
            model=self.model_id,
            max_tokens=4096,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
            temperature=0.3,
        )
        content = ""
        if response.content:
            content = response.content[0].text
        return AIResponse(
            content=content,
            model=response.model,
            usage_prompt_tokens=response.usage.input_tokens,
            usage_completion_tokens=response.usage.output_tokens,
        )

    async def chat_stream(self, system_prompt: str, user_prompt: str) -> AsyncIterator[str]:
        async with self.client.messages.stream(
            model=self.model_id,
            max_tokens=4096,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
            temperature=0.3,
        ) as stream:
            async for text in stream.text_stream:
                yield text
