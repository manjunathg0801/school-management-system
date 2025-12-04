from app.db.session import engine
from sqlalchemy import text

def migrate():
    with engine.connect() as connection:
        with connection.begin():
            print("Adding attachment_url to notification_batches...")
            try:
                connection.execute(text("ALTER TABLE notification_batches ADD COLUMN attachment_url VARCHAR;"))
                print("Added attachment_url to notification_batches.")
            except Exception as e:
                print(f"Error adding column to batches (might already exist): {e}")

            print("Adding attachment_url to notifications...")
            try:
                connection.execute(text("ALTER TABLE notifications ADD COLUMN attachment_url VARCHAR;"))
                print("Added attachment_url to notifications.")
            except Exception as e:
                print(f"Error adding column to notifications (might already exist): {e}")

if __name__ == "__main__":
    migrate()
