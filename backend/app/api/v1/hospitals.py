from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import math
from app.schemas.directory import Hospital, Doctor

router = APIRouter()

import json
import os

SEED_FILE = os.path.join(os.path.dirname(__file__), '..', '..', 'db', 'seed_data.json')

def load_hospitals():
    try:
        with open(SEED_FILE, 'r') as f:
            data = json.load(f)
            return data.get("hospitals", [])
    except Exception as e:
        print(f"Error loading seed data: {e}")
        return []

MOCK_HOSPITALS = load_hospitals()

def haversine(lat1, lon1, lat2, lon2):
    """Calculate the great circle distance between two points on the earth."""
    R = 6371  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2) * math.sin(dlat/2) + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2) * math.sin(dlon/2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

@router.get("/nearby", response_model=List[Hospital])
def get_nearby_hospitals(
    lat: Optional[float] = None, 
    lng: Optional[float] = None,
    radius: Optional[float] = 10.0 # Default 10km radius
):
    results = []
    for h in MOCK_HOSPITALS:
        hospital_dict = dict(h)
        if lat is not None and lng is not None:
            dist = haversine(lat, lng, h["latitude"], h["longitude"])
            if dist <= radius:
                hospital_dict["distanceKm"] = round(dist, 2)
                results.append(hospital_dict)
        else:
            # If no location provided, just return all
            results.append(hospital_dict)
            
    # Sort by distance if calculated
    if lat is not None and lng is not None:
        results.sort(key=lambda x: x.get("distanceKm", 9999))
        
    return results

@router.get("/search", response_model=List[Hospital])
def search_hospitals(query: str):
    q = query.lower()
    results = [h for h in MOCK_HOSPITALS if q in h["name"].lower() or q in h["address"].lower()]
    return results

@router.get("/{hospital_id}", response_model=Hospital)
def get_hospital(hospital_id: str):
    for h in MOCK_HOSPITALS:
        if h["id"] == hospital_id:
            return h
    raise HTTPException(status_code=404, detail="Hospital not found")
