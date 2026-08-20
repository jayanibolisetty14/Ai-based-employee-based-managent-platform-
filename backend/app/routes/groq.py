from fastapi import APIRouter, HTTPException
from app.services.groq_service import get_song_recommendations

router = APIRouter(
    prefix="/groq",
    tags=["Groq AI"]
)


@router.get("/recommendations")
def recommendations(mood: str, limit: int = 10):
    try:
        result = get_song_recommendations(mood, limit)
        return {
            "mood": mood,
            "recommendations": result
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )