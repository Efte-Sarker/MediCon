from pydantic import BaseModel

class ChatRequest(BaseModel):
    query: str
    consultationId: str

class ChatResponse(BaseModel):
    response: str
