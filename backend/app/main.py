from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import symptoms, reports, consultations, medicines, qna, hospitals, doctors

app = FastAPI(title="MediCon API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(symptoms.router, prefix="/api/v1/symptoms", tags=["symptoms"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["reports"])
app.include_router(consultations.router, prefix="/api/v1/consultations", tags=["consultations"])
app.include_router(medicines.router, prefix="/api/v1/medicines", tags=["medicines"])
app.include_router(qna.router, prefix="/api/v1/qna", tags=["qna"])
app.include_router(hospitals.router, prefix="/api/v1/hospitals", tags=["hospitals"])
app.include_router(doctors.router, prefix="/api/v1/doctors", tags=["doctors"])

@app.get("/health")
def health_check():
    return {"status": "ok"}
