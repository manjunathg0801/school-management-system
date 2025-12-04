from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base
from app.db.base_class import Base as BaseModel

class NotificationBatch(BaseModel):
    __tablename__ = "notification_batches"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    target_grade = Column(String, nullable=True)
    target_section = Column(String, nullable=True)
    target_student_id = Column(Integer, nullable=True)
    attachment_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    notifications = relationship("Notification", back_populates="batch")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id"), nullable=True) # Nullable for global announcements
    batch_id = Column(Integer, ForeignKey("notification_batches.id"), nullable=True)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    attachment_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_read = Column(Boolean, default=False)

    student = relationship("StudentProfile", backref="notifications")
    batch = relationship("NotificationBatch", back_populates="notifications")
