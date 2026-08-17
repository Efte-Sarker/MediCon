from pydantic_settings import BaseSettings
import os

# Resolve .env from the backend/ folder regardless of where uvicorn is started from
_ENV_FILE = os.path.join(os.path.dirname(__file__), '..', '..', '.env')

class Settings(BaseSettings):
    PROJECT_NAME: str = "MediCon API"
    GEMINI_API_KEY: str = ""

    class Config:
        env_file = _ENV_FILE
        case_sensitive = True
        extra = "ignore"

settings = Settings()
