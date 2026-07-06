### [Project Overview]
MediCon is a live consultation, AI-powered health intelligence, and emergency response platform designed for the Bangladeshi healthcare context. It contains:

1. Onboarding & Authentication
- Dynamic Splash Screen: Displays Medicon name/logo.
- Emergency Feature Walkthrough: Introduces offline-capable visual guides for critical first-aid scenarios.
- Intelligence Onboarding: Previews the AI capabilities for natural language search by checking symptom, report/prescription translation, etc.
- Standard User Login: Supports only mobile number authentication via otp code. No email/password required. Allows users to tailor the application interface by selecting between Patient, or Doctor.
- Identity Registration: Captures core user identity metrics, including full name, blood group, height, weight, allergies, and existing chronic conditions, date of birth, etc.

2. Home Tabs
- Patient Dashboard: Serves as the central control screen displaying an emergency button, next appointment/consultation time, recent consulted doctor, and a reminder with the next medicine name and time. Includes a symptom search bar at the top for AI-powered doctor discovery.
- Doctors board: Symptom search bar at the top for AI-powered doctor discovery; category grid by department & symptom; consultation history; and a list of online doctors.
- Reports & Prescriptions: Store reports and prescriptions, auto reminder from prescriptions, AI explanation, etc.
- Nearby Hospitals: Show nearby hospitals via map, including showing information about the hospital's doctors.
- AI Chat: Post-consultation AI assistant scoped to individual doctor sessions. When opened, the tab displays a list of the user's previously consulted doctors. Tapping a doctor opens a chat interface tied exclusively to that doctor's consultation transcript. The AI answers questions based solely on that specific consultation (e.g. "What did the doctor recommend?" or "Can you summarize what was discussed?"). Each doctor's chat history is kept separate and isolated. Voice-to-text input is supported for questions.

3. Emergency Response
- Emergency Protocol Triage Grid: Offers instant, categorized access to eight critical first-aid guides such as CPR, choking, bleeding, burns, seizures, poisoning, and anaphylaxis.
- Emergency Alert: Instant tap and send alert to parents/relatives via sms/call.

4. Medicine Intelligence
- AI Pharmaceutical Explainer: Translates complex medicine information into plain-language summaries covering therapeutic class, medicine forms, side effects, and dietary conflicts.
- Side-by-Side Medicine Comparator: Evaluates two competing medications against each other across key metrics and delivers an AI-backed preference rationale.
- Multi-Medicine Interaction Checker: Cross-references a user’s active prescription list to flag, grade, and explain potential chemical conflicts.

5. Symptom Triage & Doctor Discovery
- AI-Powered Symptom Search: Replaces traditional keyword-based doctor search with a natural language symptom input. Users type or speak their symptoms into a search bar, and the AI analyzes them to recommend the most suitable doctors based on specialty, expertise, and relevance.
- Doctor Recommendation Engine: AI matches submitted symptoms against doctor profiles, departments, and areas of expertise, returning a ranked list of recommended doctors for consultation.
- Symptom Search Entry Points: The symptom search bar is accessible from both the Patient Home (Dashboard) and the Doctors Board, allowing users to find the right doctor from anywhere in the app.
- Result Actions: From the recommendation results, users can directly book a consultation, view the doctor's full profile, or ask a question via the Doctor Q&A Network.

6. Lab Report Interpreter
- Clinical Report Repository: Maintains an organized archive of all previously uploaded lab test documents categorized by date and test type.
- Optical Biomarker Parsing: Automatically scans raw laboratory test pages to extract measured values and map them against standard healthy reference ranges.
- Plain-Language Summarizer: Translates flagged, abnormal laboratory values into understandable health implications and physical symptom correlations.

7. Prescriptions
- Set an Auto Reminder: Set auto-reminder for uploaded or given prescriptions by the doctor.
- Daily Adherence Monitor: Displays a live breakdown of the user's daily medication schedule, tracking taken, pending, and missed doses in real time.
- AI Prescription Demystifier: Explains raw written prescriptions by highlighting the exact physiological purpose of the drug, taking rules, and side effects.
- Custom Reminder Configuration: Allows users to attach push notifications, SMS alerts, and specific snooze intervals directly to their medication regimens.

8. Doctor & Consultation
- Appointment Scheduler: Provides an interactive calendar grid to book either in-person physical hospital visits or secure video teleconsultations.
- Pre-Consultation Digest Builder: Automatically compiles the patient’s recent vitals, active medicines, and uploaded reports into a tidy summary for the doctor.

9. Doctor Q&A Network:
- Provides a structured question-and-answer platform where users can submit health-related queries to seek professional guidance.
- Questions are automatically routed to doctors within the relevant medical department based on identified health concern.
- Only qualified doctors from the corresponding specialty can respond.
- Users can view and manage only their own submitted questions and received answers through a private history panel.
- All questions, responses, and discussions remain strictly private and are not visible to other users, ensuring confidentiality and personalized medical guidance.

10. Records & Settings
- Prescription Store: Store all active and previously given prescriptions by the doctor.
- Report Store: Store all reports by uploading via users.
- Master Profile Administration: Controls core user account settings, dependent family profiles, UI display themes, and bilingual language toggling between English and Bengali.

---

### [Tech Stack]
Use exactly this stack. Do not introduce new major libraries without explicit user approval.

# Mobile (Android)
- React Native + Expo SDK (EAS Dev Client / Prebuild)
- TypeScript (strict mode)
- Expo Router 4
- Zustand
- TanStack Query
- MMKV (settings and small values)
- WatermelonDB (offline hospitals, prescriptions, reports)
- expo-secure-store
- expo-notifications
- react-native-maps (Google Maps SDK)
- Google ML Kit (OCR, barcode, document scanner)
- TFLite / LiteRT (Document Classification — Phase 2)
- Agora RTC (Video Consultations)

# Backend
- FastAPI
- Python 3.11+
- Pydantic
- SQLAlchemy (async)
- asyncpg
- Google Gen AI Python SDK (Gemini)
- SentenceTransformers
- OpenAI Whisper (transcription)
- Celery + APScheduler
- Redis (Phase 2)
- Docker
- Railway / Render / Fly.io

# Database
- PostgreSQL
- pgvector

# AI Services
- Google Gemini API
- OpenAI Whisper API

# Authentication
- Firebase Authentication (OTP)
- SSL Wireless (Bangladesh SMS fallback)

# Storage
- Cloudflare R2 (reports, prescriptions, scan images)

# Caching & Background Jobs
- Redis (Phase 2)

If a new library would significantly improve the implementation, recommend it clearly and ask for permission before installing it.

---

### [User Roles & Permissions]
MediCon supports three user roles. Access to features must be controlled by role.

# Patient
- View and manage personal health records
- Upload reports and prescriptions
- Use AI-powered health features
- Book consultations
- Ask questions in the Doctor Q&A Network
- Configure reminders and emergency contacts

# Doctor
- View assigned appointments
- Conduct video consultations
- Respond only to questions routed to their verified medical department
- Create and update prescriptions
- Access only patient information explicitly shared during consultations

Never rely on client-side role checks alone. All permissions must be validated by the backend.