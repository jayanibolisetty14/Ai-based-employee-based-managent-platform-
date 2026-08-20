from fastapi import FastAPI
from app.database.connection import db
from app.routes.auth_routes import router as auth_router
from app.routes import journal
from app.routes import mood
from app.routes import report
from app.routes import profile
from app.routes import spotify
from app.routes.groq import router as groq_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(journal.router)
app.include_router(mood.router)
app.include_router(report.router)
app.include_router(profile.router)
app.include_router(spotify.router)
app.include_router(groq_router)

@app.get("/")
def home():
    return {
        "message": "MoodMentor Backend Running Successfully 🚀"
    }

