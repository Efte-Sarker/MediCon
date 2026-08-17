from google import genai
from google.genai import types
import json
import os
from app.core.config import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)

SEED_FILE = os.path.join(os.path.dirname(__file__), '..', '..', 'db', 'seed_data.json')

def load_transcripts():
    try:
        with open(SEED_FILE, 'r') as f:
            data = json.load(f)
            transcripts = data.get("transcripts", [])
            return {t["id"]: t["content"] for t in transcripts}
    except Exception as e:
        print(f"Error loading seed transcripts: {e}")
        return {}

MOCK_TRANSCRIPTS = load_transcripts()

def generate_chat_response(query: str, consultation_id: str) -> str:
    transcript = MOCK_TRANSCRIPTS.get(
        consultation_id,
        "You recently had a consultation regarding some mild symptoms. Your doctor prescribed a short course of medication and advised rest and plenty of fluids."
    )

    prompt = f"""
    You are an AI medical assistant for the MediCon app, helping a patient after their consultation.
    You MUST answer the patient's query using ONLY the information provided in the transcript below.
    If the answer is not in the transcript, politely inform the patient that you don't have that information and they should contact the doctor directly.
    Do not invent any medical advice or diagnoses. Keep your tone professional, empathetic, and concise.
    
    Consultation Transcript:
    {transcript}
    
    Patient Query:
    {query}
    
    Provide your response as plain text (no markdown formatting like ** or ##).
    """

    try:
        response = client.models.generate_content(
            model='gemini-flash-latest',
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        print(f"Error calling Gemini chat: {e}")
        return "I apologize, but I am currently unable to process your request. Please try again later."
