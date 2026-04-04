from typing import List

import opengradient as og
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    OG_PRIVATE_KEY: str = ''
    OG_LLM_SERVER_URL: str = ''
    CORS_ORIGINS: str = 'http://localhost:5173'
    OG_MODEL: str = 'google/gemini-2.5-flash'
    OG_SETTLEMENT_MODE: str = 'BATCH_HASHED'
    OG_APPROVAL_AMOUNT: float = 10.0
    TOP_K_CHUNKS: int = 5

    model_config = {'env_file': '.env', 'extra': 'ignore'}

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(',') if origin.strip()]

    @property
    def settlement_mode(self) -> og.x402SettlementMode:
        raw = (self.OG_SETTLEMENT_MODE or '').strip()
        if not raw:
            return og.x402SettlementMode.BATCH_HASHED

        normalized = raw.upper().replace('-', '_')
        if hasattr(og.x402SettlementMode, normalized):
            return getattr(og.x402SettlementMode, normalized)

        for mode in og.x402SettlementMode:
            if mode.value.lower() == raw.lower():
                return mode

        return og.x402SettlementMode.BATCH_HASHED


settings = Settings()
