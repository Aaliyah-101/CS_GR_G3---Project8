"""
Scene Planner service for VisualUG.

Calls the fine-tuned Phi-4-mini storyboard API deployed on Modal
and returns a JSON storyboard.

The response is adapted to the same shape the frontend already
expects (title, narrative, facts, scenes with imagePrompt).

Every image prompt gets:
  1. A comic-style prefix (graphic-novel look)
  2. A text-free contract (no speech bubbles, captions, lettering)
so the FLUX image model produces clean comic panels.
"""

import os
from dotenv import load_dotenv
import requests

load_dotenv()

# ============================================================
# CONFIGURATION
# ============================================================

SCENE_PLANNER_URL = os.getenv(
    "SCENE_PLANNER_URL",
    "https://kajjabwangulester--uganda-phi-web.modal.run",
)

SCENE_PLANNER_API_KEY = os.getenv("SCENE_PLANNER_API_KEY")

# Comic-style prefix added to every image prompt.
COMIC_STYLE_PREFIX = (
    "A modern graphic-novel style illustration, clean bold ink "
    "linework, dynamic cel shading, expressive characters, rich "
    "saturated color palette, comic book aesthetic. "
)

# Appended to every image prompt before it is sent to the FLUX API.
# FLUX ignores negative-prompt parameters, so we state this in the
# positive prompt itself.
TEXT_FREE_CONTRACT = (
    " No text, no speech bubbles, no thought bubbles, no captions, "
    "no lettering, no words, no signs, no labels, no logos, "
    "no watermarks anywhere in the image."
)


# ============================================================
# CONFIGURATION CHECK
# ============================================================

def is_configured() -> bool:
    return bool(SCENE_PLANNER_URL and SCENE_PLANNER_API_KEY)


# ============================================================
# AUDIENCE / SETTING MAPPING
# ============================================================

_ALLOWED_AUDIENCES = {
    "elderly community members",
    "pregnant women",
    "parents and caregivers",
    "community health workers",
    "youth and adolescents",
    "school-age children",
}

_AUDIENCE_ALIASES = {
    "rural families": "parents and caregivers",
    "families": "parents and caregivers",
    "parents": "parents and caregivers",
    "mothers": "pregnant women",
    "pregnant mothers": "pregnant women",
    "general public": "parents and caregivers",
    "general": "parents and caregivers",
    "youth": "youth and adolescents",
    "adolescents": "youth and adolescents",
    "children": "school-age children",
    "students": "school-age children",
    "health workers": "community health workers",
    "vhts": "community health workers",
    "elderly": "elderly community members",
}

_ALLOWED_SETTINGS = {
    "urban market",
    "rural health centre",
    "primary school",
    "village community gathering",
    "rural Ugandan home",
    "district hospital waiting area",
}


def _normalize_audience(audience: str) -> str:
    if not audience:
        return "parents and caregivers"
    a = audience.strip().lower()
    if a in _ALLOWED_AUDIENCES:
        return a
    return _AUDIENCE_ALIASES.get(a, "parents and caregivers")


def _normalize_setting(setting: str) -> str:
    if not setting:
        return "rural Ugandan home"
    s = setting.strip().lower()
    if s in _ALLOWED_SETTINGS:
        return s
    return "rural Ugandan home"


# ============================================================
# STORYBOARD GENERATION
# ============================================================

def generate_storyboard(
    source_text: str,
    audience: str,
    setting: str = "rural Ugandan home",
    topic: str = "",
    subtopic: str = "",
) -> dict:
    """
    Call the Modal scene planner and return the raw storyboard dict.
    """

    if not is_configured():
        raise RuntimeError(
            "Scene planner not configured. "
            "Set SCENE_PLANNER_URL and SCENE_PLANNER_API_KEY."
        )

    if not source_text or len(source_text.strip()) < 20:
        raise ValueError("source_text must be at least 20 characters.")

    audience = _normalize_audience(audience)
    setting = _normalize_setting(setting)

    url = f"{SCENE_PLANNER_URL.rstrip('/')}/generate"

    headers = {
        "Content-Type": "application/json",
        "X-API-Key": SCENE_PLANNER_API_KEY,
    }

    payload = {
        "source_text": source_text,
        "audience": audience,
        "setting": setting,
    }
    if topic:
        payload["topic"] = topic
    if subtopic:
        payload["subtopic"] = subtopic

    print("\n========================================")
    print("SCENE PLANNER REQUEST")
    print("========================================")
    print(f"URL:      {url}")
    print(f"Audience: {audience}")
    print(f"Setting:  {setting}")
    print(f"Text:     {source_text[:120]}...")
    print("========================================\n")

    response = requests.post(
        url,
        headers=headers,
        json=payload,
        timeout=300,
    )
    response.raise_for_status()

    data = response.json()

    print("\n========================================")
    print("SCENE PLANNER RESPONSE")
    print("========================================")
    print(f"Valid:  {data.get('valid')}")
    print(f"Scenes: {len(data.get('storyboard', {}).get('scenes', []))}")
    print("========================================\n")

    return data


# ============================================================
# ADAPTER — storyboard → VisualUG story shape
# ============================================================

def _build_image_prompt(visual_prompt: str) -> str:
    """
    Assemble the final prompt sent to the image model:
      <comic style prefix> + <scene prompt> + <text-free contract>
    """
    scene_text = (visual_prompt or "").strip()

    if scene_text and not scene_text.endswith((".", "!", "?")):
        scene_text += "."

    parts = [COMIC_STYLE_PREFIX.strip()]

    if scene_text:
        parts.append(scene_text)

    parts.append(TEXT_FREE_CONTRACT.strip())

    return " ".join(parts)


def storyboard_to_visualug_story(
    data: dict,
    title: str = "",
    category: str = "",
    tone: str = "",
    audience: str = "",
    language: str = "English",
) -> dict:
    """
    Convert a scene planner response into the story shape the
    frontend, DB, and image pipeline already expect.

    Every scene's imagePrompt gets:
      - comic style prefix
      - original visual prompt from Phi-4
      - text-free contract
    """

    storyboard = data.get("storyboard", {}) or {}
    raw_scenes = storyboard.get("scenes", []) or []

    scenes = []

    for i, scene in enumerate(raw_scenes, start=1):
        scene_num = scene.get("scene_number", i)
        caption = scene.get("caption", "")
        visual_prompt = scene.get("visual_prompt", "")

        image_prompt = _build_image_prompt(visual_prompt)

        scenes.append({
            "id": f"scene-{scene_num}",
            "sceneNumber": scene_num,
            "caption": caption,
            "imagePrompt": image_prompt,
            "imageUrl": None,
            "artKey": f"scene-{scene_num}",
            "characters": [],
        })

    health_message = storyboard.get("health_message", "")
    story_title = storyboard.get("story_title", "") or title
    story_summary = storyboard.get("story_summary", "")

    facts = []
    if health_message:
        facts.append({
            "id": "fact-1",
            "text": health_message,
        })

    return {
        "title": story_title,
        "category": category or "Health",
        "tone": tone or "Educational",
        "audience": audience or "General",
        "language": language or "English",
        "narrative": {
            "protagonist": "",
            "arc": story_summary,
        },
        "facts": facts,
        "scenes": scenes,
        "valid": data.get("valid", True),
        "problems": data.get("problems", []),
        "warnings": data.get("warnings", []),
    }