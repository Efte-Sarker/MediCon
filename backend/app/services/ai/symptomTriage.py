from google import genai
import json
from app.core.config import settings
from app.schemas.doctor import Doctor
from typing import List

client = genai.Client(api_key=settings.GEMINI_API_KEY)

# Load doctors from seed data
import os
SEED_FILE = os.path.join(os.path.dirname(__file__), '..', '..', 'db', 'seed_data.json')

def load_doctors():
    try:
        with open(SEED_FILE, 'r') as f:
            data = json.load(f)
            return [Doctor(**d) for d in data.get("doctors", [])]
    except Exception as e:
        print(f"Error loading doctors for triage: {e}")
        return []

SEED_DOCTORS = load_doctors()

def get_triage_recommendation(query: str) -> List[Doctor]:
    prompt = f"""
    You are an intelligent medical triage assistant for the MediCon app in Bangladesh.
    A patient has provided the following symptom description:
    "{query}"
    
    Based on these symptoms, determine the single most appropriate medical department from the following list:
    - General Medicine
    - Cardiology
    - Pediatrics
    - Neurology
    - Orthopedics
    - Dermatology
    - Gynecology
    - Psychiatry
    - Endocrinology
    - Gastroenterology
    - Ophthalmology
    
    If the symptoms are generic, mild, or do not clearly match a specialist, default to "General Medicine".
    Respond ONLY with a valid JSON object in this exact format:
    {{
        "department": "Department Name",
        "urgency": "Self-Care" | "See Doctor" | "Emergency",
        "explanation": "A short, plain-language explanation of why this department is recommended, including a medical disclaimer."
    }}
    Do not include markdown blocks or any other text.
    """

    try:
        response = client.models.generate_content(
            model='gemini-flash-latest',
            contents=prompt
        )
        result_text = response.text.strip()
        if result_text.startswith("```json"):
            result_text = result_text[7:-3]
        elif result_text.startswith("```"):
            result_text = result_text[3:-3]

        result = json.loads(result_text)
        recommended_dept = result.get("department", "General Medicine")

        recommended_doctors = [doc for doc in SEED_DOCTORS if doc.department == recommended_dept]

        if not recommended_doctors:
            recommended_doctors = [doc for doc in SEED_DOCTORS if doc.department == "General Medicine"]

        return recommended_doctors
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        return [doc for doc in SEED_DOCTORS if doc.department == "General Medicine"]
