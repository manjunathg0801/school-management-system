from app.db.session import engine
from sqlalchemy import text

def migrate():
    with engine.connect() as connection:
        with connection.begin():
            print("Adding grade column...")
            try:
                connection.execute(text("ALTER TABLE notifications ADD COLUMN grade VARCHAR;"))
                print("Added grade column.")
            except Exception as e:
                print(f"Error adding grade column (might already exist): {e}")

            print("Adding section column...")
            try:
                connection.execute(text("ALTER TABLE notifications ADD COLUMN section VARCHAR;"))
                print("Added section column.")
            except Exception as e:
                print(f"Error adding section column (might already exist): {e}")

if __name__ == "__main__":
    migrate()
