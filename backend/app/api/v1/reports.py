from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import base64
from app.schemas.report import ReportAnalysisResponse
from app.services.ai.ocrInterpretation import analyze_report

router = APIRouter()

class FilePayload(BaseModel):
    data: str       # base64-encoded file content
    mimeType: str   # e.g. "image/jpeg", "application/pdf"
    name: str

class AnalyzeRequest(BaseModel):
    files: List[FilePayload]

@router.post("/analyze", response_model=ReportAnalysisResponse)
async def analyze_uploaded_report(request: AnalyzeRequest):
    """
    Accepts base64-encoded files as JSON (avoids React Native FormData issues).
    Passes all pages to Gemini in a single call for full-context analysis.
    """
    allowed_mime_prefixes = ("image/", "application/pdf")

    if not request.files:
        raise HTTPException(status_code=400, detail="No files provided.")

    file_data = []
    for f in request.files:
        mime = f.mimeType.lower()
        if not any(mime.startswith(p) for p in allowed_mime_prefixes):
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: {f.mimeType}. Only images and PDFs are accepted."
            )
        try:
            file_bytes = base64.b64decode(f.data)
        except Exception:
            raise HTTPException(status_code=400, detail=f"Invalid base64 data for file: {f.name}")
        file_data.append((file_bytes, mime))

    return analyze_report(file_data)
