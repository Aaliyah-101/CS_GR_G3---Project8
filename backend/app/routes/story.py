from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.models.story import StoryRequest
from app.database.models import Story, StoryFact, StoryScene
from app.database.database import get_db

from app.services.story_generator import generate_story


router = APIRouter()


# ============================================================
# GENERATE STORY
# ============================================================

@router.post("/generate")
def generate_story_endpoint(request: StoryRequest):

    story = generate_story(
        title=request.title,
        category=request.category,
        tone=request.tone,
        source_text=request.source_text,
        language=request.language,
        audience=request.audience,
    )

    return {
        "message": "Story generated successfully!",
        "story": story
    }


# ============================================================
# PUBLISH STORY
# ============================================================

@router.post("/publish")
def publish_story(
    request: dict,
    db: Session = Depends(get_db)
):

    print("\n========================================")
    print("PUBLISHED STORY RECEIVED")
    print("========================================")
    print(request)
    print("========================================\n")


    # -----------------------------------------
    # Create main Story record
    # -----------------------------------------

    audience = request.get("audience")

    if isinstance(audience, dict):
        audience = audience.get("label")

    narrative = request.get("narrative", {})


    db_story = Story(
        title=request.get("title", ""),
        category=request.get("category"),
        tone=request.get("tone"),
        audience=audience,
        language=request.get("language"),
        audio_narration=request.get(
            "audioNarration",
            False
        ),
        protagonist=narrative.get(
            "protagonist"
        ),
        narrative_arc=narrative.get(
            "arc"
        ),
    )

    db.add(db_story)

    # Get the generated story ID
    db.flush()


    # -----------------------------------------
    # Save facts
    # -----------------------------------------

    for fact in request.get("facts", []):

        db_fact = StoryFact(
            story_id=db_story.id,
            fact_id=fact.get("id"),
            text=fact.get("text")
        )

        db.add(db_fact)


    # -----------------------------------------
    # Save scenes
    # -----------------------------------------

    for index, scene in enumerate(
        request.get("scenes", []),
        start=1
    ):

        characters = scene.get(
            "characters",
            []
        )

        if isinstance(characters, list):
            characters = ", ".join(characters)


        db_scene = StoryScene(
            story_id=db_story.id,
            scene_id=scene.get("id"),
            scene_number=index,
            caption=scene.get("caption"),
            image_prompt=scene.get("imagePrompt"),
            image_url=scene.get("imageUrl"),
            art_key=scene.get("artKey"),
            characters=characters
        )

        db.add(db_scene)


    # -----------------------------------------
    # Commit everything
    # -----------------------------------------

    db.commit()

    db.refresh(db_story)


    print(
        f"Story saved with ID: {db_story.id}"
    )


    return {
        "message": "Story published successfully!",
        "story_id": db_story.id
    }
# ============================================================
# GET ALL PUBLISHED STORIES
# ============================================================

@router.get("/stories")
def get_stories(
    db: Session = Depends(get_db)
):

    stories = (
        db.query(Story)
        .order_by(Story.id.desc())
        .all()
    )

    results = []

    for story in stories:

        results.append({

            "id": story.id,

            "title": story.title,

            "category": story.category,

            "tone": story.tone,

            "audience": story.audience,

            "language": story.language,

            "audioNarration": story.audio_narration,

            "narrative": {
                "protagonist": story.protagonist,
                "arc": story.narrative_arc,
            },

            "facts": [
                {
                    "id": fact.fact_id,
                    "text": fact.text,
                }
                for fact in story.facts
            ],

            "scenes": [
                {
                    "id": scene.scene_id,
                    "sceneNumber": scene.scene_number,
                    "caption": scene.caption,
                    "imagePrompt": scene.image_prompt,
                    "imageUrl": scene.image_url,
                    "artKey": scene.art_key,
                    "characters": (
                        scene.characters.split(", ")
                        if scene.characters
                        else []
                    ),
                }
                for scene in story.scenes
            ],
        })

    return {
        "stories": results
    }


# ============================================================
# GET ONE PUBLISHED STORY
# ============================================================

@router.get("/stories/{story_id}")
def get_story(
    story_id: int,
    db: Session = Depends(get_db)
):

    story = (
        db.query(Story)
        .filter(
            Story.id == story_id
        )
        .first()
    )

    if not story:

        raise HTTPException(
            status_code=404,
            detail="Story not found."
        )


    return {

        "id": story.id,

        "title": story.title,

        "category": story.category,

        "tone": story.tone,

        "audience": story.audience,

        "language": story.language,

        "audioNarration": story.audio_narration,

        "narrative": {
            "protagonist": story.protagonist,
            "arc": story.narrative_arc,
        },

        "facts": [
            {
                "id": fact.fact_id,
                "text": fact.text,
            }
            for fact in story.facts
        ],

        "scenes": [
            {
                "id": scene.scene_id,
                "sceneNumber": scene.scene_number,
                "caption": scene.caption,
                "imagePrompt": scene.image_prompt,
                "imageUrl": scene.image_url,
                "artKey": scene.art_key,
                "characters": (
                    scene.characters.split(", ")
                    if scene.characters
                    else []
                ),
            }
            for scene in story.scenes
        ],
    }