from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

from app.services.image_service import generate_panel_image


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
    Generate an actual visual panel from the scene image prompt.
    The image is uploaded to Cloudinary (if configured) and the
    returned URL is used directly.
    """

    # --------------------------------------------------------
    # Build a richer visual prompt
    # --------------------------------------------------------

    character_description = ""

    if request.characters:

        character_description = (
            "Characters in the scene: "
            + ", ".join(request.characters)
            + ". "
        )


    final_prompt = f"""
Create a high-quality visual storytelling panel for a Ugandan
educational comic.

Scene:
{request.image_prompt}

{character_description}

Visual style:
- culturally appropriate Ugandan environment
- warm, expressive storytelling
- clear character poses and emotions
- visually consistent comic illustration
- cinematic composition
- detailed background
- suitable for public education
- no unnecessary written text inside the image
- no speech bubbles
- no captions
- no logos

The image should clearly communicate the action described in
the scene.
"""


    # --------------------------------------------------------
    # Generate filename (used as Cloudinary public_id)
    # --------------------------------------------------------

    filename = (
        f"{request.scene_id}_{request.art_key}.png"
    )


    # --------------------------------------------------------
    # Generate image (uploads to Cloudinary, returns URL)
    # --------------------------------------------------------

    image_url = generate_panel_image(
        prompt=final_prompt,
        filename=filename
    )


    # --------------------------------------------------------
    # Return result
    # --------------------------------------------------------

    return {

        "message": "Panel generated successfully!",

        "panel": {

            "scene_id": request.scene_id,

            "caption": request.caption,

            "image_prompt": request.image_prompt,

            "characters": request.characters,

            "art_key": request.art_key,

            "image_url": image_url,

            "status": "generated"

        }

    }