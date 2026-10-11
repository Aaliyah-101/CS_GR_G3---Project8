import json
import re

from app.services.scene_service import (
    generate_storyboard,
    storyboard_to_visualug_story,
)

def safe_json_loads(text):
    """Parse JSON, with a repair fallback for common LLM errors like unescaped quotes."""
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Try to fix unescaped quotes inside strings
        repaired = re.sub(r'(?<!\\)"(?=[^:,\[\]{}\n]*")', '\\\\"', text)
        try:
            return json.loads(repaired)
        except json.JSONDecodeError:
            pass
        raise

def generate_visualug_story(
    title: str,
    category: str,
    tone: str,
    source_text: str,
    language: str,
    audience: str,
    setting: str = "rural Ugandan home",
):

    data = generate_storyboard(
        source_text=source_text,
        audience=audience,
        setting=setting,
        topic=title,
        subtopic=category,
    )

    story = storyboard_to_visualug_story(
        data,
        title=title,
        category=category,
        tone=tone,
        audience=audience,
        language=language,
    )

    return story