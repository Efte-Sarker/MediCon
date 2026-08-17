from pydantic import BaseModel
from typing import List, Optional

class DoctorExperienceEntry(BaseModel):
    id: str
    hospitalName: str
    designation: str
    department: str
    status: str
    period: str

class Doctor(BaseModel):
    id: str
    userId: str
    fullName: str
    department: str
    licenseNumber: str
    consultationFee: float
    followUpFee: float
    followUpDays: int
    isOnline: bool
    rating: float
    reviewCount: int
    about: Optional[str] = None
    experience: str
    degrees: List[str]
    bmdcNumber: str
    workingHospital: str
    totalPatients: int
    avgConsultationMinutes: int
    services: List[str]
    experienceList: List[DoctorExperienceEntry]
    image: Optional[str] = None
