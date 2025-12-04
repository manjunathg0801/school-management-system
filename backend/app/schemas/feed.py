from typing import Optional, List, Union
from pydantic import BaseModel
from datetime import datetime

class FeedBase(BaseModel):
    title: str
    description: str
    images: Optional[List[str]] = None
    author: Optional[str] = None

class FeedCreate(FeedBase):
    pass

class Feed(FeedBase):
    id: Optional[int] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
