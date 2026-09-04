# Architectural Decisions Log

## DECIDED
- **Frontend Stack**: 
  - **Core**: React, TypeScript, Vite, React Router, Axios
  - **State**: Context API (for global cross-cutting), TanStack Query (server state/cache), local/feature state
  - **Forms**: React Hook Form, Zod
  - **UI / Styling**: Tailwind CSS, shadcn/ui, Lucide React (Icons). GymOS design tokens remain the true source of visual design.
  - **Charts**: Recharts
  - **API Mocking**: MSW
  - **Testing**: Jest, React Testing Library, Playwright
  - **Quality**: ESLint, Prettier, TypeScript strict checking
- **Frontend Styling Architecture**: GymOS frontend styling uses Tailwind CSS + shadcn/ui, with GymOS design tokens as the source of truth. 
  *Reasoning/Explanation*: Tailwind + shadcn accelerates development while keeping components fully customizable. The DOC-008 requirement for design tokens remains authoritative (colors, typography, spacing, etc. will map to Tailwind config). CSS Modules are not the primary styling system for new frontend work, and will only be used if there is a genuinely component-specific styling case that cannot be handled cleanly via Tailwind. The shadcn components will be customized to our GymOS token definitions.
- **Frontend Architecture**: Feature-first organization.
- **Backend Stack**: Django + DRF backend.
- **Database**: MySQL as primary datastore. Redis for caching/queue. Celery for background tasks.
- **Storage**: S3/object storage.
- **Payments**: Razorpay.
- **Tenant & RBAC Security**: Backend-authoritative RBAC and tenant isolation. Frontend handles UI visibility, but backend enforces data access.
- **API Standard**: API versioning at `/api/v1`.
- **API Dev Flow**: Frontend should use mock APIs before backend integration.
- **State Management**: Frontend should not duplicate server state unnecessarily.
- **Security**: Security-sensitive tokens should not be casually stored in `localStorage`.
- **Version Control**: Protected main / feature branch workflow. Conventional Commits required.

## OPEN
- Precise notification providers (SendGrid, Twilio, etc.).

## TO BE FINALIZED
- Exact color scheme, typography, spacing values (will map to semantic tokens).
