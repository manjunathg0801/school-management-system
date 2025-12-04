from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.feed import Feed
from app.schemas.feed import Feed as FeedSchema

router = APIRouter()

@router.get("/", response_model=List[FeedSchema])
def read_feeds(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve all feeds.
    """
    feeds = (
        db.query(Feed)
        .order_by(Feed.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return feeds
