from typing import Optional

from openai import AsyncOpenAI, AuthenticationError, APIStatusError, APIConnectionError
import anthropic

from app.services.providers.openai_provider import normalize_base_url
from app.services.providers.tongyi_provider import DASHSCOPE_BASE_URL


class ModelCatalogError(Exception):
    pass


async def list_available_models(provider: str, api_key: str, base_url: Optional[str] = None) -> list[str]:
    try:
        if provider == "anthropic":
            client = anthropic.AsyncAnthropic(api_key=api_key, base_url=base_url or None)
            ids = [m.id async for m in client.models.list(limit=100)]
        else:
            if provider == "tongyi":
                base_url = base_url or DASHSCOPE_BASE_URL
            elif provider == "openai_compat" and not base_url:
                raise ModelCatalogError("Base URL is required for OpenAI-compatible services")
            client = AsyncOpenAI(api_key=api_key, base_url=normalize_base_url(base_url))
            page = await client.models.list()
            ids = [m.id for m in page.data]
    except ModelCatalogError:
        raise
    except (AuthenticationError, anthropic.AuthenticationError):
        raise ModelCatalogError("Invalid API key (401)")
    except (APIConnectionError, anthropic.APIConnectionError) as e:
        raise ModelCatalogError(f"Could not connect to the API: {str(e)[:200]}")
    except (APIStatusError, anthropic.APIStatusError) as e:
        raise ModelCatalogError(f"API error {e.status_code}: {str(e)[:200]}")
    except Exception as e:
        raise ModelCatalogError(f"Unexpected response from the API: {str(e)[:200]}")

    ids = sorted({i for i in ids if i})
    if not ids:
        raise ModelCatalogError("The API returned no models. Check the Base URL (it usually ends with /v1).")
    return ids
