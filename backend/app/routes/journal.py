from fastapi import APIRouter, HTTPException
from app.schemas.journal import JournalCreate, JournalUpdate
from app.database.connection import journal_collection, mood_collection
from datetime import datetime
from bson import ObjectId

router = APIRouter(
    prefix="/journal",
    tags=["Journal"]
)


@router.get("/")
async def get_journals():

    journals = []

    for journal in journal_collection.find():
        journal["_id"] = str(journal["_id"])
        journals.append(journal)

    return journals


@router.get("/{journal_id}")
async def get_journal_by_id(journal_id: str):

    journal = journal_collection.find_one({"_id": ObjectId(journal_id)})

    if not journal:
        raise HTTPException(status_code=404, detail="Journal not found")

    journal["_id"] = str(journal["_id"])

    return journal


@router.post("/")
async def create_journal(journal: JournalCreate):

    # Save Journal
    journal_data = {
        "employee_id": journal.employee_id,
        "title": journal.title,
        "content": journal.content,
        "emotion": journal.emotion,
        "confidence": journal.confidence,
        "wellness_category": journal.wellness_category,
        "created_at": datetime.utcnow()
    }

    result = journal_collection.insert_one(journal_data)

    # Save Mood
    mood_data = {
        "employee_id": journal.employee_id,
        "emotion": journal.emotion,
        "confidence": journal.confidence,
        "wellness_category": journal.wellness_category,
        "journal_id": str(result.inserted_id),
        "created_at": datetime.utcnow()
    }

    mood_collection.insert_one(mood_data)

    return {
        "message": "Journal saved successfully!",
        "journal_id": str(result.inserted_id)
    }


@router.put("/{journal_id}")
async def update_journal(journal_id: str, journal: JournalUpdate):

    result = journal_collection.update_one(
        {"_id": ObjectId(journal_id)},
        {
            "$set": {
                "title": journal.title,
                "content": journal.content
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Journal not found")

    return {
        "message": "Journal updated successfully!"
    }


@router.delete("/{journal_id}")
async def delete_journal(journal_id: str):

    result = journal_collection.delete_one(
        {"_id": ObjectId(journal_id)}
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Journal not found"
        )

    return {
        "message": "Journal deleted successfully!"
    }