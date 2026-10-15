from fastapi import FastAPI

from app.database import SessionLocal

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app = FastAPI(
  title= "ZoroFit API",
  description= "API for ZoroFit application",
  version= "1.0.0",
)

@app.get("/")
def home():
    return {
        "Message ": "Welcome to zorofit API",
        "Status ": "Running",
    }

@app.get("/health")
def health_check():
    return {
        "Status ": "Healthy",
    }
