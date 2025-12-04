from sqlalchemy import Column, Integer, String, DateTime, JSON
from sqlalchemy.sql import func
from app.db.base_class import Base

class Feed(Base):
    __tablename__ = "feeds"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    images = Column(JSON, nullable=True) # List of image URLs or asset names
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    author = Column(String, nullable=True)
