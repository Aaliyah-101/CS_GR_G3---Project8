"""
Image service for VisualUG.

Generates panel images from text prompts using Cloudflare Workers AI
(FLUX Schnell model — free tier, ~1,000 images/day).

Images are uploaded to Cloudinary so they persist across server restarts.
The function returns the public Cloudinary HTTPS URL (a string), which
can be stored directly in the database and rendered by any browser.
"""

import os
import base64
from pathlib import Path

import requests
import cloudinary
import cloudinary.uploader

# ============================================================
# CONFIGURATION
# ============================================================

CF_ACCOUNT_ID = os.getenv("CLOUDFLARE_ACCOUNT_ID")
CF_API_TOKEN = os.getenv("CLOUDFLARE_API_TOKEN")

CF_MODEL = "@cf/black-forest-labs/flux-1-schnell"

# Local fallback directory — only used if Cloudinary is not configured.
BASE_DIR = Path(__file__).resolve().parent.parent
IMAGE_DIR = BASE_DIR / "generated_images"
IMAGE_DIR.mkdir(parents=True, exist_ok=True)

# Configure Cloudinary (safe to call multiple times)
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)


# ============================================================
# CONFIGURATION CHECK
# ============================================================

def is_configured() -> bool:
    return bool(CF_ACCOUNT_ID and CF_API_TOKEN)


def is_cloudinary_configured() -> bool:
    return bool(
        os.getenv("CLOUDINARY_CLOUD_NAME")
        and os.getenv("CLOUDINARY_API_KEY")
        and os.getenv("CLOUDINARY_API_SECRET")
    )


# ============================================================
# IMAGE GENERATION
# ============================================================

def generate_panel_image(prompt: str, filename: str) -> str:
    """
    Generate an image from a prompt and upload it to Cloudinary.

    Returns:
        str: the public HTTPS URL of the uploaded image
             (e.g. https://res.cloudinary.com/.../visualug/scene-1.png)

    If Cloudinary is not configured, falls back to saving the image
    locally and returns the legacy "/generated-images/..." path.
    """

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
        "steps": 4,
    }

    response = requests.post(url, headers=headers, json=payload, timeout=180)
    response.raise_for_status()

    data = response.json()

    if not data.get("success"):
        raise RuntimeError(f"Cloudflare Workers AI error: {data.get('errors')}")

    img_b64 = data["result"]["image"]
    img_bytes = base64.b64decode(img_b64)

    # --------------------------------------------------------
    # Upload to Cloudinary (preferred)
    # --------------------------------------------------------

    if is_cloudinary_configured():
        print("\nUploading to Cloudinary...")

        public_id = filename.rsplit(".", 1)[0]  # strip .png

        result = cloudinary.uploader.upload(
            img_bytes,
            public_id=public_id,
            folder="visualug",
            resource_type="image",
            overwrite=True,
        )

        secure_url = result["secure_url"]

        print("\n========================================")
        print("IMAGE UPLOADED")
        print("========================================")
        print(f"URL:   {secure_url}")
        print(f"Bytes: {len(img_bytes)}")
        print("========================================\n")

        return secure_url

    # --------------------------------------------------------
    # Fallback: save locally (for offline dev)
    # --------------------------------------------------------

    print("\nCloudinary not configured — saving locally instead.")

    output_path = IMAGE_DIR / filename
    with open(output_path, "wb") as f:
        f.write(img_bytes)

    local_url = f"/generated-images/{filename}"

    print("\n========================================")
    print("IMAGE SAVED LOCALLY")
    print("========================================")
    print(f"Path:  {output_path}")
    print(f"URL:   {local_url}")
    print(f"Bytes: {len(img_bytes)}")
    print("========================================\n")

    return local_url