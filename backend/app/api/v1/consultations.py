from fastapi import APIRouter
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.ai.chatService import generate_chat_response

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
def post_consultation_chat(request: ChatRequest):
    """
    Takes a patient query and a consultation ID, and returns an AI-generated 
    response grounded strictly in the transcript of that consultation.
    """
    reply = generate_chat_response(request.query, request.consultationId)
    return ChatResponse(response=reply)
