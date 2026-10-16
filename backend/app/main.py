from fastapi import Depends, FastAPI
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db

app = FastAPI(
    title="ZoroFit API",
    description="API for ZoroFit application",
    version="1.0.0",
)


@app.get("/")
def home():
    return {
        "message": "Welcome to ZoroFit API",
        "status": "Running",
    }


@app.get("/health")
def health_check():
    return {"status": "Healthy"}


@app.get("/health/db")
def db_health(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"status": "database connected"}
