from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.story import router as story_router
from app.database.database import engine, Base
from app.database import models


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="VisualUG API",
    description="LVM-Powered Visual Storytelling for Ugandan Public Communication",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():
    return {
        "message": "VisualUG API is running"
    }


# ============================================================
# HEALTH
# ============================================================

@app.get("/api/health")
def health():
    return {
        "status": "healthy"
    }


# ============================================================
# STORY ROUTES
# ============================================================

app.include_router(
    story_router,
    prefix="/api/story",
    tags=["Story"]
)