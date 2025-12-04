from app.db.session import engine
from app.db.base_class import Base
from app.models.user import User
from app.models.student import StudentProfile, ParentProfile, Address, EmergencyContact
from app.models.event import Holiday
from app.models.fee import Fee
from app.models.attendance import Attendance
from app.models.timetable import Timetable
from app.models.result import Result
from app.models.notification import Notification
from app.models.feed import Feed

def init_db():
    # Create tables
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    print("Creating tables...")
    init_db()
    print("Tables created!")
