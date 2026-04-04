import logging
from typing import Optional

import opengradient as og

from app.config import settings

logger = logging.getLogger(__name__)
_llm: Optional[og.LLM] = None
_approval_ready = False


def get_llm() -> og.LLM:
    global _llm
    if _llm is None:
        if not settings.OG_PRIVATE_KEY:
            raise RuntimeError('OG_PRIVATE_KEY is not set')

        kwargs = {'private_key': settings.OG_PRIVATE_KEY}
        if settings.OG_LLM_SERVER_URL:
            kwargs['llm_server_url'] = settings.OG_LLM_SERVER_URL

        _llm = og.LLM(**kwargs)
        logger.info('OpenGradient LLM client initialized')

    return _llm



def ensure_wallet_ready(force: bool = False) -> None:
    global _approval_ready

    if _approval_ready and not force:
        return

    llm = get_llm()
    llm.ensure_opg_approval(opg_amount=settings.OG_APPROVAL_AMOUNT)
    _approval_ready = True
    logger.info('OpenGradient wallet approval ensured')



def get_model():
    desired = settings.OG_MODEL
    try:
        enum = og.TEE_LLM
    except Exception:
        return desired

    for name in dir(enum):
        if name.startswith('_'):
            continue
        value = getattr(enum, name)
        if getattr(value, 'value', value) == desired:
            return value

    normalized = desired.upper().replace('/', '_').replace('-', '_').replace('.', '_')
    if hasattr(enum, normalized):
        return getattr(enum, normalized)

    return desired
