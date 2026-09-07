# GymOS Backend: AI Agent Instructions

These instructions govern all AI coding agents contributing to the GymOS backend. Adhere to these strictly to avoid hallucinations, architectural drift, token waste, and security mistakes.

## Principles

1. **Read `BACKEND_START_HERE.md` before coding.**
2. **Inspect existing backend code** before creating new abstractions.
3. **Never invent requirements.** Follow the source materials exactly.
4. **Never invent undocumented endpoints.** Follow the `DOC-006` spec and the frontend's expected API signature.

## Authoritative Documentation Hierarchy

The `docs/` DOC-X files are the absolute source of truth.
- **DOC-005** is authoritative for database design.
- **DOC-006** is authoritative for API contracts.
- **DOC-007** is authoritative for RBAC (Role-Based Access Control).
- **DOC-009** is authoritative for backend architecture.
- **DOC-010** is authoritative for security.
- **DOC-011** is authoritative for coding standards.
- **DOC-013** is authoritative for testing expectations.

If a documentation conflict exists (between `.ai/`, `DOC-*`, and the frontend codebase), you must **identify the conflict** in your summaries. Do not quietly override it. Follow `DOC-*` unless overridden explicitly by a validated frontend paradigm.

## Security & Architectural Rules

- **Backend Must Enforce Authorization:** Frontend RBAC is not a substitute for backend authorization. The server must check permissions on every request.
- **Tenant Isolation:** The backend must enforce tenant (gym) isolation and branch scopes. Never trust tenant/branch identifiers supplied merely by the client; validate them according to the authenticated user's access boundaries.
- **Validate Everything:** Validate all client inputs server-side.
- **No Secrets Escaping:** Never expose secrets or commit credentials.
- **Decimal for Currency:** Do not store money as floating-point values. Use strict Decimal types.
- **Transactions:** Use database transactions for atomic business workflows (like paying an invoice + updating a membership + marking attendance).
- **Service Layer (Modular Monolith):** Keep meaningful business logic out of giant Django views. Follow the documented modular architecture. Do not spontaneously branch into Microservices.

## QA and Integrity

- **Write tests with implementation.** Test permission boundaries, tenant isolation, and branch constraints as thoroughly as the happy paths.
- **Fix the Root Cause:** Do not modify frontend behavior to hide or patch backend mistakes.
- **Don't Falsify Data:** Never claim live backend integration has been verified unless you have successfully bridged the deployed front and back ends.
- **No Unknown Tech:** Do not introduce undocumented technologies (e.g. GraphQL, MongoDB) just because you know them.
- **Respect Git:** Follow the documented Git workflow. Never force-push or rewrite git history.

## Expected AI Workflow

You will optimize context ingestion and code writing by strictly following:
`INSPECT` → `UNDERSTAND` → `PLAN` → `IMPLEMENT` → `TEST` → `REVIEW` → `DOCUMENT` → `COMMIT`

*Only load/read the authoritative documents relevant to the current task once the domain is known! Do not ingest all 18 documents for every task.*

---
### AUTHORITATIVE SOURCES
- DOC-011 Coding Standards
- DOC-012 Git Workflow
- DOC-010 Security Design Document
