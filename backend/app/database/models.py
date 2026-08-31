from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from .database import Base


class Story(Base):

    __tablename__ = "stories"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(255), nullable=False)

    category = Column(String(100))

    tone = Column(String(100))

    audience = Column(String(100))

    language = Column(String(100))

    audio_narration = Column(Boolean, default=False)

    protagonist = Column(String(255))

    narrative_arc = Column(Text)

    facts = relationship(
        "StoryFact",
        back_populates="story",
        cascade="all, delete-orphan"
    )

    scenes = relationship(
        "StoryScene",
        back_populates="story",
        cascade="all, delete-orphan"
    )


class StoryFact(Base):

    __tablename__ = "story_facts"

    id = Column(Integer, primary_key=True, index=True)

    story_id = Column(
        Integer,
        ForeignKey("stories.id")
    )

    fact_id = Column(String(100))

    text = Column(Text)

    story = relationship(
        "Story",
        back_populates="facts"
    )


class StoryScene(Base):

    __tablename__ = "story_scenes"

    id = Column(Integer, primary_key=True, index=True)

    story_id = Column(
        Integer,
        ForeignKey("stories.id")
    )

    scene_id = Column(String(100))

    scene_number = Column(Integer)

    caption = Column(Text)

    image_prompt = Column(Text)

    image_url = Column(Text, nullable=True)

    art_key = Column(String(100))

    characters = Column(Text)

    story = relationship(
        "Story",
        back_populates="scenes"
    )