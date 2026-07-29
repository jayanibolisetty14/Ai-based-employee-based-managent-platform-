from fastapi import APIRouter, HTTPException
from app.schemas.mood import MoodCreate
from app.database.connection import mood_collection
from datetime import datetime
from bson import ObjectId

router = APIRouter(
    prefix="/mood",
    tags=["Mood"]
)

@router.get("/")
async def get_moods():
    moods = []

    for mood in mood_collection.find():
        mood["_id"] = str(mood["_id"])
        moods.append(mood)

    return moods

@router.post("/")
async def create_mood(mood: MoodCreate):
    mood_data = mood.dict()
    mood_data["created_at"] = datetime.utcnow()

    result = mood_collection.insert_one(mood_data)

    return {
        "message": "Mood stored successfully!",
        "id": str(result.inserted_id)
    }
@router.get("/{mood_id}")
async def get_mood(mood_id: str):
    mood = mood_collection.find_one({"_id": ObjectId(mood_id)})

    if not mood:
        raise HTTPException(status_code=404, detail="Mood not found")

    mood["_id"] = str(mood["_id"])

    return mood