from google import genai
from google.genai import types
import json
import uuid
from typing import List, Tuple
from app.core.config import settings
from app.schemas.report import ReportAnalysisResponse, Biomarker

client = genai.Client(api_key=settings.GEMINI_API_KEY)

PROMPT = """
You are a senior clinical laboratory expert and medical AI interpreter.
A patient has uploaded a medical lab report — possibly multiple pages of the same report.

Your tasks:
1. Identify the laboratory/hospital name and the report title.
2. Extract EVERY single biomarker/test result visible across all pages.
3. For each result, determine if the value is outside the reference range.
4. Write a comprehensive, patient-friendly plain-language summary (3-5 sentences) that:
   - Mentions every flagged/abnormal value by name
   - Gives brief context on what each flagged value might indicate
   - Ends with: "This is an AI-generated interpretation. Please consult your doctor for clinical advice."

RULES:
- Extract ALL test results — do not skip any.
- category must be one of: HAEMATOLOGY, BIOCHEMISTRY, IMMUNOLOGY, URINE ANALYSIS, HORMONES, LIVER FUNCTION, KIDNEY FUNCTION, LIPID PROFILE, DIABETES, THYROID, MICROBIOLOGY, CARDIAC MARKERS, VITAMINS, OTHER
- testGroup is the panel name (e.g. "CBC", "LIPID PROFILE", "LIVER FUNCTION TEST", "THYROID FUNCTION")
- subGroup is a sub-category within a panel (e.g. "Red Blood Cells", "White Blood Cells", "Platelets", "Differential Count") — use null if not applicable
- For minRange and maxRange: extract the numeric lower and upper bounds of the normal range. If only one bound exists (e.g. "< 200"), set only the relevant one. Set to null if range is non-numeric.
- For isFlagged: set true ONLY if the numeric value is outside minRange or maxRange. For qualitative results like "Nil", "Normal", "Negative" set false unless the report explicitly marks it as abnormal.
- value must always be a string.

Return STRICTLY a valid JSON object — no markdown, no extra text, no code fences:
{
  "labName": "Laboratory name string or null",
  "reportTitle": "Report title string or null",
  "aiSummary": "Patient-friendly summary text",
  "biomarkers": [
    {
      "name": "Test name exactly as on report",
      "value": "Result value as string",
      "unit": "Unit of measurement or empty string",
      "referenceRange": "Full reference range text as printed on report",
      "minRange": null or numeric minimum,
      "maxRange": null or numeric maximum,
      "isFlagged": true or false,
      "category": "Category string",
      "testGroup": "Panel/group name string",
      "subGroup": "Sub-group string or null"
    }
  ]
}
"""

def analyze_report(files: List[Tuple[bytes, str]]) -> ReportAnalysisResponse:
    """
    Analyze one or more report pages using Gemini vision.
    files: list of (bytes, mime_type) tuples — one per page/image.
    """
    try:
        # Build typed Part objects — the new google.genai SDK does NOT accept raw dicts
        parts = []
        for file_bytes, mime_type in files:
            parts.append(types.Part.from_bytes(data=file_bytes, mime_type=mime_type))
        parts.append(types.Part.from_text(text=PROMPT))

        response = client.models.generate_content(
            model='gemini-flash-latest',
            contents=types.Content(role='user', parts=parts)
        )

        result_text = response.text.strip()
        # Strip any accidental markdown fences
        if result_text.startswith("```json"):
            result_text = result_text[7:]
        elif result_text.startswith("```"):
            result_text = result_text[3:]
        if result_text.endswith("```"):
            result_text = result_text[:-3]
        result_text = result_text.strip()

        result = json.loads(result_text)

        biomarkers = []
        for b in result.get("biomarkers", []):
            raw_value = b.get("value", "")
            min_range = b.get("minRange")
            max_range = b.get("maxRange")

            # Validate and convert range values
            try:
                min_range = float(min_range) if min_range is not None else None
            except (ValueError, TypeError):
                min_range = None
            try:
                max_range = float(max_range) if max_range is not None else None
            except (ValueError, TypeError):
                max_range = None

            # Auto-validate flagging against numeric ranges
            is_flagged = bool(b.get("isFlagged", False))
            try:
                numeric_val = float(str(raw_value).replace(",", "").strip())
                if min_range is not None and numeric_val < min_range:
                    is_flagged = True
                if max_range is not None and numeric_val > max_range:
                    is_flagged = True
                # Un-flag if it was incorrectly flagged and value is in range
                if min_range is not None and max_range is not None:
                    if min_range <= numeric_val <= max_range:
                        is_flagged = False
            except (ValueError, TypeError):
                pass  # Non-numeric value — trust AI's isFlagged

            biomarker = Biomarker(
                id=f"b-{uuid.uuid4().hex[:8]}",
                name=b.get("name", ""),
                value=str(raw_value),
                unit=b.get("unit", ""),
                referenceRange=b.get("referenceRange", ""),
                minRange=min_range,
                maxRange=max_range,
                isFlagged=is_flagged,
                category=b.get("category"),
                testGroup=b.get("testGroup"),
                subGroup=b.get("subGroup") if b.get("subGroup") else None,
            )
            biomarkers.append(biomarker)

        return ReportAnalysisResponse(
            labName=result.get("labName"),
            reportTitle=result.get("reportTitle"),
            aiSummary=result.get("aiSummary", "Analysis complete. Please consult your doctor for clinical interpretation."),
            biomarkers=biomarkers
        )

    except json.JSONDecodeError as e:
        print(f"JSON parse error in OCR: {e}")
        return ReportAnalysisResponse(
            labName=None,
            reportTitle=None,
            aiSummary="The document was processed but the results could not be structured. Please try again with a clearer image.",
            biomarkers=[]
        )
    except Exception as e:
        print(f"Error in OCR Interpretation: {e}")
        return ReportAnalysisResponse(
            labName=None,
            reportTitle=None,
            aiSummary="An error occurred while analyzing the document. Please consult a doctor.",
            biomarkers=[]
        )
