from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    OG_PRIVATE_KEY: str = ''
    OG_LLM_SERVER_URL: str = ''
    CORS_ORIGINS: str = 'http://localhost:5173'
    OG_MODEL: str = 'google/gemini-2.5-flash'
    TOP_K_CHUNKS: int = 5

    model_config = {'env_file': '.env', 'extra': 'ignore'}

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(',') if origin.strip()]


settings = Settings()
