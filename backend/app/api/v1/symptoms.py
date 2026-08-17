from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from app.schemas.doctor import Doctor
from app.services.ai.symptomTriage import get_triage_recommendation

router = APIRouter()

class TriageRequest(BaseModel):
    query: str

@router.post("/triage", response_model=List[Doctor])
def triage_symptoms(request: TriageRequest):
    """
    Analyzes symptoms and returns a list of recommended doctors 
    based on the AI-determined appropriate department.
    """
    doctors = get_triage_recommendation(request.query)
    return doctors
