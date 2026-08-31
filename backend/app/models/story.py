from pydantic import BaseModel
from typing import List, Optional


# ============================================================
# STORY REQUEST
# ============================================================

class StoryRequest(BaseModel):

    title: str = ""

    category: str = ""

    tone: str = ""

    source_text: str = ""

    language: str = "English"

    audience: Optional[str] = "General"


# ============================================================
# FACT
# ============================================================

class Fact(BaseModel):

    id: str

    text: str

    included: bool = True


# ============================================================
# SCENE
# ============================================================

class Scene(BaseModel):

    id: str

    caption: str

    imagePrompt: str

    characters: str

    artKey: str

    factId: Optional[str] = None


# ============================================================
# NARRATIVE
# ============================================================

class Narrative(BaseModel):

    protagonist: str

    arc: str


# ============================================================
# STORY RESPONSE
# ============================================================

class StoryResponse(BaseModel):

    title: str

    category: str

    tone: str

    language: str

    audience: str

    facts: List[Fact]

    narrative: Narrative

    scenes: List[Scene]

class PublishStoryRequest(BaseModel):

    title: str

    category: str

    tone: str

    audience: dict

    language: str

    audioNarration: bool = False

    facts: List[dict]

    narrative: dict

    scenes: List[dict]