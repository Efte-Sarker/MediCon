### [Cross-Cutting Conventions]
**Phase 1 Mock Service Convention**
Phase 1 features call `src/services/` functions that already match the contract Phase 2 implements for real (same signature, same typed return shape). Mocks add artificial latency and occasional simulated errors so loading/error/empty states are genuinely exercised. This is why the Phase 2 swap (`2.16`) only changes service bodies, never hooks or screens.

**Offline Tiers**
| Tier | Behavior | Applies to |
|---|---|---|
| **0 — Always offline** | No network call exists, ever; static bundle only | Emergency protocols |
| **1 — Offline-capable, backend-enhanced** | Core action works fully offline; backend adds redundancy/audit only | (Reserved for future features) |
| **2 — Offline-tolerant** | Local cache (WatermelonDB/MMKV); queued sync on reconnect | Profile, prescriptions, reports metadata, hospitals |
| **3 — Online-only** | Must detect offline status and show a clear message | AI features, live consultations, maps, doctor search, Q&A |

---

### [PHASE 1 — Frontend Foundation & Feature Build (Mock Data)]
Tooling → tokens → scaffolding → primitives → navigation, before any feature. Auth comes next since most screens assume a logged-in user. Emergency is built immediately after, ahead of every other feature, reflecting its life-safety priority. The remainder follows the patient journey: home → discovery → records → AI tools → consultations → account.

# 1.1 — Repository, Tooling & Project Initialization
**Prerequisites:** None.
**Deliverables:** Expo SDK project (EAS Dev Client/Prebuild), TypeScript strict; ESLint/Prettier; path aliases in `tsconfig.json`/`babel.config.js` per architecture; Jest + RNTL installed ⚠ §3.4, one smoke test passing.
**Files:** `package.json`, `tsconfig.json`, `babel.config.js`, `.eslintrc`, `.prettierrc`, `app.config.ts`, `jest.config.js`
**DoD:** `tsc`/`eslint` pass on the empty scaffold; smoke test passes; app boots on simulator and one physical Android device.

# 1.2 — Design System Tokens (COMPLETED)
**Prerequisites:** `1.1`
**Deliverables:** `Colors`, `Spacing`, `Layout`, `BorderRadius`, `FontFamily`, `FontSize`, `TextStyles` exported from one `@theme` entry point, matching the finalized coding standards exactly.
**Files:** `src/theme/{colors,typography,spacing,radius,shadows,index}.ts`
**DoD:** Every finalized token exists with the finalized value; unit test asserts token shapes/types.

# 1.3 — Application Architecture Scaffolding (COMPLETED)
**Prerequisites:** `1.1`
**Deliverables:** Full folder structure from `02-architecture.md` (`app/` route groups + all `src/` subfolders); empty sibling `backend/` directory per §3.5.
**Files:** Folder structure + one `index.ts` barrel per `src/` subfolder.
**DoD:** Path aliases resolve correctly for an import from each new folder.

# 1.4 — Shared Types, Constants & Typed Routes (COMPLETED)
**Prerequisites:** `1.3`
**Deliverables:** `Routes` constant covering every screen (no raw string paths from here on); base domain types (`User`, `PatientProfile`, `DoctorProfile`, `Appointment`, `Prescription`, `Report`, `Medicine`, `Question`, `EmergencyContact`, `VitalReading`) — the contract both mocks and later real services implement.
**Files:** `src/constants/{routes,strings,medical.constants,config}.ts`, `src/types/{navigation,medical,api,common}.types.ts`
**DoD:** Zero raw string route literals anywhere in `app/`.

# 1.5 — Core UI Primitive Components (COMPLETED)
**Prerequisites:** `1.2`, `1.4`
**Deliverables:** `Button`, `Input`, `Card`, `LoadingSpinner`, `ErrorState`, `EmptyState`, `Badge`, `Avatar`, `Modal/Sheet` — four-section file structure, named exports, typed props, full accessibility props.
**Files:** `src/components/ui/*`
**DoD:** Every primitive used by ≥1 later milestone; component tests for `Button` (press/disabled) and `Input` (value/change/validation).

