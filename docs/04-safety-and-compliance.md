### [Emergency Module Rules — LIFE-SAFETY CRITICAL]
The emergency module is the highest priority feature. These rules are absolute:

1. **Every emergency protocol screen must work 100% offline.** No emergency step may depend on a network call. Protocol data is bundled as static JSON in `src/services/protocols/`.
2. **Never show a loading state on an emergency protocol screen.** Data must be available immediately from the static bundle.
3. **Never make an AI call the blocker for emergency guidance.** AI enhancements are optional — the base protocol always works without them.
4. **Protocol content accuracy is critical.** Protocol steps must match the approved medical source exactly. Do not modify, paraphrase, or summarize protocol instructions.
5. **Pediatric protocols must be age-calibrated.** CPR compression depth, rescue breath technique, and medication thresholds differ by age group. Never use adult defaults for infants.

```tsx
// CORRECT — emergency data from static bundle
import { EMERGENCY_PROTOCOLS } from '@services/protocols/emergency-protocols.data';
const protocol = EMERGENCY_PROTOCOLS['cpr']['adult']; // always available, no async

// WRONG — network call on emergency screen
const { data: protocol } = useQuery({ queryFn: () => fetchProtocol('cpr') });
```

---

### [Medical Safety Rules]
MediCon is an information tool, not a diagnostic system.

- Never present AI outputs as medical diagnoses
- Always recommend seeing a real doctor for symptoms beyond self-care level
- Never suggest specific medication doses unless sourced from protocol data
- All AI-generated health content must include a disclaimer
- Triage results route users to appropriate care — they do not replace it

---

### [AI Safety Rules]
AI assists users but never replaces medical professionals.

- AI may explain medical information.
- AI may summarize reports.
- AI may translate medical terminology.
- AI may assist symptom understanding.
- AI must never claim certainty about diagnoses.
- AI must never present itself as a licensed healthcare professional.
- AI uncertainty should be communicated clearly.
- Potentially dangerous situations must recommend immediate professional or emergency care.

---

### [Privacy & Security Rules]
MediCon manages sensitive health information.

- Never log medical records, prescriptions, reports, or AI prompts in production.
- Store authentication tokens only in SecureStore.
- Encrypt sensitive local medical data whenever possible.
- Never expose API keys in the mobile application.
- Only authenticated users may access personal health information.
- Doctor access must be limited to authorized consultations.

---

### [Logging Rules]
Logging is for debugging only.

- Never log API keys.
- Never log authentication tokens.
- Never log personal medical information.
- Never log prescriptions or laboratory reports.
- Never log AI prompts or AI responses in production.

Production logs should contain only diagnostic information necessary for troubleshooting.

---

### [Error Classification Rules]
Application errors must be classified before reaching the UI.

Supported error categories include:

- Network Error
- Authentication Error
- Validation Error
- Permission Error
- AI Service Error
- Storage Error
- Unknown Error

User-facing messages must be clear, actionable, and free of technical jargon.

---

### [File Upload Rules]
Supported uploads include:
- Prescriptions
- Laboratory reports
- Medical documents
- Scan images

Rules:
- Validate file type before upload.
- Reject unsupported formats.
- Compress large images before upload where appropriate.
- Preserve the original document.
- OCR processing must never modify the original uploaded file.
- Upload failures must allow retry without losing local files.