from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class JournalCreate(BaseModel):
    employee_id: str
    title: str
    content: str
    emotion: Optional[str] = None
    confidence: Optional[float] = None
    wellness_category: Optional[str] = None


class JournalResponse(BaseModel):
    id: str
    employee_id: str
    title: str
    content: str
    created_at: datetime

class JournalUpdate(BaseModel):
    title: str
    content: str