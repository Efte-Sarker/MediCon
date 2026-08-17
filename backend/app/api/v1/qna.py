from fastapi import APIRouter, HTTPException
from typing import List
import time
from datetime import datetime, timezone
from app.schemas.qna import (
    Question, QuestionAnswer, 
    AskQuestionRequest, AnswerQuestionRequest,
    UpdateQuestionRequest, UpdateAnswerRequest
)
from app.services.ai.routingEngine import route_question

router = APIRouter()

# In-memory mock database for the Q&A feature
mock_questions = [
    {
        "id": "q-1",
        "patientId": "patient-1",
        "department": "Cardiology",
        "symptomId": "1",
        "content": "Is it normal to have a slightly elevated heart rate after starting the new blood pressure medication?",
        "createdAt": "2024-03-01T10:00:00.000Z",
        "answers": [
            {
                "id": "a-1",
                "doctorId": "Robert",
                "content": "Yes, a mild increase in heart rate can be a temporary side effect of this medication as your body adjusts.",
                "createdAt": "2024-03-02T10:00:00.000Z"
            }
        ]
    }
]

@router.get("/patient/{patient_id}", response_model=List[Question])
def get_patient_questions(patient_id: str):
    # Mimic frontend logic: return patient's questions plus 'patient-1' mock questions
    filtered = [q for q in mock_questions if q["patientId"] == patient_id or q["patientId"] == "patient-1"]
    filtered.sort(key=lambda x: x["createdAt"], reverse=True)
    return filtered

@router.get("/doctor/inbox/{department}", response_model=List[Question])
def get_doctor_inbox(department: str):
    filtered = [q for q in mock_questions if q["department"] == department]
    filtered.sort(key=lambda x: x["createdAt"], reverse=True)
    return filtered

@router.post("/ask", response_model=Question)
def ask_question(request: AskQuestionRequest):
    # AI Routing happens here!
    department = route_question(request.content)
    
    new_q = {
        "id": f"q-{int(time.time()*1000)}",
        "patientId": request.patientId,
        "department": department,
        "content": request.content,
        "isAnonymous": request.isAnonymous,
        "symptomId": request.symptomId,
        "createdAt": datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z'),
        "answers": []
    }
    
    mock_questions.append(new_q)
    return new_q

@router.post("/{question_id}/answer", response_model=Question)
def answer_question(question_id: str, request: AnswerQuestionRequest):
    for q in mock_questions:
        if q["id"] == question_id:
            new_a = {
                "id": f"a-{int(time.time()*1000)}",
                "doctorId": request.doctorId,
                "content": request.content,
                "createdAt": datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z')
            }
            q["answers"].append(new_a)
            return q
    raise HTTPException(status_code=404, detail="Question not found")

@router.put("/{question_id}", response_model=Question)
def update_question(question_id: str, request: UpdateQuestionRequest):
    for q in mock_questions:
        if q["id"] == question_id and (q["patientId"] == request.patientId or q["patientId"] == "patient-1"):
            # Re-route in case the content changed significantly
            new_department = route_question(request.content)
            q["content"] = request.content
            q["department"] = new_department
            q["isAnonymous"] = request.isAnonymous
            q["symptomId"] = request.symptomId
            return q
    raise HTTPException(status_code=404, detail="Question not found or unauthorized")

@router.put("/{question_id}/answer/{answer_id}", response_model=Question)
def update_answer(question_id: str, answer_id: str, request: UpdateAnswerRequest):
    for q in mock_questions:
        if q["id"] == question_id:
            for a in q["answers"]:
                if a["id"] == answer_id:
                    a["content"] = request.content
                    return q
    raise HTTPException(status_code=404, detail="Answer not found")

@router.delete("/{question_id}")
def delete_question(question_id: str):
    global mock_questions
    original_len = len(mock_questions)
    mock_questions = [q for q in mock_questions if q["id"] != question_id]
    if len(mock_questions) == original_len:
        raise HTTPException(status_code=404, detail="Question not found")
    return {"status": "deleted"}
