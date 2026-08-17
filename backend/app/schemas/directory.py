from pydantic import BaseModel
from typing import List, Optional

class Hospital(BaseModel):
    id: str
    name: str
    address: str
    latitude: float
    longitude: float
    contactNumber: str
    emergencyNumber: Optional[str] = None
    hasEmergencyRoom: bool
    distanceKm: Optional[float] = None
    isOpen24x7: bool
    imageUrl: Optional[str] = None

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
    phoneNumber: str
    gender: str
    dateOfBirth: str
    department: str
    licenseNumber: str
    consultationFee: float
    followUpFee: float
    followUpDays: int
    isOnline: bool
    rating: float
    reviewCount: int
    about: str
    experience: str
    degrees: List[str]
    medicalCollege: str
    bmdcNumber: str
    workingHospital: str # The hospital name
    workingHospitalId: str # The hospital ID this doctor is currently working at
    totalPatients: int
    avgConsultationMinutes: int
    services: List[str]
    languagesSpoken: List[str]
    experienceList: List[DoctorExperienceEntry]
    image: Optional[int] = None
