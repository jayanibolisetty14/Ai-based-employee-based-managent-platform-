# from fastapi import APIRouter, HTTPException
from fastapi import APIRouter, HTTPException, Depends
from app.schemas.user_schema import UserRegister
from app.database.connection import db
from app.utils.security import hash_password
from app.schemas.user_schema import UserLogin
from app.utils.security import verify_password
# from app.auth.jwt_handler import create_access_token
from app.auth.jwt_handler import create_access_token, verify_token
router = APIRouter()

users_collection = db["users"]

@router.post("/register")
def register(user: UserRegister):

    # Check if email already exists
    existing_user = users_collection.find_one({"email": user.email})

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Hash password
    hashed_password = hash_password(user.password)

    # Create user document
    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password
    }

    # Save to MongoDB
    users_collection.insert_one(new_user)

    return {
        "message": "User Registered Successfully"
    }

@router.post("/login")
def login(user: UserLogin):

    existing_user = users_collection.find_one(
        {"email": user.email}
    )

    if not existing_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    print("Entered Password:", user.password)
    print("Stored Hash:", existing_user["password"])
    print("Verify Result:", verify_password(user.password, existing_user["password"]))

    if not verify_password(
        user.password,
        existing_user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid Password"
        )

    token = create_access_token(
        {"sub": existing_user["email"]}
    )

    return {
        "message": "Login Successful",
        "access_token": token,
        "token_type": "bearer"
    }
@router.get("/profile")
def get_profile(current_user: str = Depends(verify_token)):
    return {
        "message": "Protected Route Accessed Successfully",
        "logged_in_user": current_user
    }