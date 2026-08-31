from fastapi import APIRouter
from pydantic import BaseModel
from typing import List


router = APIRouter()


# ============================================================
# PANEL GENERATION REQUEST
# ============================================================

class PanelRequest(BaseModel):

    scene_id: str

    caption: str

    image_prompt: str

    characters: List[str] = []

    art_key: str = "village"


# ============================================================
# PANEL GENERATION
# ============================================================

@router.post("/generate-panel")
def generate_panel(request: PanelRequest):

    """
    Temporary panel-generation endpoint.

    For now this simulates the image-generation service.
    Later this function will call the actual LVM/image
    generation model.
    """

    return {

        "message": "Panel generation endpoint is working!",

        "panel": {

            "scene_id": request.scene_id,

            "caption": request.caption,

            "image_prompt": request.image_prompt,

            "characters": request.characters,

            "art_key": request.art_key,

            # Temporary placeholder.
            # PanelGenStep will use this to determine
            # whether a generated image exists.
            "image_url": None,

            "status": "ready_for_generation"

        }

    }