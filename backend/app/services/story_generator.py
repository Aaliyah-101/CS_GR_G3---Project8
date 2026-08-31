import re


# ============================================================
# 1. SEMANTIC EXTRACTION
# ============================================================

def extract_facts(source_text: str):
    """
    Extract factual statements from the source text.

    This is the initial semantic extraction layer.
    Later, this can be replaced with an LLM/LVM-powered
    semantic extraction system.
    """

    if not source_text or not source_text.strip():
        return []

    sentences = re.split(
        r'(?<=[.!?])\s+',
        source_text.strip()
    )

    facts = []

    for index, sentence in enumerate(sentences, start=1):

        sentence = sentence.strip()

        if not sentence:
            continue

        facts.append({
            "id": f"fact-{index}",
            "text": sentence,
            "included": True
        })

    return facts


# ============================================================
# 2. AUDIENCE MODELLING
# ============================================================

def suggest_audience(category: str):

    category = (category or "").lower()

    if "road" in category or "safety" in category:
        return "General Public"

    if "health" in category or "malaria" in category:
        return "Families and Communities"

    if "education" in category:
        return "Students and Parents"

    if "tourism" in category or "culture" in category:
        return "Tourists and the General Public"

    if "environment" in category or "climate" in category:
        return "Farmers and Local Communities"

    return "General Public"


# ============================================================
# 3. NARRATIVE PLANNING
# ============================================================

def create_narrative(
    title: str,
    category: str,
    tone: str,
    audience: str
):
    """
    Create an initial narrative structure.
    """

    category_lower = (category or "").lower()

    protagonist = (
        "A young Ugandan community member"
    )

    if (
        "road" in category_lower
        or "safety" in category_lower
    ):
        protagonist = (
            "A young road user learning "
            "to make safer choices"
        )

    elif "education" in category_lower:

        protagonist = (
            "A student determined to "
            "continue their education"
        )

    elif (
        "tourism" in category_lower
        or "culture" in category_lower
    ):

        protagonist = (
            "A young traveler discovering Uganda"
        )

    elif (
        "environment" in category_lower
        or "climate" in category_lower
    ):

        protagonist = (
            "A farmer adapting to "
            "changing environmental conditions"
        )

    arc = (
        f"{protagonist} encounters an everyday "
        f"challenge related to {category_lower}, "
        f"learns from the information provided, "
        f"and discovers practical actions that "
        f"can make a positive difference."
    )

    return {
        "protagonist": protagonist,
        "arc": arc
    }


# ============================================================
# 4. DETERMINE VISUAL SETTING
# ============================================================

def determine_art_key(category: str, fact_text: str = ""):
    """
    Choose a visual setting for a scene.

    This is currently rule-based. Later this decision can
    be made by an LLM/LVM scene-planning component.
    """

    category_text = (
        f"{category or ''} {fact_text or ''}"
    ).lower()


    if (
        "road" in category_text
        or "traffic" in category_text
        or "driv" in category_text
        or "motorcycle" in category_text
        or "helmet" in category_text
        or "pedestrian" in category_text
        or "crossing" in category_text
        or "vehicle" in category_text
    ):
        return "road"


    if (
        "malaria" in category_text
        or "health" in category_text
        or "clinic" in category_text
        or "hospital" in category_text
    ):
        return "clinic"


    if (
        "tourism" in category_text
        or "culture" in category_text
        or "heritage" in category_text
        or "tourist" in category_text
    ):
        return "heritage"


    if (
        "market" in category_text
        or "business" in category_text
        or "trading" in category_text
    ):
        return "market"


    if (
        "home" in category_text
        or "family" in category_text
        or "house" in category_text
    ):
        return "home"


    return "village"


# ============================================================
# 5. CREATE VISUAL PROMPT
# ============================================================

def create_image_prompt(
    caption: str,
    category: str,
    art_key: str,
    characters: str
):
    """
    Create a structured visual prompt.

    This prompt is what will eventually be passed to an
    image-generation/LVM service.
    """

    setting_descriptions = {

        "road": (
            "a Ugandan urban or peri-urban road, "
            "traffic signs, pedestrians and road users"
        ),

        "clinic": (
            "a Ugandan health centre or community clinic"
        ),

        "heritage": (
            "a Ugandan cultural or heritage setting, "
            "showing local architecture and environment"
        ),

        "market": (
            "a lively Ugandan local market"
        ),

        "home": (
            "a Ugandan family or residential setting"
        ),

        "village": (
            "a Ugandan community environment with "
            "local buildings, people and natural surroundings"
        ),
    }


    setting = setting_descriptions.get(
        art_key,
        setting_descriptions["village"]
    )


    return (
        f"Create a clear educational comic-style scene "
        f"set in Uganda. {setting}. "
        f"Show {characters} in a natural everyday situation. "
        f"The scene should visually communicate: {caption}. "
        f"Category: {category}. "
        f"Use consistent characters, expressive body language, "
        f"clear composition, culturally appropriate Ugandan "
        f"details, readable visual storytelling, and a hopeful "
        f"tone. Avoid unnecessary text inside the image."
    )


