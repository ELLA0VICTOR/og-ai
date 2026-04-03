import logging
from typing import Optional

import opengradient as og

from app.config import settings

logger = logging.getLogger(__name__)
_llm: Optional[og.LLM] = None


def get_llm() -> og.LLM:
    global _llm
    if _llm is None:
        if not settings.OG_PRIVATE_KEY:
            raise RuntimeError('OG_PRIVATE_KEY is not set')

        kwargs = {'private_key': settings.OG_PRIVATE_KEY}
        if settings.OG_LLM_SERVER_URL:
            kwargs['llm_server_url'] = settings.OG_LLM_SERVER_URL

        _llm = og.LLM(**kwargs)

        try:
            _llm.ensure_opg_approval(opg_amount=10.0)
        except Exception as exc:
            message = str(exc).lower()
            if any(fragment in message for fragment in ('nonce too low', 'already known', 'replacement transaction underpriced')):
                logger.warning('Skipping duplicate approval attempt: %s', exc)
            else:
                raise

    return _llm


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
