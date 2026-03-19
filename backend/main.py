"""
ISSR Trust Attribution System — FastAPI entry point.

All route handlers live in the `routes/` package.
Configuration, models, and storage are in their own modules.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.session import router as session_router
from routes.events import router as events_router
from routes.export import router as export_router

app = FastAPI(
    title="Humanlike AI Systems and Trust Attribution",
    description="A project to explore the relationship between humanlike AI systems and trust attribution.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register routers ─────────────────────────────────────────────
app.include_router(session_router)
app.include_router(events_router)
app.include_router(export_router)


@app.get("/")
def root():
    return {"status": "System successfully running", "version": "1.0.0"}