# GymOS - AI Project Context & Starting Point

**READ THIS FILE BEFORE MODIFYING ANY CODE.**

## 1. Project Identity
**GymOS** — a multi-tenant B2B SaaS Fitness Business Operating System for gyms.

## 2. What GymOS is
GymOS is designed to manage fitness businesses. It supports multi-tenancy, targeting gym and business users with role-based access control and various fitness-related modules.

## 3. Current Repository State
- The repository is currently a minimal skeleton.
- GitHub remote already exists.
- The `main` branch must remain untouched. Work is being done on a dedicated feature branch.
- This is the initial setup phase. Frontend and Backend implementations do not exist yet.

## 4. Current Development Phase
Phase 1 — Frontend Project Foundation (Setup phase is beginning).

## 5. Required Reading Order
Before performing any coding tasks, you must read the following files in order:
1. `.ai/START_HERE.md` (This file)
2. `.ai/PROJECT_CONTEXT.md`
3. `.ai/AI_INSTRUCTIONS.md`
4. `.ai/CURRENT_STATE.md`
5. Relevant architecture/design/API/RBAC documents within `.ai/`
6. Actual repository/code
7. `.ai/TASKS.md` / `.ai/ROADMAP.md` as needed

## 6. AI Operating Rules
See `.ai/AI_INSTRUCTIONS.md` for full operating rules.
- DO NOT recreate existing work, verify code first.
- DO NOT invent requirements or undocumented APIs.
- Keep `.ai/` context updated after meaningful work.

## 7. Architecture Overview
- **Frontend**: React SPA, TypeScript, React Router, Axios, Feature-first organization.
- **Backend**: Django modular monolith, DRF, MySQL, Redis, Celery.
See `.ai/ARCHITECTURE.md`.

## 8. Role/RBAC Overview
Six defined roles: Super Admin, Gym Owner, Branch Manager, Receptionist, Trainer, Member.
RBAC and tenant isolation are completely backend-authoritative.
See `.ai/RBAC.md`.

## 9. Frontend Direction
Focus on small, visual, reusable components organized in a feature-first structure.
See `.ai/ARCHITECTURE.md` and `.ai/UX_RULES.md`.

## 10. API Direction
Backend authoritative. Standard JSON envelopes for response and errors. Authentication via JWT. Frontend to use mock APIs initially.
See `.ai/API_CONTRACT.md`.

## 11. Testing Expectations
Appropriate tests must be written for all code. Typechecking and linting must pass before marking tasks complete.

## 12. Security Expectations
Secrets must never be hard-coded. Sensitive tokens must not be stored insecurely. Backend enforces all access control. Authorization logic does not belong in the frontend.

## 13. Git Workflow
Protect `main` branch. Use feature branches. Conventional Commits for commit messages.

## 14. How to Update `.ai/`
Update `.ai/CURRENT_STATE.md` after meaningful work and `.ai/CHANGELOG.md` for milestones. Update `.ai/DECISIONS.md` whenever an architecture decision is changed. Keep `.ai/TASKS.md` updated with progress.

## 15. How to Determine the Current Task
Review `.ai/TASKS.md` under "CURRENT TASK". 

**Do NOT restart or redesign the project from scratch. Do NOT claim implementation that does not exist.**
