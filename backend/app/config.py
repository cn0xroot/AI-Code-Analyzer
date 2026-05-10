from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    APP_NAME: str = "AI Code Analyzer"
    DEBUG: bool = False
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    DATABASE_URL: str = "sqlite:///./code_analyzer.db"

    UPLOAD_DIR: str = "./uploads"
    CLONE_DIR: str = "./cloned_repos"
    MAX_UPLOAD_SIZE_MB: int = 50

    OPENAI_API_KEY: Optional[str] = None
    OPENAI_BASE_URL: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    DASHSCOPE_API_KEY: Optional[str] = None

    GIT_PROXY: Optional[str] = None  # e.g. "http://127.0.0.1:7897"

    MAX_FILE_SIZE_KB: int = 500
    SUPPORTED_EXTENSIONS: str = ".py,.java,.js,.ts,.go,.php,.cs,.c,.cpp,.h,.hpp,.swift,.kt"

    model_config = {"env_file": ".env"}


settings = Settings()
