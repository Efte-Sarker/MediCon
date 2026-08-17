from pydantic import BaseModel
from typing import List

# Requests
class ExplainRequest(BaseModel):
    medicineName: str

class CompareRequest(BaseModel):
    medA: str
    medB: str

class ExistingMedicine(BaseModel):
    id: str
    name: str

class InteractRequest(BaseModel):
    newMedicine: str
    existingMedicines: List[ExistingMedicine]

# Responses
class MedicineExplainerResult(BaseModel):
    className: str
    forms: List[str]
    sideEffects: List[str]
    dietaryConflicts: List[str]
    summary: str

class ComparisonResult(BaseModel):
    similarities: List[str]
    differences: List[str]
    rationale: str

class InteractionConflict(BaseModel):
    existingMedicineId: str
    existingMedicineName: str
    severity: str # 'SAFE' | 'MINOR' | 'SEVERE'
    explanation: str

class InteractionResult(BaseModel):
    conflicts: List[InteractionConflict]
