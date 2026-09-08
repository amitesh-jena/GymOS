# GymOS Backend: Architecture

## Backend Stack
The documented GymOS backend requires the following tech stack:
- **Language**: Python
- **Framework**: Django
- **API Framework**: Django REST Framework (DRF)
- **Database**: MySQL (relational persistence)
- **Cache & Message Broker**: Redis
- **Background Jobs**: Celery
- **Authentication**: JWT (JSON Web Tokens)

## Architectural Style
GymOS is designed as a **Modular Monolith**. 
Do not fragment the application into microservices, serverless layers, or entirely decoupled distributed systems unless explicitly enforced by the authoritative docs. 

## Modules
The backend domains map exactly as logical, separated Django applications. Suggested groupings based on DOC-009:
- **Core / Platform**: `config`, `accounts`, `tenants`, `common`
- **Operations**: `branches`, `members`, `trainers`, `memberships`, `attendance`
- **Revenue**: `payments`
- **Member Experience**: `workouts`, `diets`, `progress`
- **Communication**: `notifications`
- **Insights**: `reports`
- **SaaS**: `subscriptions`, `audit_logs`

## Request Flow
Django views should offload heavy rules to designated service modules.
`Request` → `Authentication` → `Tenant/Branch context` → `Permission checks (RBAC)` → `DRF ViewSet` → `Serializer` → `Service Layer Logic` → `Database Model` → `Response Envelope`

## Database Principles
- **Tenant Ownership:** Every piece of scoped operational data must safely resolve physically to a Tenant ownership field.
- **Transactions:** Complex actions (e.g. taking a payment and altering membership state) must be atomic.
- **Financial Types:** Monetary values must use decimal fields natively. Never use floating-point mathematics for money.
- **Relationships:** Branch level data resolves conditionally mapped safely under Gym limits.

## Security Principles
- All endpoints must authenticate safely through JWT.
- Authorization operates horizontally checking both RBAC access strings (`tenant.view`, `member.create`), AND isolation limits (A branch manager making a request regarding a branch they do not manage must receive an immediate rejection).
- Front-end payload structures can not be relied on. Strictly serialize and enforce validation limits server-side (DOC-010).

---
### AUTHORITATIVE SOURCES
- DOC-004 System Architecture Document
- DOC-009 Backend Architecture
- DOC-010 Security Design Document
