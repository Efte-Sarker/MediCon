from fastapi import APIRouter, HTTPException, Body
from typing import List
from app.schemas.directory import Doctor

router = APIRouter()

import json
import os

SEED_FILE = os.path.join(os.path.dirname(__file__), '..', '..', 'db', 'seed_data.json')

def load_doctors():
    try:
        with open(SEED_FILE, 'r') as f:
            data = json.load(f)
            return data.get("doctors", [])
    except Exception as e:
        print(f"Error loading seed data: {e}")
        return []

MOCK_DOCTORS = load_doctors()

@router.get("/", response_model=List[Doctor])
def get_all_doctors(category_id: str = None):
    """
    Returns all doctors, optionally filtered by category name.
    Included for backward compatibility with the universal Doctors tab.
    """
    if category_id:
        return [d for d in MOCK_DOCTORS if d["department"] == category_id]
    return MOCK_DOCTORS

@router.get("/by-hospital/{hospital_id}", response_model=List[Doctor])
def get_doctors_by_hospital(hospital_id: str):
    """
    Returns only the doctors currently registered/working at the specified hospital.
    """
    results = [d for d in MOCK_DOCTORS if d["workingHospitalId"] == hospital_id]
    return results

@router.post("/register_workplace", response_model=Doctor)
def register_doctor_workplace(
    doctor_id: str = Body(...), 
    hospital_id: str = Body(...),
    hospital_name: str = Body(...)
):
    """
    Allows a doctor to update their current working hospital.
    """
    for d in MOCK_DOCTORS:
        if d["id"] == doctor_id:
            d["workingHospitalId"] = hospital_id
            d["workingHospital"] = hospital_name
            return d
    raise HTTPException(status_code=404, detail="Doctor not found")
