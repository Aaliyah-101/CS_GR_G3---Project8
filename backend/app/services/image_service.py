# """
# Image service for VisualUG.

# Generates panel images from text prompts using Pollinations AI
# (free, no API key required).

# Same interface as before: generate_panel_image(prompt, filename)
# returns a Path to the saved image.
# """

# import os
# from pathlib import Path

# import requests


# # ============================================================
# # CONFIGURATION
# # ============================================================

# BASE_DIR = Path(__file__).resolve().parent.parent
# IMAGE_DIR = BASE_DIR / "generated_images"

# IMAGE_DIR.mkdir(parents=True, exist_ok=True)


# # ============================================================
# # CONFIGURATION CHECK
# # ============================================================

# def is_configured() -> bool:
#     # Pollinations AI is free and requires no API key
#     return True


# # ============================================================
# # IMAGE GENERATION
# # ============================================================

# def generate_panel_image(prompt: str, filename: str) -> Path:
#     """
#     Generate an image from a text prompt using Pollinations AI.
#     Saves the image to IMAGE_DIR/filename and returns the path.
#     """

#     print("\n========================================")
#     print("IMAGE GENERATION REQUEST")
#     print("========================================")
#     print(f"Provider: Pollinations AI")
#     print(f"Prompt: {prompt}")
#     print("========================================\n")

#     # Pollinations expects the prompt URL-encoded in the path
#     encoded_prompt = requests.utils.quote(prompt, safe="")

#     # Optional: add style + dimensions
#     url = (
#         f"https://image.pollinations.ai/prompt/{encoded_prompt}"
#         f"?width=1024&height=1024&nologo=true"
#     )

#     response = requests.get(url, timeout=120)
#     response.raise_for_status()

#     output_path = IMAGE_DIR / filename
#     with open(output_path, "wb") as f:
#         f.write(response.content)

#     print("\n========================================")
#     print("IMAGE GENERATED")
#     print("========================================")
#     print(f"Saved to: {output_path}")
#     print(f"Size: {len(response.content)} bytes")
#     print("========================================\n")

#     return output_path

"""
Image service for VisualUG.

Generates panel images from text prompts using Cloudflare Workers AI
(FLUX Schnell model — free tier, ~1,000 images/day).

Same interface as before: generate_panel_image(prompt, filename)
returns a Path to the saved image.
"""

import os
import base64
from pathlib import Path

import requests

# ============================================================
# CONFIGURATION
# ============================================================

CF_ACCOUNT_ID = os.getenv("CLOUDFLARE_ACCOUNT_ID")
CF_API_TOKEN = os.getenv("CLOUDFLARE_API_TOKEN")

CF_MODEL = "@cf/black-forest-labs/flux-1-schnell"

BASE_DIR = Path(__file__).resolve().parent.parent
IMAGE_DIR = BASE_DIR / "generated_images"
IMAGE_DIR.mkdir(parents=True, exist_ok=True)


# ============================================================
# CONFIGURATION CHECK
# ============================================================

def is_configured() -> bool:
    return bool(CF_ACCOUNT_ID and CF_API_TOKEN)


# ============================================================
# IMAGE GENERATION
# ============================================================

def generate_panel_image(prompt: str, filename: str) -> Path:

    if not is_configured():
        raise RuntimeError(
            "Cloudflare credentials not configured. "
            "Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN."
        )

    print("\n========================================")
    print("IMAGE GENERATION REQUEST")
    print("========================================")
    print(f"Provider: Cloudflare Workers AI")
    print(f"Model:    {CF_MODEL}")
    print(f"Prompt:   {prompt}")
    print("========================================\n")

    url = (
        f"https://api.cloudflare.com/client/v4/accounts/"
        f"{CF_ACCOUNT_ID}/ai/run/{CF_MODEL}"
    )

    headers = {
        "Authorization": f"Bearer {CF_API_TOKEN}",
        "Content-Type": "application/json",
    }

    payload = {
        "prompt": prompt,
        # FLUX Schnell supports "steps" (1-8 is typical). 4 is a good balance.
        "steps": 4,
    }

    response = requests.post(url, headers=headers, json=payload, timeout=180)
    response.raise_for_status()

    data = response.json()

    if not data.get("success"):
        raise RuntimeError(f"Cloudflare Workers AI error: {data.get('errors')}")

    # FLUX returns Base64-encoded image data inside result.image
    img_b64 = data["result"]["image"]
    img_bytes = base64.b64decode(img_b64)

    output_path = IMAGE_DIR / filename
    with open(output_path, "wb") as f:
        f.write(img_bytes)

    print("\n========================================")
    print("IMAGE GENERATED")
    print("========================================")
    print(f"Saved to: {output_path}")
    print(f"Size:     {len(img_bytes)} bytes")
    print("========================================\n")

    return output_path