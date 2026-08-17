from google import genai
from app.core.config import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)

DEPARTMENTS = [
    "General Medicine",
    "Cardiology",
    "Pediatrics",
    "Neurology",
    "Dermatology",
    "Psychiatry",
    "Orthopedics",
    "Ophthalmology",
    "Dentistry",
    "ENT",
    "Gynecology",
    "Urology"
]

def route_question(question_content: str) -> str:
    """
    Takes a patient's medical question and classifies it into the most appropriate department.
    """
    departments_str = ", ".join(DEPARTMENTS)
    prompt = f"""
    You are an expert medical triage AI. Read the patient's question below and route it to the MOST appropriate medical department.
    You MUST choose EXACTLY ONE department from this list, and output nothing else: {departments_str}
    
    If it doesn't clearly fit a specialty, choose 'General Medicine'.
    
    Patient Question:
    "{question_content}"
    
    Department:
    """

    try:
        response = client.models.generate_content(model='gemini-flash-latest', contents=prompt)
        text = response.text.strip().title()

        for dep in DEPARTMENTS:
            if dep.lower() in text.lower():
                return dep

        return "General Medicine"
    except Exception as e:
        print(f"Error in routing engine: {e}")
        return "General Medicine"
