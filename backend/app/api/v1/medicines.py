from fastapi import APIRouter
from app.schemas.medicine import (
    ExplainRequest, MedicineExplainerResult, 
    CompareRequest, ComparisonResult, 
    InteractRequest, InteractionResult
)
from app.services.ai.medicineIntelligence import (
    get_medicine_explainer, compare_medicines, check_interactions
)

router = APIRouter()

@router.post("/explain", response_model=MedicineExplainerResult)
def explain_medicine(request: ExplainRequest):
    return get_medicine_explainer(request.medicineName)

@router.post("/compare", response_model=ComparisonResult)
def compare_two_medicines(request: CompareRequest):
    return compare_medicines(request.medA, request.medB)

@router.post("/interactions", response_model=InteractionResult)
def check_drug_interactions(request: InteractRequest):
    conflicts = check_interactions(request.newMedicine, request.existingMedicines)
    return InteractionResult(conflicts=conflicts)
