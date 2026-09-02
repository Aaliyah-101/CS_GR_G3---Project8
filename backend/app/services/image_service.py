import os
from pathlib import Path

from huggingface_hub import InferenceClient


# ============================================================
# CONFIGURATION
# ============================================================

MODEL_NAME = "Qwen/Qwen-Image"
PROVIDER = "wavespeed"

BASE_DIR = Path(__file__).resolve().parent.parent
IMAGE_DIR = BASE_DIR / "generated_images"

IMAGE_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ============================================================
# CONFIGURATION CHECK
# ============================================================

def is_configured() -> bool:

    return bool(
        os.getenv("HF_TOKEN")
    )


# ============================================================
# IMAGE GENERATION
# ============================================================

def generate_panel_image(
    prompt: str,
    filename: str
):

    token = os.getenv("HF_TOKEN")

    if not token:
        raise RuntimeError(
            "HF_TOKEN is not configured."
        )


    print("\n========================================")
    print("IMAGE GENERATION REQUEST")
    print("========================================")
    print(f"Model: {MODEL_NAME}")
    print(f"Provider: {PROVIDER}")
    print(f"Prompt: {prompt}")
    print("========================================\n")


    client = InferenceClient(
        provider=PROVIDER,
        api_key=token,
    )


    image = client.text_to_image(
        prompt=prompt,
        model=MODEL_NAME,
    )


    output_path = IMAGE_DIR / filename

    image.save(output_path)


    print("\n========================================")
    print("IMAGE GENERATED")
    print("========================================")
    print(f"Saved to: {output_path}")
    print("========================================\n")


    return output_path