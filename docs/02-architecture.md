### [Architecture Guidelines]
Use the following structure as the baseline foundation. You may modify, refine, reorganize, replace, or extend any part of it as necessary to better align with Medicon’s requirements, workflows, architecture, scalability needs, and technical constraints.

```tsx
app/
  (auth)/
  (app)/
    (tabs)/
    emergency/
    medicine/
    symptom/
    pediatric/
    vitals/
    doctors/
    prescriptions/
    report/
    settings/
    notifications.tsx
src/
  components/
    ui/
    forms/
    cards/
    medical/
    layouts/
    navigation/
  hooks/
  store/
  services/
    api/
    ai/
    storage/
    notifications/
    protocols/
  database/
    index.ts
    schema/
    models/
    migrations/
    adapters/
  utils/
  theme/
  types/
  constants/
  assets/
    images/
    icons/
```

# app/
Contains only Expo Router file-based routes and layouts. Screens should compose components, call hooks, and handle navigation. Keep screens focused on presentation by moving business logic, API calls, and complex workflows into hooks, services, or the database layer.

# src/components/
Reusable UI building blocks.

Create a component only when:
- It is used in 2 or more places, OR
- It makes a screen significantly easier to read, OR
- It represents a clear UI concept: `EmergencyStepCard`, `VitalReadingCard`, `DoctorCard`, `MedicationCard`

When in doubt, keep the UI inside the screen first and extract later.

# src/hooks/
Custom React hooks that orchestrate services and stores into screen-ready state and actions. Hooks contain presentation-specific business logic while keeping screens clean and declarative.

# src/store/
Zustand state stores. Use one store per feature or module. Stores manage application state and simple state updates only-they should not contain API calls, AI logic, database operations, or other external communication.

# src/services/
Framework-agnostic business services and external integrations. This includes API clients, AI services, storage adapters, notifications, and other platform integrations. Service files should never import React.

# src/database/
WatermelonDB configuration and data layer. Contains database initialization, schemas, models, migrations, and adapters. Responsible only for local database access and persistence.

# src/theme/
Design system tokens: `colors.ts`, `typography.ts`, `spacing.ts`, `radius.ts`, `shadows.ts`, `index.ts`. This is the single source of truth for every visual value.

# src/types/
Shared TypeScript type definitions: `navigation.types.ts`, `medical.types.ts`, `api.types.ts`, `common.types.ts`.

# src/constants/
Static application values: `routes.ts`, `strings.ts`, `medical.constants.ts`, `config.ts`. Only immutable values belong here.

---

### [Backend Project Structure]
backend/app/{
  main.py, core/, api/v1/, models/, schemas/, services/, db/, workers/
}
backend/{
  alembic/, tests/, Dockerfile, pyproject.toml
}

### [State Management Rules]

|            Data type             |                Tool                |
|----------------------------------|------------------------------------|
| Auth tokens, user identity       | Zustand + SecureStore              |
| Health profile data              | Zustand + MMKV                     |
| Emergency protocol step state    | Zustand (no persistence)           |
| Server data (doctors, medicines) | TanStack Query                     |
| AI results (symptom triage, lab) | TanStack Query with long staleTime | 
| Vital signs history              | Zustand + MMKV                     |
| Prescriptions                    | Zustand + MMKV                     |
| UI loading/error states          | TanStack Query or local useState   |

Use `useState` only for component-local UI state. Use Zustand for state that must be shared across multiple screens or survive screen navigation.
Never perform API requests directly in components. Components should call hooks, and hooks should use `src/services/` for all external communication.

---

### [API & Service Contracts]
All communication with external systems goes through the service layer.

Services include:
- Authentication
- AI
- Doctors
- Consultations
- Reports
- Prescriptions
- Hospitals
- Notifications
- Emergency
- Storage

Rules:
- Components never call APIs directly.
- Hooks compose service functions.
- Services return typed results only.
- Services never return `any`.
- Services convert API responses into application models.
- API errors must be converted into application errors before reaching the UI.

---

### [Offline & Data Synchronization Rules]
MediCon is offline-first where practical.

- Emergency protocols must always work completely offline.
- User profile, prescriptions, reports metadata, and hospital data are stored locally.
- Network-dependent features (AI, consultations, maps, doctor search) must detect offline status and display an appropriate offline message.
- Local changes are queued and synchronized automatically when connectivity returns.
- If local and server versions conflict, prefer the server version unless explicitly configured otherwise.
- Synchronization must never block normal application usage.
- Never delete locally stored medical data until successful server confirmation.

---

### [Navigation Rules]

All navigation uses typed route constants. Never use raw string paths.

```tsx
// CORRECT
import { Routes } from '@constants/routes';
router.push(Routes.EMERGENCY.CPR);
router.push(`${Routes.MEDICINE.DETAIL}?medicineId=${id}`);

// WRONG
router.push('/(app)/emergency/cpr');
router.push('/medicine/detail?medicineId=' + id);
```

All screen params are typed. Use `useLocalSearchParams<ParamType>()` always.

---

### [Path Aliases]
Use these aliases everywhere. Never use relative paths like `../../`.

```ts
@/*           → src/*
@components/* → src/components/*
@hooks/*      → src/hooks/*
@store/*      → src/store/*
@services/*   → src/services/*
@utils/*      → src/utils/*
@constants/*  → src/constants/*
@types/*      → src/types/*
@theme/*      → src/theme/*
@assets/*     → src/assets/*
```

---

### [Feature Flags]
Experimental features must be controlled through feature flags.

Examples include:

- AI Lab Report Interpreter
- Medicine Comparator
- Doctor Q&A
- Video Consultation

Removing or disabling a feature flag must not affect unrelated functionality.