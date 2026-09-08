# High-Level Architecture

## Frontend Core Stack
- **Framework & Build**: React, TypeScript, Vite
- **Routing**: React Router
- **HTTP/API**: Axios, MSW (for mocking API contracts)
- **State Management**: Context API (global cross-cutting state like Auth/Tenant/Toasts), TanStack Query (server state cache), local state.
- **Forms**: React Hook Form, Zod
- **UI & Styling**: Tailwind CSS, shadcn/ui (customized to GymOS design tokens), Lucide React
- **Charts**: Recharts
- **Testing**: Jest, React Testing Library (RTL), Playwright. Target 70% coverage. E2E tests critical flows.
- **Quality**: ESLint, Prettier, strict TypeScript.

## Frontend Structure
The implementation follows a feature-first organization:
```
frontend/
  src/
    app/
    components/
    layouts/
    routes/
    features/
      auth/
      super-admin/
      dashboard/
      gyms/
      branches/
      members/
      trainers/
      memberships/
      attendance/
      payments/
      workouts/
      exercises/
      diets/
      progress/
      notifications/
      reports/
      settings/
      subscriptions/
    services/
    hooks/
    contexts/
    utils/
    types/
    assets/
```

## Backend Authority & API Principles
- **AUTHORIZATION, RBAC, TENANT ISOLATION, AND RESOURCE ACCESS ARE EXCLUSIVELY BACKEND AUTHORITIES.**
- The frontend operates based on responses from the backend API. The frontend reflects permissions (hides/disables actions) and handles unauthorized routes (403), but NEVER treats frontend isolation as a security boundary.
- **API Contract**: Base structure is `/api/v1`. 
  - Standard Success: `{"success": true, "data": {}, "message": "..."}`
  - Standard Error: `{"success": false, "error": {"code": "...", "message": "...", "details": {}}}`
- **Authentication**: Short-lived access tokens, refresh flows, HttpOnly cookies, 401 interception, secure logout on unrecoverable auth failure.

## Data-State UX Rule (Mandatory)
Every data-driven screen MUST support at least:
1. Loading
2. Empty
3. Error
4. Success
Where applicable, disabled, submitting, permission denied, not found, or confirmation states must also be handled.

## Routing / Role Scope
- **Shared**: `/auth`, `/403`, `/404`, `/maintenance`, `/profile`, `/notifications`
- **Owner/Admin**: `/dashboard`, `/members`, `/trainers`, `/branches`, `/plans`, `/memberships`, `/attendance`, `/payments`, `/reports`, `/settings`
- **Branch Manager/Receptionist**: `/dashboard`, `/members`, `/memberships`, `/attendance`, `/payments`, `/reports`
- **Trainer**: `/trainer/dashboard`, `/trainer/members`, `/trainer/workouts`, `/trainer/diets`, `/trainer/progress`, `/trainer/sessions`
- **Member**: `/member/dashboard`, `/member/membership`, `/member/payments`, `/member/attendance`, `/member/workouts`, `/member/diet`, `/member/progress`, `/member/notifications`, `/member/profile`
- **Super Admin**: Platform-level structure defined by DOC-018 Screen Inventory.

## Backend
- **Framework**: Django (Modular Monolith), DRF, MySQL, Redis, Celery, S3, Razorpay.
