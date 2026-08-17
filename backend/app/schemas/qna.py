from pydantic import BaseModel
from typing import List, Optional

class QuestionAnswer(BaseModel):
    id: str
    doctorId: str
    content: str
    createdAt: str

class Question(BaseModel):
    id: str
    patientId: str
    department: str
    content: str
    createdAt: str
    answers: List[QuestionAnswer] = []
    isAnonymous: Optional[bool] = None
    symptomId: Optional[str] = None

class AskQuestionRequest(BaseModel):
    patientId: str
    content: str
    isAnonymous: Optional[bool] = None
    symptomId: Optional[str] = None

class UpdateQuestionRequest(BaseModel):
    patientId: str
    content: str
    isAnonymous: Optional[bool] = None
    symptomId: Optional[str] = None

class AnswerQuestionRequest(BaseModel):
    doctorId: str
    content: str

class UpdateAnswerRequest(BaseModel):
    doctorId: str
    content: str
