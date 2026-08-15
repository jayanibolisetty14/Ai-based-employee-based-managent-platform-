from fastapi import APIRouter
from app.database.connection import profile_collection
router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)
@router.post("/")
async def create_profile(profile: dict):

    result = profile_collection.insert_one(profile)

    return {
        "message": "Profile created successfully",
        "profile_id": str(result.inserted_id)
    }
@router.get("/{employee_id}")
async def get_profile(employee_id: str):

    profile = profile_collection.find_one(
        {"employee_id": employee_id}
    )

    if not profile:
        return {
            "message": "Profile not found."
        }

    profile["_id"] = str(profile["_id"])

    return profile

@router.put("/{employee_id}")
async def update_profile(employee_id: str, profile: dict):

    result = profile_collection.update_one(
        {"employee_id": employee_id},
        {"$set": profile}
    )

    if result.matched_count == 0:
        return {
            "message": "Profile not found."
        }

    return {
        "message": "Profile updated successfully."
    }


@router.get("/")
async def list_profiles():
    profiles = []
    for p in profile_collection.find():
        p["_id"] = str(p["_id"])
        profiles.append(p)
    return profiles