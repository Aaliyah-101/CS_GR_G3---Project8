

"""
Qwen service for VisualUG.

Talks to the vLLM endpoint running on Crane Cloud.
Strips Qwen3's <think>...</think> reasoning block so downstream
code (story_ai.py) can parse the JSON response cleanly.
"""

import os
import requests

# ============================================================
# CONFIGURATION
# ============================================================

VLLM_URL = os.getenv(
    "VLLM_URL",
    "https://qwen-ugandan-health-c05a6f56.ahumain.cranecloud.io/v1/chat/completions",
)

VLLM_MODEL = os.getenv("VLLM_MODEL", "Qwen/Qwen3-0.6B")

# ============================================================
# CONFIGURATION CHECK
# ============================================================

def is_configured():
    return bool(VLLM_URL)

# ============================================================
# TEXT GENERATION
# ============================================================

def generate_text(prompt: str) -> str:

    print("\n========================================")
    print("QWEN REQUEST")
    print("========================================")
    print(f"URL: {VLLM_URL}")
    print(f"Model: {VLLM_MODEL}")
    print(f"Prompt: {prompt[:200]}...")
    print("========================================")

    response = requests.post(
        VLLM_URL,
        json={
            "model": VLLM_MODEL,
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 4000,
            "temperature": 0.7,
        },
        timeout=300,
    )
    response.raise_for_status()

    result = response.json()["choices"][0]["message"]["content"]

    # ---- Strip Qwen3's <think>...</think> block ----
    # Qwen3-0.6B emits a reasoning block before the answer.
    # The real answer is whatever comes after </think>.
    # Qwen2.5 (our fine-tune) does not do this, so this is a no-op for it.
    if "</think>" in result:
        result = result.split("</think>", 1)[1].lstrip()

    print("\n========================================")
    print("QWEN RESPONSE")
    print("========================================")
    print(result[:500])
    print("...")
    print("========================================\n")

    return result