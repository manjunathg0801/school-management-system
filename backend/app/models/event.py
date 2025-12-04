from sqlalchemy import Column, Integer, String, Date
from app.db.base_class import Base

class Holiday(Base):
    __tablename__ = "holidays"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    date = Column(Date, nullable=False)
    type = Column(String) # 'holiday' or 'event'
    description = Column(String, nullable=True)
