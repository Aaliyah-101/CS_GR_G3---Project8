from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware

from app.routes.story import router as story_router
from app.routes.panel import router as panel_router
from app.database.database import engine, Base
from app.database import models


# Create database tables
Base.metadata.create_all(bind=engine)

#storing generated images in a directory called generated_images
BASE_DIR = Path(__file__).resolve().parent

GENERATED_IMAGES_DIR = BASE_DIR / "generated_images"

GENERATED_IMAGES_DIR.mkdir(
    parents=True,
    exist_ok=True
)

app = FastAPI(
    title="VisualUG API",
    description="LVM-Powered Visual Storytelling for Ugandan Public Communication",
    version="1.0.0"
)
app.mount(
    "/generated-images",
    StaticFiles(directory=GENERATED_IMAGES_DIR),
    name="generated-images"
)



# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
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
# ============================================================
# PANEL ROUTES
# ============================================================

app.include_router(
    panel_router,
    prefix="/api/story",
    tags=["Panel"]
)