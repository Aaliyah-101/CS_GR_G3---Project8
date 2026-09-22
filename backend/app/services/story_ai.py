import json

from app.services.qwen_service import generate_text

import re

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
):

    prompt = f"""
You are the AI storytelling engine for VisualUG, an application
that transforms complex public information into understandable
visual stories for Ugandan audiences.

Create a short educational visual story using the information below.

TITLE:
{title}

CATEGORY:
{category}

TONE:
{tone}

AUDIENCE:
{audience}

LANGUAGE:
{language}

SOURCE INFORMATION:
{source_text}

Your task is to:

1. Identify the important factual information.
2. Create a simple protagonist appropriate for a Ugandan audience.
3. Create a clear narrative arc.
4. Break the story into exactly 7 visual scenes.
5. Each scene must have:
   - scene number
   - caption
   - image prompt
   - art key
   - characters
6. Keep the story educational and easy to understand.
7. Use culturally appropriate Ugandan settings and characters.
8. Do not invent medical or scientific facts that are not supported
   by the source information.
9. The image prompts should describe what should appear visually.
10. Avoid putting unnecessary written text inside generated images.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "title": "string",
    "category": "string",
    "tone": "string",
    "audience": "string",
    "language": "string",

    "narrative": {{
        "protagonist": "string",
        "arc": "string"
    }},

    "facts": [
        {{
            "id": "fact-1",
            "text": "string"
        }}
    ],

    "scenes": [
        {{
            "id": "scene-1",
            "sceneNumber": 1,
            "caption": "string",
            "imagePrompt": "string",
            "imageUrl": null,
            "artKey": "string",
            "characters": ["string"]
        }}
    ]
}}
"""

    response = generate_text(prompt)

    # Remove possible markdown code fences
    response = response.strip()

    if response.startswith("```json"):
        response = response[7:]

    if response.startswith("```"):
        response = response[3:]

    if response.endswith("```"):
        response = response[:-3]

    response = response.strip()

    try:
        story = safe_json_loads(response)
    except json.JSONDecodeError as e:
        raise RuntimeError(
            f"Qwen returned invalid JSON: {e}\n\n"
            f"Response:\n{response}"
        )

    return story