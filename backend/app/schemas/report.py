from pydantic import BaseModel
from typing import List, Optional

class Biomarker(BaseModel):
    id: str
    name: str
    value: str
    unit: str
    referenceRange: str
    minRange: Optional[float] = None
    maxRange: Optional[float] = None
    isFlagged: bool
    category: Optional[str] = None
    testGroup: Optional[str] = None
    subGroup: Optional[str] = None

class ReportAnalysisResponse(BaseModel):
    labName: Optional[str] = None
    reportTitle: Optional[str] = None
    aiSummary: str
    biomarkers: List[Biomarker]
