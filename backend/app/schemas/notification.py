from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class NotificationBatchBase(BaseModel):
    title: str
    message: str
    target_grade: Optional[str] = None
    target_section: Optional[str] = None
    target_student_id: Optional[int] = None
    attachment_url: Optional[str] = None

class NotificationBatch(NotificationBatchBase):
    id: int
    created_at: datetime
    total_count: int = 0
    read_count: int = 0

    class Config:
        from_attributes = True

class NotificationBase(BaseModel):
    title: str
    message: str
    is_read: Optional[bool] = False
    attachment_url: Optional[str] = None

class NotificationCreate(NotificationBase):
    student_id: Optional[int] = None
    grade: Optional[str] = None
    section: Optional[str] = None

class NotificationUpdate(BaseModel):
    is_read: bool

class Notification(NotificationBase):
    id: int
    student_id: Optional[int]
    batch_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True
