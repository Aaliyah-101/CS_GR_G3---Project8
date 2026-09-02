"""
Qwen2.5-VL service for VisualUG.

VisualUG uses Qwen2.5-VL as the reasoning and vision-language
layer. The model itself is accessed through Hugging Face
Inference rather than being loaded locally.

This keeps the application lightweight enough to develop on
an 8 GB MacBook Air.
"""

import os

from dotenv import load_dotenv
from huggingface_hub import InferenceClient

load_dotenv()

# ============================================================
# CONFIGURATION
# ============================================================

MODEL_NAME = "Qwen/Qwen2.5-72B-Instruct"
PROVIDER = "novita"

HF_TOKEN = os.getenv("HF_TOKEN")


# ============================================================
# CONFIGURATION CHECK
# ============================================================

def is_configured():
    return bool(HF_TOKEN)


# ============================================================
# QWEN CLIENT
# ============================================================

def get_client():

    if not HF_TOKEN:
        raise RuntimeError(
            "HF_TOKEN is not configured."
        )

    return InferenceClient(
        provider=PROVIDER,
        api_key=HF_TOKEN,
    )


# ============================================================
# TEXT GENERATION
# ============================================================

def generate_text(prompt: str) -> str:

    client = get_client()

    print("\n========================================")
    print("QWEN REQUEST")
    print("========================================")
    print(f"Model: {MODEL_NAME}")
    print(f"Provider: {PROVIDER}")
    print(f"Prompt: {prompt}")
    print("========================================")

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        max_tokens=1000,
        temperature=0.7,
    )

    result = response.choices[0].message.content

    print("\n========================================")
    print("QWEN RESPONSE")
    print("========================================")
    print(result)
    print("========================================\n")

    return result