# 1.6 — Navigation Shell & Route Scaffolding (COMPLETED)
**Prerequisites:** `1.3`, `1.4`, `1.5`
**Deliverables:** `(auth)` and `(app)/(tabs)` layouts; bottom tab bar (Home, Doctors, Reports, Hospitals, AI Chat); placeholder screen per route; role-aware tab/route-guard scaffold (Patient/Doctor only — Admin is an internal-only permission tier with no mobile app presence and is never part of mobile nav-gating), gating logic stubbed until `1.9` provides real auth state.
**Files:** `app/(auth)/_layout.tsx`, `app/(app)/_layout.tsx`, `app/(app)/(tabs)/_layout.tsx`, placeholder per route, `src/components/navigation/*`
**DoD:** Every tab/placeholder reachable with no dead ends; tab content respects `Layout.tabBarHeight` padding.

# 1.7 — Mock Service Layer, Query Client & State Pattern (COMPLETED)
**Prerequisites:** `1.4`
**Deliverables:** `QueryClientProvider` with state-table-appropriate `staleTime` defaults; example Zustand store demonstrating SecureStore/MMKV/non-persisted patterns; mock-service convention (`src/services/api/mockClient.ts`, artificial latency + simulated-error branch); i18n library installed and wired, English populated ⚠ §3.4.
**Files:** `src/services/api/*`, `src/store/*` (template), i18n config
**DoD:** One example flow (mock fetch → query → store → render, all three states demonstrably triggerable) documented; unit tests for the error-simulation branch and Zustand selector scoping.

# 1.8 — Onboarding Experience (COMPLETED)
**Prerequisites:** `1.5`, `1.6`
**Deliverables:** Dynamic splash; emergency-walkthrough carousel; AI-capability preview carousel; skip/continue with persisted has-seen flag (MMKV).
**Files:** `app/(auth)/onboarding/*`, `src/components/cards/OnboardingCard.tsx`, `src/store/onboardingStore.ts`
**DoD:** Shown exactly once per fresh install, resettable via a debug menu for QA; carousel has a non-gesture navigation alternative.

