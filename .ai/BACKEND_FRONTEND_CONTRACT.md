# GymOS Backend: Frontend Contract

This document highlights frontend dependencies the backend developer must seamlessly respect.

## Frontend Stack
The verified phase 23 implementation explicitly relies on the following configurations natively active at `C:\Projects\GymOS\frontend\package.json`:
- **React 19.x** with **TypeScript** and **Vite**
- **React Router Dom (v7)**
- **Axios** (Centralized REST requests)
- **TanStack Query** (Data caching/hydration limits)
- **React Hook Form** + **Zod** (Form architecture and structured typing overrides)
- **Tailwind CSS 3.4** + **shadcn/ui**
- **MSW (Mock Service Worker)**
- **Jest**, **React Testing Library**, **Playwright**

## Frontend Architecture
The codebase strictly asserts a **Feature-first** architecture isolated into `/frontend/src/features/`. Modules export constrained route targets rather than polluting global spaces.

## API Layer
All API interactions execute through a centralized Axios client inside `frontend/src/api/client.ts`. Modules leverage strictly typed methods which are heavily cached inside feature-specific TanStack Query hooks (e.g. `useMembers()`, `useCheckIn()`). 

## Authentication Expectations
- The frontend tracks its user boundary over `AuthContext`.
- **JWT Storage**: It manages in-memory resolution of Access Tokens reliably. No Access/Refresh Tokens are stored directly in `localStorage` mapping against XSS restrictions.
- **Refresh Flow**: Refresh constraints resolve naturally in Axios Interceptors handling queued 401 unauthenticated requests cleanly. The backend relies solely upon checking active token limits. Overridden tokens drop limits and route cleanly to login.
- **withCredentials**: False (Using bearer headers normally. No backend cookies expected unless DOC dictates otherwise).

## MSW
`MSW (Mock Service Worker)` operates deterministically returning REST mock behaviors matching backend schema expectations dynamically. The backend API must exactly map against these structures to replace MSW successfully. It is NOT the production backend.

## Query Behavior
TanStack updates asynchronously on `success` endpoints utilizing strictly registered query-invalidation keys (e.g. invalidating 'members' after mutating a successful `post`).
Responses route strictly through React suspense / loading conditions mapping empty, loading, error scopes smoothly.

## Validation and Scope Security 
- **Frontend Validation:** Zod parsing operates strictly on UI rendering paths managing UX experiences seamlessly. **Client-side validation does not replace backend validation.**
- **Frontend RBAC controls UI form rendering and navigational boundaries. Backend authorization MUST independently enforce permissions at the route API scope.**
- **Backend must independently enforce tenant isolation, branch isolations, and ownership structures safely without blind trust applied on user IDs matching payloads.**

---
### AUTHORITATIVE SOURCES
- DOC-006 API Specification
- DOC-008 Frontend Architecture
- DOC-010 Security Design Document
