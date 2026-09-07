# GymOS Backend: Start Here

Welcome to the GymOS backend! If you are a human backend developer or an AI coding agent, this is your starting point.

## What is GymOS?
GymOS is an all-in-one B2B SaaS platform for gyms and fitness businesses. It is multi-tenant and supports multiple branches per gym.

## Current Backend Status
**FRONTEND**: Complete through Phase 23 (Regression tested, fully featured, and locked).
**BACKEND**: Implementation pending (Phase 24+).
**LIVE BACKEND**: Not verified.

## What the Backend Needs to Build
The backend must implement the documented API contract to replace the MSW mocks currently powering the frontend. This includes Authentication (JWT), multi-tenancy enforcement, and all operations (Users, Members, Plans, Billing, Attendance). 

## Technology Stacks
- **Frontend (Implemented)**: React, TypeScript, Vite, React Router, Axios, TanStack Query, React Hook Form, Zod, Tailwind CSS (3.4), shadcn/ui, Recharts.
- **Backend (Specified)**: Python, Django, Django REST Framework, MySQL, Redis, Celery.

## Important Boundaries
- **Backend Context:** The `.ai/BACKEND_*.md` files are condensed implementation context for quick orientation.
- **Authoritative Docs:** The `DOC-*` documents in the `docs/` folder remain the absolute source of truth. If a `.ai` file conflicts with a `DOC-*` document, the **DOC-*** document wins.
- **Never Invent:** Do not guess database schema, permission scopes, or new endpoints. Never invent requirements that are not documented.
- **Frontend Authorization:** Frontend RBAC only manages UI visibility. The Backend is the absolute security authority and must independently enforce all permissions and tenant isolations.

## Recommended Reading Order

Do NOT read all 18 authoritative documents at once. Read the onboarding sequence first, and only read the specific `DOC-*` files relevant to the module you are building.

1. `.ai/BACKEND_START_HERE.md` (You are here)
2. `.ai/BACKEND_AI_INSTRUCTIONS.md`
3. `.ai/BACKEND_CONTEXT.md`
4. `.ai/BACKEND_ARCHITECTURE.md`
5. `.ai/BACKEND_API_HANDOFF.md`
6. `.ai/BACKEND_FRONTEND_CONTRACT.md`
7. `.ai/BACKEND_TASKS.md`
8. Relevant `docs/DOC-*` files (when implementing a specific module)
9. The actual frontend API/service implementation for your endpoint target.

## Recommended Next Step
Go to `.ai/BACKEND_TASKS.md` to find the recommended domain dependency order (e.g. Foundation, then DB, then Auth).

---
### AUTHORITATIVE SOURCES
- DOC-001 Product Requirements Document
- DOC-004 System Architecture Document
- DOC-009 Backend Architecture