# 1.9 — Authentication & Identity Registration UI (COMPLETED)
**Prerequisites:** `1.7`, `1.8`
**Deliverables:** Phone/OTP entry (mock OTP, fixed dev code); Patient/Doctor role selector with a "pending verification" badge state for Doctor (forward-compatible with `2.2`'s real gate); identity registration form (name, blood group, height, weight, allergies, chronic conditions, DOB) with client-side validation; auth state in Zustand + SecureStore.
**Files:** `app/(auth)/{login,register}/*`, `src/services/api/authService.ts` (mock), `src/store/authStore.ts`, `src/components/forms/*`
**DoD:** A logged-out user cannot reach any `(app)` route; a mock session persists across restarts.

# 1.10 — Emergency Response Module (Real Implementation)
**Prerequisites:** `1.5`, `1.6`
**Deliverables:**
- Static protocol dataset, bundled JSON, all finalized protocols (CPR, Choking, Severe Bleeding, Burns, Anaphylaxis, Heat Stroke, Heat Exhaustion, Unconscious), transcribed exactly from AHA/Red Cross guidelines.
- Age-band variants (adult/child/infant) wherever the source differentiates by age; surfaced through `pediatric/` as a pediatric-first entry into the same shared dataset
- Triage Grid (no loading state, ever) and step-by-step protocol screens reading only from the bundle
- Exact accessibility labels as specified (step labels, etc.)

**Files:** `src/services/protocols/emergency-protocols.data.ts`, `app/(app)/emergency/*`, `app/(app)/pediatric/*`, `src/components/medical/EmergencyStepCard.tsx`
**DoD:** Airplane-mode pass on all 8 protocols with zero network calls fired; protocol text independently diffed against the approved source by a human reviewer; pediatric variants verified not to fall back to adult defaults; **second independent review pass required**, per the workflow doc's emergency-feature standard.

# 1.11 — Patient Dashboard (Home) ✅ DONE
**Prerequisites:** `1.5`, `1.6`, `1.7`, `1.9`, `1.10`
**Deliverables:** Dashboard composing cards for next appointment, recent doctor, next medicine; SOS button linking into `1.10`.
**Files:** `app/(app)/(tabs)/index.tsx` (Patient), `src/components/cards/{AppointmentCard,DoctorCard,MedicationCard}.tsx`, `src/hooks/usePatientDashboard.ts`
**DoD:** Empty state (not an error) for a brand-new patient with no appointments/medicines.

# 1.12 — Doctor Home & Appointment Queue ✅ DONE
**Prerequisites:** `1.11`
**Deliverables:** Role-aware home rendering, enforcing `1.6`'s stub for real using `1.9`'s auth role; today's appointment queue (mock) and a quick link into the Q&A inbox (built in `1.21`).
**Files:** `app/(app)/(tabs)/index.tsx` (Doctor), `src/components/cards/AppointmentQueueCard.tsx`, `src/hooks/useDoctorDashboard.ts`
**DoD:** A Patient session can never render this screen and vice versa.

# 1.13 — Doctors Board & Directory ✅ DONE
**Prerequisites:** `1.7`, `1.11`
**Deliverables:** Category grid by department/symptom; doctor list with mock online status; consultation history; doctor detail screen.
**Files:** `app/(app)/doctors/*`, `src/components/cards/DoctorCard.tsx`, `src/services/api/doctorsService.ts` (mock)
**DoD:** List uses `FlashList`; empty-history case handled for a new user.

# 1.14 — Nearby Hospitals (Map)
**Prerequisites:** `1.7`, `1.11`
**Deliverables:** `react-native-maps` view with mock hospital pins; hospital detail listing affiliated doctors; offline message (Tier 3) when maps/location unavailable.
**Files:** `app/(app)/(tabs)/hospitals.tsx`, `app/(app)/doctors/hospital/[id].tsx`, `src/components/cards/HospitalCard.tsx`, `src/services/api/hospitalsService.ts` (mock)
**DoD:** Graceful degradation (no crash/blank map) with location denied and with network disabled.

# 1.15 — Lab Report Interpreter UI
**Prerequisites:** `1.7`, `1.11`
**Deliverables:** Clinical Report Repository (by date/test type); upload/scan entry screen (camera/picker wired, OCR result mocked); flagged-value display with mock plain-language summaries (AI Safety Convention applies).
**Files:** `app/(app)/report/*`, `src/components/medical/{ReportCard,BiomarkerRow,AIDisclaimer}.tsx`, `src/services/api/reportsService.ts` (mock)
**DoD:** Empty state for zero reports; rejection messaging for unsupported file types; non-destructive re-upload flow.

# 1.16 — Prescriptions & Adherence Module UI
**Prerequisites:** `1.7`, `1.11`, `1.15`
**Deliverables:** Prescription store list/detail; mock AI Demystifier display; Daily Adherence Monitor (taken/pending/missed, mock); Custom Reminder Configuration wired to **real** `expo-notifications` local scheduling; Auto-Reminder seeds a user-editable default.
**Files:** `app/(app)/prescriptions/*`, `src/components/medical/{PrescriptionCard,AdherenceTracker}.tsx`, `src/services/notifications/reminderService.ts` (real), `src/services/api/prescriptionsService.ts` (mock data)
**DoD:** A scheduled local reminder genuinely fires a device notification; unit test for adherence-status thresholds.
**Notes:** SMS reminders and cross-device adherence sync require the backend — completed in `2.7`.

# 1.17 — Medicine Intelligence UI
**Prerequisites:** `1.7`, `1.16`
**Deliverables:** Explainer (class, forms, side effects, dietary conflicts); side-by-side Comparator with AI rationale; Interaction Checker cross-referencing `1.16`'s prescription list — all mock, AI Safety Convention applies.
**Files:** `app/(app)/medicine/*`, `src/components/medical/{MedicineCompareCard,InteractionFlag}.tsx`, `src/services/ai/medicineAiService.ts` (mock)
**DoD:** Copy reviewed against AI Safety Rules; component test for conflict-grading display.

# 1.18 — Symptom Triage UI
**Prerequisites:** `1.7`, `1.11`
**Deliverables:** Typed/spoken (voice-capture UI, no real transcription) symptom input with duration/pain-level; mock result screen with mandatory route-to-care CTA.
**Files:** `app/(app)/symptom/*`, `src/components/forms/SymptomInputForm.tsx`, `src/services/ai/symptomTriageService.ts` (mock)
**DoD:** Result copy passes the Medical Safety Rules checklist; voice input gracefully no-ops without a real backend.

# 1.19 — AI Chat (Consultation) UI
**Prerequisites:** `1.7`, `1.18`
**Deliverables:** Chat UI (message list, input, mock streaming response); voice-recording capture (no real transcription); mock conversation persistence.
**Files:** `app/(app)/(tabs)/ai-chat.tsx`, `src/components/medical/ChatBubble.tsx`, `src/services/ai/chatService.ts` (mock), `src/store/chatStore.ts`
**DoD:** Offline message (Tier 3) shown instead of a hung loading state; scroll/performance test with a long mock conversation.

# 1.20 — Appointment Scheduler & Pre-Consultation Digest UI
**Prerequisites:** `1.7`, `1.13`, `1.16`
**Deliverables:** Calendar/slot picker (in-person or video); mock booking confirmation; Digest preview compiling mock vitals/medicines/reports; explicitly placeholder-only video-call screen (real Agora wiring deferred to `2.11`).
**Files:** `app/(app)/doctors/booking/*`, `src/components/cards/DigestCard.tsx`, `src/services/api/appointmentsService.ts` (mock)
**DoD:** Video placeholder unambiguously flagged in code as a placeholder; booking flow walked through for both consultation types.

# 1.21 — Doctor Q&A Network UI
**Prerequisites:** `1.7`, `1.12`, `1.13`
**Deliverables:** Patient: ask-question form + private "my questions" history (mock). Doctor: inbox mock-routed to their department, answer composer. UI visually enforces department-scoped, private-by-default access.
**Files:** `app/(app)/doctors/qna/*`, `src/components/medical/{QuestionCard,AnswerComposer}.tsx`, `src/services/api/qnaService.ts` (mock)
**DoD:** A Patient session cannot navigate into the Doctor inbox route.

# 1.22 — Records & Settings
**Prerequisites:** `1.7`, `1.9`
**Deliverables:** Master profile admin; dependent-profile management; theme toggle (light/dark, dark conditional per `3.6`); language toggle wired to the **real** i18n library from `1.7`, EN + BN populated for every string used so far.
**Files:** `app/(app)/settings/*`, `src/store/settingsStore.ts`, locale resource files
**DoD:** Switching language updates every prior screen's text live, no restart, no missing-translation fallbacks.

# 1.23 — Notifications Screen
**Prerequisites:** `1.6`, `1.7`
**Deliverables:** `notifications.tsx` listing mock system notifications (reminders fired, confirmations, Q&A answers) with read/unread state.
**Files:** `app/(app)/notifications.tsx`, `src/services/notifications/notificationsListService.ts` (mock)
**DoD:** Empty state for zero notifications; component test for read/unread toggling.

# 1.24 — Phase 1 Integration Pass, Mock-Data QA & Accessibility Sweep
**Prerequisites:** `1.1`–`1.23`
**Deliverables:** Full click-through script, both roles; forced-error/empty toggles on every mock service; full screen-reader and bilingual sweep across every screen; confirmation `1.10` remains network-call-free inside the full integrated app.
**DoD:** Universal DoD across the entire app simultaneously; zero P0/P1 defects open. **Phase 1 exit gate — Phase 2 should not begin before sign-off.**

---

### [PHASE 2 — Backend, Data & AI Integration]
Data model and backend scaffolding first; then identity/auth, since everything else is user-scoped; then storage, since reports/prescriptions depend on it; then each AI/data service in dependency order; the systematic mock-swap and security hardening close out the phase once every service is verified in isolation.

# 2.1 — Backend Foundation & Core Data Model
**Prerequisites:** `1.3`, `1.4`
**Deliverables:** FastAPI skeleton per §3.5; PostgreSQL + pgvector in Docker; async SQLAlchemy models + Alembic migrations for `User`, `PatientProfile`, `DoctorProfile`, `Dependent`, `EmergencyContact`; Pydantic schemas mirroring `1.4`'s frontend types; Pytest installed ⚠ §3.4, one passing health-check test.
**Files:** `backend/app/main.py`, `core/config.py`, `db/*`, `models/*`, `schemas/*`, `alembic/*`, `tests/test_health.py`
**DoD:** `GET /health` returns 200 from a running container; one migration applies cleanly from empty DB.

# 2.2 — Identity, Auth & Doctor Credentialing Service
**Prerequisites:** `2.1`
**Deliverables:** Firebase Admin SDK primary OTP path + SSL Wireless fallback, converging into one backend-issued app session token; role-based access middleware (Patient/Doctor only at the mobile-app layer); Doctor accounts are created in a `pending` state — all doctor-only endpoints reject them server-side until approved. Approval is performed exclusively through a separately authenticated internal API endpoint (`POST /internal/credentials/approve`) requiring its own credential set distinct from the Patient/Doctor OTP flow; there is no Admin login, mobile screen, or in-app role for this action. This implements the "Doctor Credentialing (Admin)" feature defined in the product spec.
**Files:** `backend/app/api/v1/auth.py`, `backend/app/api/internal/credentials.py`, `core/security.py`, `services/auth/*`, `models/doctor_credential.py`
**DoD:** A `pending` Doctor session cannot reach doctor-only endpoints; the internal approval endpoint is unreachable without its own separate credential; both OTP delivery paths converge on an identical token shape; approving a `pending` Doctor account requires no app update or re-login on the Doctor's side.
**Notes:** The internal credentialing endpoint is a raw API with no UI — operated manually (e.g., via curl or an internal tool). A purpose-built Admin UI is out of scope unless explicitly added to the product spec.

# 2.3 — User & Profile Service
**Prerequisites:** `2.2`
**Deliverables:** Profile CRUD; dependent-profile endpoints; server-side validation superseding (not trusting) `1.9`'s client-side checks.
**Files:** `backend/app/api/v1/users.py`, `services/users/*`
**DoD:** Invalid-input rejection covered for every registration field.

# 2.4 — File Storage & Upload Service (Cloudflare R2)
**Prerequisites:** `2.2`
**Deliverables:** Signed-upload-URL endpoint; server-side file-type validation; large-image compression; original-file preservation; retry-safe uploads (local copy never lost on failure).
**Files:** `backend/app/api/v1/storage.py`, `services/storage/r2Client.py`
**DoD:** Unsupported types rejected before reaching R2; a deliberately interrupted upload is retryable without data loss.

# 2.5 — Hospitals & Doctors Directory Service
**Prerequisites:** `2.3`
**Deliverables:** Hospital storage + geospatial query endpoint (for `1.14`'s map); doctor directory with department/symptom filtering and live online-status.
**Files:** `backend/app/api/v1/{hospitals,doctors}.py`, `models/hospital.py`
**DoD:** Geospatial query returns correctly distance-ordered results for a known test coordinate set.

# 2.6 — Reports Service & OCR/Interpretation Pipeline
**Prerequisites:** `2.4`
**Deliverables:** Report metadata CRUD; Gemini-based structured biomarker extraction and reference-range comparison from images uploaded via `2.4` (Google ML Kit handles on-device capture/cropping client-side, ahead of upload); plain-language summary generation (AI Safety Convention, server-enforced disclaimer text).
**Files:** `backend/app/api/v1/reports.py`, `services/ai/ocrInterpretation.py`
**DoD:** Fixture images covering one normal and one flagged-value case pass; generated summaries never assert diagnostic certainty.

# 2.7 — Prescriptions, Adherence & Reminder Service
**Prerequisites:** `2.4`, `2.6`
**Deliverables:** Prescription CRUD; Gemini-backed Demystifier endpoint; adherence-log endpoint as an **append-only event store** (never overwritten); Celery/APScheduler reminder dispatch; SSL Wireless SMS reminders complementing `1.16`'s local notifications.
**Files:** `backend/app/api/v1/prescriptions.py`, `workers/reminderJobs.py`, `services/sms/sslWirelessClient.py`
**DoD:** Concurrent adherence events from different devices both persist — no last-write-wins loss.

# 2.8 — Medicine Intelligence AI Services
**Prerequisites:** `2.3`
**Deliverables:** Gemini-backed Explainer/Comparator/Interaction Checker endpoints over a structured medicine reference dataset; Interaction Checker cross-references the real prescription list from `2.7`.
**Files:** `backend/app/api/v1/medicines.py`, `services/ai/medicineIntelligence.py`
**DoD:** Fixture medicine pairs covering ≥1 known interaction pass; AI Safety Convention copy-reviewed on real model output.

# 2.9 — Symptom Triage AI Service
**Prerequisites:** `2.3`
**Deliverables:** Gemini-backed triage endpoint with server-enforced (not just prompted) route-to-care logic; optional pgvector/SentenceTransformers similarity search for triage consistency.
**Files:** `backend/app/api/v1/symptoms.py`, `services/ai/symptomTriage.py`
**DoD:** Fixture inputs covering one "self-care appropriate" and one "see a doctor immediately" case route correctly.

# 2.10 — Appointment & Consultation Scheduling Service
**Prerequisites:** `2.3`, `2.5`, `2.7`
**Deliverables:** Booking endpoint (in-person/video); Pre-Consultation Digest job compiling real vitals/medicines/reports, scoped strictly to that one consultation.
**Files:** `backend/app/api/v1/appointments.py`, `services/digest/digestBuilder.py`
**DoD:** Digest access does not persist as broader doctor access once the consultation ends.

# 2.11 — Video Consultation & AI Chat/Transcription Integration 🔒
**Prerequisites:** `2.10`
**Deliverables:** Agora RTC token service tied to a booked appointment, replacing `1.20`'s placeholder; Gemini-backed conversational chat backend; Whisper transcription gated on explicit, recorded consent from both parties, with a defined retention period and access scoped to participants only.
**Files:** `backend/app/api/v1/consultations.py`, `services/video/agoraTokenService.py`, `services/ai/{chatService,transcriptionService}.py`, `models/consent.py`
**DoD:** Transcription request without a recorded consent event is rejected; end-to-end video call tested on two devices.

# 2.12 — Doctor Q&A Backend & Routing Engine
**Prerequisites:** `2.2`, `2.3`
**Deliverables:** Question submission endpoint; department-routing classifier mapping identified concern → department; doctor-inbox endpoint scoped server-side to the doctor's verified department; private-history endpoint enforcing per-user visibility at the query level.
**Files:** `backend/app/api/v1/qna.py`, `services/qna/routingEngine.py`
**DoD:** Adversarial cross-department/cross-user access attempts are rejected.

# 2.13 — Notifications & SMS Dispatch Backend
**Prerequisites:** `2.2`
**Deliverables:** Push-token registration; centralized SSL Wireless SMS dispatch shared by `2.7` and `2.14`; notification persistence backing `1.23`.
**Files:** `backend/app/api/v1/notifications.py`, `services/sms/sslWirelessClient.py` (shared), `models/notification.py`
**DoD:** A single SMS dispatch failure retries/logs without blocking other notification types.

# 2.14 — (Removed) Emergency Alert Backend

# 2.15 — Offline Sync Engine
**Prerequisites:** `2.3`, `2.5`, `2.7`
**Deliverables:** Sync endpoints for queued local mutations; "server wins" conflict resolution **except** append-only event types (adherence logs), which merge instead of overwrite; sync-status UI indicator; local medical data never deleted before server confirmation.
**Files:** `backend/app/api/v1/sync.py`, `src/database/adapters/syncAdapter.ts`, `src/services/storage/syncService.ts`
**DoD:** Simulated offline→online reconnect with conflicting edits resolves per rule, tested for both a regular record and an append-only type.

# 2.16 — Mock-to-Real Service Integration Sweep
**Prerequisites:** `2.1`–`2.15`
**Deliverables:** Every mock under `src/services/` repointed to its real backend counterpart with no hook/screen signature change (by construction, §3.1).
**Files:** All `src/services/{api,ai}/*.ts`
**DoD:** `1.24`'s click-through script re-run against the real backend with identical pass criteria; any mock/real response-shape drift is a defect of this milestone.

# 2.17 — Backend Security & RBAC Hardening Pass
**Prerequisites:** `2.1`–`2.16`
**Deliverables:** RBAC audit (no endpoint trusts a client-supplied role claim); rate limiting on auth/AI endpoints; Pydantic schema audit; secrets-management review (no key ever reachable from the mobile client).
**Files:** Primarily `backend/app/core/{security.py,deps.py}`, targeted fixes across `api/v1/*`
**DoD:** Adversarial test suite (role-spoofing, malformed payloads, key-leak attempts) passes with zero findings.

# 2.18 — Phase 2 Integration, AI-Safety & Privacy QA
**Prerequisites:** `2.1`–`2.17`
**Deliverables:** End-to-end patient↔doctor data-flow tests; AI Safety Convention audit on real (not fixture) output across every AI endpoint; logging audit confirming zero medical records, prescriptions, reports, or AI prompts/responses in any production-config log.
**DoD:** Zero P0/P1 defects; zero prohibited-logging findings. **Phase 2 exit gate.**

---

### [PHASE 3 — Production Readiness]
No new product features. Security and compliance first (highest consequence if skipped), then content-accuracy/accessibility/performance audits, then observability, then full regression, a controlled beta, release engineering, and a final sign-off gate.

# 3.1 — Security & Encryption-at-Rest Hardening
**Prerequisites:** `2.17`
**Deliverables:** SecureStore-sourced encryption key for MMKV; confirm whether WatermelonDB needs an additional encryption driver ⚠ §3.4 (adopt only if confirmed necessary); documented mandatory-vs-best-effort field list.
**Files:** `src/services/storage/encryptionConfig.ts`, `src/database/adapters/*`
**DoD:** A file-system inspection on a test device cannot read plaintext PHI from local storage.

# 3.2 — Regulatory & Legal Compliance Review
**Prerequisites:** `2.18`
**Deliverables:** Review of Bangladesh health-data handling, telemedicine regulation, e-prescription validity, and SMS-consent rules for non-OTP messages; Terms/Privacy Policy finalized; data-retention policy reconciled with `2.11`'s transcription window.
**DoD:** Legal/regulatory sign-off recorded; any resulting code change tracked against its originating milestone.

# 3.3 — Localization Completion & Medical-Accuracy Review
**Prerequisites:** `1.22`, `2.18`
**Deliverables:** 100% EN/BN string coverage across every screen; **mandatory human clinical review** of the Bengali emergency-protocol text and all AI safety copy — this gate cannot be approximated by an LLM alone, given `1.10`'s life-safety priority.
**DoD:** Zero missing-translation fallbacks; clinical sign-off recorded specifically for emergency/safety copy.

# 3.4 — Accessibility Audit
**Prerequisites:** `2.18`
**Deliverables:** Independent WCAG AA contrast audit, full TalkBack pass across every screen including emergency flows, touch-target audit, remediation.
**DoD:** Zero findings above minor/cosmetic severity; `1.10` re-verified specifically.

# 3.5 — Performance & Offline-Resilience Testing
**Prerequisites:** `2.18`
**Deliverables:** Simulated low-bandwidth/intermittent-connectivity pass; `FlashList` performance on large lists; sync-engine stress test (large queued-mutation backlog); cold-start measurement.
**DoD:** No feature becomes unusable (vs. gracefully degraded) under simulated 2G/3G or intermittent connectivity.

# 3.6 — Dark Mode (Conditional Scope)
**Prerequisites:** `1.2`, `2.18`
**Deliverables:** Dark token set in `@theme`; full-app visual + contrast audit in dark mode.
**DoD:** Every screen from Phases 1–2 renders correctly in dark mode.
**Notes:** If dark mode is confirmed out of scope, drop this milestone and the corresponding Universal DoD line app-wide rather than leaving it ambiguous.

# 3.7 — Observability, Logging & AI-Quality Monitoring
**Prerequisites:** `2.18`
**Deliverables:** Crash reporting; structured diagnostic logging restricted to non-PHI fields; a separate, anonymized/aggregated AI-output quality-monitoring channel that never reintroduces raw prompt/response logging.
**Files:** `backend/app/core/logging.py`, monitoring/alerting config (any new SaaS dependency needs separate approval)
**DoD:** Log audit confirms zero PHI/prescriptions/reports/raw AI prompts or responses in production-config output.

# 3.8 — Full Regression & Device-Matrix QA
**Prerequisites:** `3.1`–`3.7`
**Deliverables:** Regression execution across the supported Android device/OS matrix (E2E tool from §3.4 if approved, otherwise scripted manual pass); role-based permission re-verification app-wide.
**DoD:** Zero P0/P1 defects across the matrix; all P2 defects explicitly triaged (fix-now vs. backlog).

# 3.9 — Beta / UAT Program
**Prerequisites:** `3.8`
**Deliverables:** Limited rollout, feature-flag gated where useful (e.g. Video Consultation, Doctor Q&A independently); structured feedback collection; critical-bug triage routed back to originating milestones.
**DoD:** Agreed beta exit criteria met; no open P0/P1 defects.

# 3.10 — Store Submission & Release Engineering
**Prerequisites:** `3.9`
**Deliverables:** Play Store listing (bilingual, reusing `1.22`'s locale content); EAS build/submit config; versioning/release process; rollback plan defined before first submission.
**Files:** `eas.json`, store listing assets
**DoD:** Build passes store review; rollback plan tested in staging.

# 3.11 — Production Backend Deployment & Scaling
**Prerequisites:** `2.18`, `3.1`, `3.7`
**Deliverables:** Production deployment (Railway/Render/Fly.io); automated DB backups; secrets rotation; monitoring dashboards wired to `3.7`. Redis/TFLite activation remains post-launch backlog (Appendix) and is not a blocker here.
**Files:** `backend/Dockerfile`, deployment/infra config, backup automation
**DoD:** Production environment passes `2.17`'s adversarial suite against the live deployment; backup restore tested at least once.

# 3.12 — Launch Readiness Sign-Off
**Prerequisites:** `3.1`–`3.11`
**Deliverables:** Final audit that every milestone meets its DoD; explicit triple-check of `1.10` per the workflow doc's emergency-feature standard; final airplane-mode re-test of the Emergency module as the last check before release.
**DoD:** Documented go/no-go decision with named sign-off; any "no-go" routes back to the specific blocking milestone. **Final gate.**

---

### [Appendix — Deferred / Post-Launch Backlog]
Tagged "(Phase 2)" in the original tech stack — a technology-adoption phase, distinct from this roadmap's Phase 1/2/3 — and intentionally deferred past launch:
- **Redis** — caching/background-job performance beyond Celery/APScheduler
- **TFLite/LiteRT** — on-device document classification, complementing `2.6`'s server-side pipeline

Neither blocks `3.12`. Re-evaluate once production usage justifies the added complexity.
