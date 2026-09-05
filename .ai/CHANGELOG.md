# Changelog

## [Unreleased]

### Added (Phase 8: Analytics & Reporting)
- Integrated `AnalyticsDashboard` under the strict `/reports` operational boundary restricted safely isolated away from Trainers and Members.
- Executed visual metric architectures building scalable `KPICard` and specialized decoupled Recharts representations including `RevenueChart`.
- Created unified `DateRangeFilter` integration securely piping boundaries natively enforcing exact queries via `getAnalyticsOverview`.
- Ensured completely valid deterministic behavior via newly authored `analytics.handlers.ts` mapping Trial boundaries exactly into MSW schemas.

### Added (Phase 7: SaaS Infrastructure Implementation)
- Introduced comprehensive `SubscriptionSettingsView` nested deeply against the unified AppRoutes settings layout resolving exactly against the IA tree.
- Built strictly-typed domain models for Subscriptions, SaaS Plans, and granular Entitlements utilizing exact documented configurations.
- Integrated `useCurrentSubscription`, `useAvailablePlans`, `useChangePlan`, and `useCancelSubscription` TanStack Query mutations routing against unified MSW REST endpoints.
- Orchestrated deterministic lifecycle scenarios (TRIAL vs ACTIVE vs GRACE_PERIOD) mapped specifically over UI boundaries.
- Solidified strict E2E coverage explicitly traversing Role-Based Access Isolation via the `AuthSimulator`.

### Added (Phase 6: Member Experience)
- Implement unified Member Dashboard layout, metrics routing, and check-in history views.
- Harden strict-typing (`no-explicit-any`) across Member Payments, Member Invoices, and API utilities.
- Playwright E2E suites updated to resolve Auth Simulator race conditions and strictly wait for rendered mocked data using reliable locators.
- Prettier auto-formatting enforced strictly across entire `frontend/src` layer.

### Added (Phase 5: Billing & Schedule)
- Responsive UX AppShell leveraging structural Sidebar and dynamic Header with Breadcrumbs.
- Strongly-typed `roles.ts` bridging `SUPER_ADMIN`, `OWNER`, `BRANCH_MANAGER`, `RECEPTIONIST`, `TRAINER`, `MEMBER`.
- Created unified `ROUTE GUARDS` (`RequireAuth`, `RequireRole`, `RedirectToRoleDashboard`) dictating redirect patterns.
- Mock UX views (403 Forbidden, 404 Not Found, Maintenance).
- AuthSimulator view bridging unauthenticated developer test routes directly into the responsive layout.
- Destructive Action & List screen pattern stubs establishing standard behavior.
- Added comprehensive unit testing and Playwright E2E coverage for navigation flow and role isolation.

### Added (Phase 3: UX / Information Architecture)
- Centralized `src/routes/config.ts` defining structured IA, Roles, and Navigation definitions.

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
