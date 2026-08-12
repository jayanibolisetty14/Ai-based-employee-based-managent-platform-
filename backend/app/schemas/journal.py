from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class JournalCreate(BaseModel):
    employee_id: str
    title: str
    content: str
    emotion: str
    confidence: float
    wellness_category: str


class JournalResponse(BaseModel):
    id: str
    employee_id: str
    title: str
    content: str
    created_at: datetime

class JournalUpdate(BaseModel):
    title: str
    content: str