from typing import Any
from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os
from app.core.config import settings

router = APIRouter()

@router.post("/upload", response_model=dict)
async def upload_file(file: UploadFile = File(...)) -> Any:
    """
    Upload a file and return its URL.
    """
    try:
        # Create uploads directory if it doesn't exist
        upload_dir = "static/uploads"
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate a unique filename (or keep original if simple)
        # For simplicity, using original filename but handling duplicates could be better
        # ideally use uuid or timestamp
        import time
        timestamp = int(time.time())
        filename = f"{timestamp}_{file.filename}"
        file_path = os.path.join(upload_dir, filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Construct URL
        # Assuming static files are served at /static
        # We need the base URL, but for now returning relative path or absolute URL if domain known
        # Let's return a relative path that frontend can prepend API_URL or similar to
        # Or better, return the full URL if we knew the host.
        # For now, returning /static/uploads/filename
        
        url = f"/static/uploads/{filename}"
        return {"url": url}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not upload file: {str(e)}")