# ============================================================
# 6. STORYBOARD GENERATION
# ============================================================

def create_scenes(
    title: str,
    category: str,
    facts: list
):
    """
    Convert extracted facts into a structured storyboard.

    The storyboard contains:
        - caption
        - imagePrompt
        - characters
        - artKey
        - factId

    The structure is intentionally compatible with a future
    visual-generation/LVM pipeline.
    """

    scenes = []


    # --------------------------------------------------------
    # OPENING SCENE
    # --------------------------------------------------------

    opening_caption = (
        f"In Uganda, {title.lower()} is an issue "
        "that affects people in their everyday lives."
    )

    opening_art_key = determine_art_key(category)

    opening_characters = (
        "a young Ugandan road user and "
        "other community members"
        if opening_art_key == "road"
        else "community members"
    )


    scenes.append({

        "id": "scene-1",

        "caption": opening_caption,

        "imagePrompt": create_image_prompt(
            caption=opening_caption,
            category=category,
            art_key=opening_art_key,
            characters=opening_characters
        ),

        "characters": opening_characters,

        "artKey": opening_art_key,

        "factId": None,

    })


    # --------------------------------------------------------
    # FACT-BASED SCENES
    # --------------------------------------------------------

    for index, fact in enumerate(
        facts[:5],
        start=2
    ):

        fact_text = fact["text"]

        art_key = determine_art_key(
            category,
            fact_text
        )


        if art_key == "road":

            characters = (
                "a young road user, "
                "pedestrians and motorcycle riders"
            )

        elif art_key == "clinic":

            characters = (
                "a community member, "
                "a health worker and family members"
            )

        elif art_key == "heritage":

            characters = (
                "a young traveler and "
                "local community members"
            )

        elif art_key == "market":

            characters = (
                "local traders and community members"
            )

        else:

            characters = (
                "a young Ugandan community member "
                "and other local people"
            )


        scenes.append({

            "id": f"scene-{index}",

            "caption": fact_text,

            "imagePrompt": create_image_prompt(
                caption=fact_text,
                category=category,
                art_key=art_key,
                characters=characters
            ),

            "characters": characters,

            "artKey": art_key,

            "factId": fact["id"],

        })


    # --------------------------------------------------------
    # CLOSING SCENE
    # --------------------------------------------------------

    closing_caption = (
        "Small informed choices can help create "
        "safer and stronger communities."
    )

    closing_art_key = determine_art_key(category)

    closing_characters = (
        "Ugandan community members making "
        "responsible choices together"
    )


    scenes.append({

        "id": f"scene-{len(scenes) + 1}",

        "caption": closing_caption,

        "imagePrompt": create_image_prompt(
            caption=closing_caption,
            category=category,
            art_key=closing_art_key,
            characters=closing_characters
        ),

        "characters": closing_characters,

        "artKey": closing_art_key,

        "factId": None,

    })


    return scenes


# ============================================================
# 7. MAIN STORY GENERATION PIPELINE
# ============================================================

def generate_story(
    title: str,
    category: str,
    tone: str,
    source_text: str,
    language: str,
    audience: str | None
):
    """
    Main story-generation pipeline.

    Current architecture:

        Source information
              ↓
        Semantic extraction
              ↓
        Audience modelling
              ↓
        Narrative planning
              ↓
        Storyboard generation
              ↓
        Visual prompt generation

    The visual prompt layer can later be connected to an
    actual LVM/image-generation service.
    """


    # --------------------------------------------------------
    # 1. Semantic extraction
    # --------------------------------------------------------

    facts = extract_facts(source_text)


    # --------------------------------------------------------
    # 2. Audience modelling
    # --------------------------------------------------------

    selected_audience = (
    suggest_audience(category)
    if not audience or audience.lower() == "general"
    else audience
)


    # --------------------------------------------------------
    # 3. Narrative planning
    # --------------------------------------------------------

    narrative = create_narrative(
        title=title,
        category=category,
        tone=tone,
        audience=selected_audience
    )


    # --------------------------------------------------------
    # 4. Storyboard generation
    # --------------------------------------------------------

    scenes = create_scenes(
        title=title,
        category=category,
        facts=facts
    )


    # --------------------------------------------------------
    # 5. Return structured story
    # --------------------------------------------------------

    return {

        "title": title,

        "category": category,

        "tone": tone,

        "language": language,

        "audience": selected_audience,

        "facts": facts,

        "narrative": narrative,

        "scenes": scenes,

    }