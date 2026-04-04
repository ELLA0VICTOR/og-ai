from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.og_client import get_llm
from app.routers import ask, debug, plan, sources, health


@asynccontextmanager
async def lifespan(app: FastAPI):
    print('Initializing OpenGradient client...')
    get_llm()
    print(f'OpenGradient model target: {settings.OG_MODEL}')
    print('Skipping eager approval and embedding warmup during startup.')
    print('OG AI backend ready.')
    yield
    print('OG AI backend shutting down.')


app = FastAPI(
    title='OG AI Backend',
    description='OpenGradient developer copilot - docs-grounded, TEE-verified',
    version='0.1.0',
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(ask.router, prefix='/api')
app.include_router(debug.router, prefix='/api')
app.include_router(plan.router, prefix='/api')
app.include_router(sources.router, prefix='/api')
app.include_router(health.router, prefix='/api')


@app.get('/')
async def root():
    return {
        'name': 'OG AI Backend',
        'version': '0.1.0',
        'docs': '/docs',
        'health': '/api/health',
    }
