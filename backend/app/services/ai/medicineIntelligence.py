from google import genai
import json
from app.core.config import settings
from app.schemas.medicine import MedicineExplainerResult, ComparisonResult, InteractionConflict, InteractionResult
from typing import List

client = genai.Client(api_key=settings.GEMINI_API_KEY)

def get_medicine_explainer(medicine_name: str) -> MedicineExplainerResult:
    prompt = f"""
    You are an expert medical AI. A patient has been prescribed the medicine: "{medicine_name}".
    Analyze this medicine and return a strictly valid JSON object matching the following structure:
    {{
        "className": "Therapeutic class (e.g., Antibiotic, NSAID, Beta-blocker)",
        "forms": ["Common form 1", "Common form 2"],
        "sideEffects": ["Common side effect 1", "Common side effect 2"],
        "dietaryConflicts": ["Dietary conflict 1", "Dietary conflict 2"],
        "summary": "A brief, patient-friendly plain-language explanation of what this medicine does and why it is prescribed. Include a medical disclaimer."
    }}
    Do not include any markdown formatting outside the JSON block.
    """
    try:
        response = client.models.generate_content(model='gemini-flash-latest', contents=prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:-3]
        elif text.startswith("```"):
            text = text[3:-3]
        data = json.loads(text)
        return MedicineExplainerResult(**data)
    except Exception as e:
        print(f"Error in explainer: {e}")
        return MedicineExplainerResult(
            className="Unknown", forms=[], sideEffects=[], dietaryConflicts=[],
            summary="An error occurred while analyzing this medication. Please consult your doctor."
        )

def compare_medicines(med_a: str, med_b: str) -> ComparisonResult:
    prompt = f"""
    You are an expert medical AI. Compare these two medicines: "{med_a}" and "{med_b}".
    Return a strictly valid JSON object matching the following structure:
    {{
        "similarities": ["Similarity 1", "Similarity 2"],
        "differences": ["Difference 1", "Difference 2"],
        "rationale": "A brief pharmacological rationale comparing them. Include a medical disclaimer."
    }}
    Do not include any markdown formatting outside the JSON block.
    """
    try:
        response = client.models.generate_content(model='gemini-flash-latest', contents=prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:-3]
        elif text.startswith("```"):
            text = text[3:-3]
        data = json.loads(text)
        return ComparisonResult(**data)
    except Exception as e:
        print(f"Error in comparator: {e}")
        return ComparisonResult(
            similarities=[], differences=[],
            rationale="An error occurred while comparing these medications. Please consult your doctor."
        )

def check_interactions(new_med: str, existing_meds: list) -> List[InteractionConflict]:
    if not existing_meds:
        return []

    meds_json = json.dumps([{"id": m.id, "name": m.name} for m in existing_meds])

    prompt = f"""
    You are an expert medical AI. A patient is prescribed a new medicine: "{new_med}".
    They are already taking the following medicines:
    {meds_json}
    
    Check for drug interactions between the new medicine and EACH of the existing medicines.
    Return a strictly valid JSON object containing an array of conflicts:
    {{
        "conflicts": [
            {{
                "existingMedicineId": "id string",
                "existingMedicineName": "name string",
                "severity": "SAFE" or "MINOR" or "SEVERE",
                "explanation": "A brief explanation of the interaction, or confirmation of safety."
            }}
        ]
    }}
    Do not include any markdown formatting outside the JSON block.
    """
    try:
        response = client.models.generate_content(model='gemini-flash-latest', contents=prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:-3]
        elif text.startswith("```"):
            text = text[3:-3]
        data = json.loads(text)
        conflicts = [InteractionConflict(**c) for c in data.get("conflicts", [])]
        return conflicts
    except Exception as e:
        print(f"Error in interaction checker: {e}")
        return [
            InteractionConflict(
                existingMedicineId=m.id,
                existingMedicineName=m.name,
                severity="SAFE",
                explanation="Error checking interaction. Please consult a doctor."
            ) for m in existing_meds
        ]
