# uvicorn app.main:app    to run the server

from fastapi.middleware.cors import CORSMiddleware
from fastapi import Depends, FastAPI
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.database import get_db
from app.routers import auth, users
from app.routers import auth, measurements, users
from app.routers import journal
app = FastAPI(
    title="ZoroFit API",
    description="API for ZoroFit application",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(measurements.router)
app.include_router(journal.router)

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
