# AI Operating Instructions

## Core Directives
- **Always inspect the repository** before modifying it.
- **Always read `.ai/START_HERE.md`** at the beginning of a session.
- **Never assume a feature is missing** just because it is listed in ROADMAP.md; verify the actual code first.
- **Never duplicate existing functionality.**
- **Never silently change architectural decisions.** Document in `DECISIONS.md` if an authorized update occurs.
- **Never invent API contracts.** Follow `API_CONTRACT.md`.
- **Never put backend authorization logic in the frontend.** Frontend UI visibility does not secure the system.
- **Never bypass tenant isolation assumptions.**
- **Never hard-code secrets.**
- **Never store sensitive authentication tokens insecurely** (e.g., casually in `localStorage`).

## Development Standards
- Follow established project coding standards (TypeScript, Django, etc.).
- Preserve existing naming conventions.
- Prefer small, reviewable changes over massive rewrites.
- Run appropriate tests, typechecks, linting, and builds after implementation.
- Do not modify unrelated files.
- Do not implement future phases unless explicitly instructed.

## Context Maintenance
- Update `.ai/CURRENT_STATE.md` after meaningful work.
- Update `.ai/CHANGELOG.md` after meaningful milestones.
- Update `.ai/DECISIONS.md` whenever an architectural decision changes.
- Keep documentation synchronized with implementation.

## Agent-Specific Guidance

### Antigravity Responsibility Split
- UI/UX implementation and visual design.
- Layouts, HTML/CSS structure, responsive behavior.
- Design-system implementation and components.
- Visual QA.

### Codex Responsibility Split
- System architecture.
- TypeScript/Code correctness.
- API integration.
- State management and business logic hookups.
- Testing and refactoring.
- Security-sensitive implementation.
- CI/CD and code quality enforcement.

*Both agents must adhere strictly to these `.ai/` rules.*
