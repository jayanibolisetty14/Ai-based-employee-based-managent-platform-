from pydantic import BaseModel

class MoodCreate(BaseModel):
    employee_id: str
    emotion: str
    confidence: float
    wellness_category: str