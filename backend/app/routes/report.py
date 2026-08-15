from fastapi import APIRouter
from pymongo import DESCENDING
from app.database.connection import journal_collection, mood_collection
from datetime import datetime, timedelta

router = APIRouter(
    prefix="/report",
    tags=["Report"]
)


@router.get("/")
async def report_home():
    return {
        "message": "Report API is working successfully!"
    }


@router.get("/{employee_id}")
async def get_report(employee_id: str):

    # Total Journals
    total_journals = journal_collection.count_documents(
        {"employee_id": employee_id}
    )

    # Total Moods
    total_moods = mood_collection.count_documents(
        {"employee_id": employee_id}
    )

    # Latest Mood
    latest_mood = mood_collection.find_one(
        {"employee_id": employee_id},
        sort=[("created_at", DESCENDING)]
    )

    # Emotion Summary
    emotion_summary = list(
        mood_collection.aggregate([
            {
                "$match": {
                    "employee_id": employee_id
                }
            },
            {
                "$group": {
                    "_id": "$emotion",
                    "count": {
                        "$sum": 1
                    }
                }
            }
        ])
    )

    # Convert Aggregation Result
    emotion_counts = {}

    for emotion in emotion_summary:
        emotion_counts[emotion["_id"]] = emotion["count"]

    return {
        "employee_id": employee_id,
        "total_journals": total_journals,
        "total_moods": total_moods,
        "latest_emotion": latest_mood["emotion"] if latest_mood else None,
        "latest_wellness_category": latest_mood["wellness_category"] if latest_mood else None,
        "emotion_summary": emotion_counts
    }
@router.get("/weekly/{employee_id}")
async def get_weekly_report(employee_id: str):

    today = datetime.utcnow()
    week_start = today - timedelta(days=7)

    moods = list(
        mood_collection.find(
            {
                "employee_id": employee_id,
                "created_at": {
                    "$gte": week_start,
                    "$lte": today
                }
            }
        )
    )

    emotion_counts = {}

    for mood in moods:
        emotion = mood["emotion"]
        emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1

    return {
        "employee_id": employee_id,
        "week_start": week_start,
        "week_end": today,
        "total_entries": len(moods),
        "emotion_summary": emotion_counts
    }
@router.get("/monthly/{employee_id}")
async def get_monthly_report(employee_id: str):

    today = datetime.utcnow()

    month_start = datetime(today.year, today.month, 1)

    moods = list(
        mood_collection.find(
            {
                "employee_id": employee_id,
                "created_at": {
                    "$gte": month_start,
                    "$lte": today
                }
            }
        )
    )

    emotion_counts = {}

    for mood in moods:
        emotion = mood["emotion"]
        emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1

    return {
        "employee_id": employee_id,
        "month": today.strftime("%B"),
        "year": today.year,
        "total_entries": len(moods),
        "emotion_summary": emotion_counts
    }

@router.get("/today/{employee_id}")
async def get_today_mood(employee_id: str):

    today = datetime.utcnow().date()

    mood = mood_collection.find_one(
        {
            "employee_id": employee_id,
            "created_at": {
                "$gte": datetime.combine(today, datetime.min.time()),
                "$lt": datetime.combine(today, datetime.max.time())
            }
        },
        sort=[("created_at", DESCENDING)]
    )

    if not mood:
        return {
            "message": "No mood found for today."
        }

    mood["_id"] = str(mood["_id"])

    if "journal_id" in mood:
        mood["journal_id"] = str(mood["journal_id"])

    return mood