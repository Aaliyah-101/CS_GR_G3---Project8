"""
Image service for VisualUG.

Generates panel images from text prompts using Pollinations AI
(free, no API key required).

Same interface as before: generate_panel_image(prompt, filename)
returns a Path to the saved image.
"""

import os
from pathlib import Path

import requests


# ============================================================
# CONFIGURATION
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent
IMAGE_DIR = BASE_DIR / "generated_images"

IMAGE_DIR.mkdir(parents=True, exist_ok=True)


# ============================================================
# CONFIGURATION CHECK
# ============================================================

def is_configured() -> bool:
    # Pollinations AI is free and requires no API key
    return True


# ============================================================
# IMAGE GENERATION
# ============================================================

def generate_panel_image(prompt: str, filename: str) -> Path:
    """
    Generate an image from a text prompt using Pollinations AI.
    Saves the image to IMAGE_DIR/filename and returns the path.
    """

    print("\n========================================")
    print("IMAGE GENERATION REQUEST")
    print("========================================")
    print(f"Provider: Pollinations AI")
    print(f"Prompt: {prompt}")
    print("========================================\n")

    # Pollinations expects the prompt URL-encoded in the path
    encoded_prompt = requests.utils.quote(prompt, safe="")

    # Optional: add style + dimensions
    url = (
        f"https://image.pollinations.ai/prompt/{encoded_prompt}"
        f"?width=1024&height=1024&nologo=true"
    )

    response = requests.get(url, timeout=120)
    response.raise_for_status()

    output_path = IMAGE_DIR / filename
    with open(output_path, "wb") as f:
        f.write(response.content)

    print("\n========================================")
    print("IMAGE GENERATED")
    print("========================================")
    print(f"Saved to: {output_path}")
    print(f"Size: {len(response.content)} bytes")
    print("========================================\n")

    return output_path