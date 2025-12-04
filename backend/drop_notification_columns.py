from app.db.session import engine
from sqlalchemy import text

def migrate():
    with engine.connect() as connection:
        with connection.begin():
            print("Dropping grade column...")
            try:
                connection.execute(text("ALTER TABLE notifications DROP COLUMN grade;"))
                print("Dropped grade column.")
            except Exception as e:
                print(f"Error dropping grade column (might not exist): {e}")

            print("Dropping section column...")
            try:
                connection.execute(text("ALTER TABLE notifications DROP COLUMN section;"))
                print("Dropped section column.")
            except Exception as e:
                print(f"Error dropping section column (might not exist): {e}")

if __name__ == "__main__":
    migrate()
