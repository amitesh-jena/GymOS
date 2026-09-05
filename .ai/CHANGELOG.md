# Changelog

## [Unreleased]

### Added (Phase 3: UX / Information Architecture)
- Centralized `src/routes/config.ts` defining structured IA, Roles, and Navigation definitions.
- Responsive UX AppShell leveraging structural Sidebar and dynamic Header with Breadcrumbs.
- Strongly-typed `roles.ts` bridging `SUPER_ADMIN`, `OWNER`, `BRANCH_MANAGER`, `RECEPTIONIST`, `TRAINER`, `MEMBER`.
- Created unified `ROUTE GUARDS` (`RequireAuth`, `RequireRole`, `RedirectToRoleDashboard`) dictating redirect patterns.
- Mock UX views (403 Forbidden, 404 Not Found, Maintenance).
- AuthSimulator view bridging unauthenticated developer test routes directly into the responsive layout.
- Destructive Action & List screen pattern stubs establishing standard behavior.
- Added comprehensive unit testing and Playwright E2E coverage for navigation flow and role isolation.

## [2026-09-04] - Phase 2 Design System Established
- Configured native CSS variables (Light/Dark themes) using HSL semantics for GymOS (Electric Green, Deep Navy colors mapped to success/info/warning).
- Integrated correct `tailwindcss` and `components.json` settings.
- Formally integrated UI core components (`button`, `input`, `card`, `table`, `tabs`, `badge`, `label`, `skeleton`) directly extending standard cva variants to bypass broken npx shadcn CLI prompts.
- Established rigorous UX states (`EmptyState`, `ErrorState`, `LoadingState`, `SuccessState`, `NotAuthorizedState`) binding into UI primitives and `lucide-react` icons.
- Deployed full verification Showcase in `_DesignSystemShowcase.tsx`.
- Validated tests (installed `@testing-library/dom` to resolve jest setup failure), passed typechecking (resolved casing conflicts for `button.tsx`), and confirmed build. Phase 2 fully verified and COMPLETE.

## [Unreleased]
- Refactored ESLint to Flat Config (`eslint.config.js`).
- Fixed and hardened Jest configuration to correctly polyfill MSW v2 in JSDOM, using `undici` and Node globals (`jest.polyfills.cjs`).
- Updated TypeScript structure, fixing Node config mismatch for Vite and adding proper types.
- Hardened Tailwind CSS v4 setup and resolved CSS `@apply` build blockers.
- Full verification suite passing (`npm run lint`, `npm run typecheck`, `npm test`, `npm run build`).
- Phase 1 Frontend Foundation marked complete.

## [Initial Setup]
- GymOS repository initialized.
- `.ai/` persistent AI context system established.
- Frontend setup phase beginning.
