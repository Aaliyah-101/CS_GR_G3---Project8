"""
Image service for VisualUG.

Generates panel images from text prompts using the fine-tuned
Uganda FLUX model deployed on Modal.

Images are uploaded to Cloudinary so they persist across server restarts.
The function returns the public Cloudinary HTTPS URL (a string), which
can be stored directly in the database and rendered by any browser.
"""

import os
from pathlib import Path

import requests
import cloudinary
import cloudinary.uploader

# ============================================================
# CONFIGURATION
# ============================================================

MODAL_IMAGE_API_URL = os.getenv(
    "MODAL_IMAGE_API_URL",
    "https://kajjabwangulester--uganda-flux-web.modal.run",
)
MODAL_IMAGE_API_KEY = os.getenv("MODAL_IMAGE_API_KEY")

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
    return bool(MODAL_IMAGE_API_URL and MODAL_IMAGE_API_KEY)


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
    Generate an image from a prompt via the fine-tuned Modal FLUX API
    and upload it to Cloudinary.

    Returns:
        str: the public HTTPS URL of the uploaded image.

    If Cloudinary is not configured, falls back to saving the image
    locally and returns the legacy "/generated-images/..." path.
    """

    if not is_configured():
        raise RuntimeError(
            "Modal image API not configured. "
            "Set MODAL_IMAGE_API_URL and MODAL_IMAGE_API_KEY."
        )

    print("\n========================================")
    print("IMAGE GENERATION REQUEST")
    print("========================================")
    print(f"Provider: Modal (fine-tuned FLUX)")
    print(f"URL:      {MODAL_IMAGE_API_URL}")
    print(f"Prompt:   {prompt}")
    print("========================================\n")

    url = f"{MODAL_IMAGE_API_URL.rstrip('/')}/generate"

    headers = {
        "Content-Type": "application/json",
        "X-API-Key": MODAL_IMAGE_API_KEY,
    }

    payload = {
        "prompt": prompt,
        "steps": 30,
        "enrich": True,
    }

    # The API returns raw PNG bytes, so give it plenty of time.
    # Doc: 60–90s warm, up to 2–3 min on cold start.
    response = requests.post(
        url,
        headers=headers,
        json=payload,
        timeout=300,
    )

    if not response.ok:
        # Errors from Modal are JSON, not PNG.
        try:
            err = response.json()
            detail = err.get("detail", response.text)
        except Exception:
            detail = response.text or response.reason
        raise RuntimeError(
            f"Modal image generation failed ({response.status_code}): {detail}"
        )

    # Success — response body is the raw PNG.
    img_bytes = response.content

    if not img_bytes or len(img_bytes) < 1000:
        raise RuntimeError(
            f"Modal returned an unexpected response: "
            f"{len(img_bytes)} bytes, content-type="
            f"{response.headers.get('content-type')}"
        )

    print(f"Received {len(img_bytes)} bytes of PNG data.")

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