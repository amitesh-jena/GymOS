# Changelog

## [Unreleased]

### Added (Phase 14: Accessibility & UX Audit)
- Injected `aria-invalid` and `aria-describedby` into Radix and native HTML `<Input>`, `<SelectTrigger>`, and `<Textarea>` elements mapping closely to `react-hook-form` validation states across core workflows.
- Audited `Dialog` definitions globally injecting missing `<DialogDescription>` metadata establishing accessible names.
- Enforced screen reader semantics (`sr-only` labeling) comprehensively for Icon-only structural components (`ArrowLeft`, `FileEdit`, `ChevronRight`).
- Authored robust `accessibility.test.tsx` integration test guarding regression on key form structures successfully bumping codebase coverage.

### Added (Phase 13: Frontend Testing)
- Stabilized Jest open-handle teardown issues originating from React JSDOM timers (MESSAGEPORT).
- Resolved `ts-jest` ESM transpilation failures for module-level `api.ts` configurations by factoring out `import.meta.env` to Vite definitions.
- Achieved Playwright E2E determinism, solving detached DOM race conditions (17/17 tests passing).
- Achieved `63.35%` line coverage, satisfying the `>=60%` frontend component coverage baseline.
- Implemented component tests covering high-value schemas and mocked service functions.

### Added (Phase 12: Real API Integration)
- Standardized Axios architecture implementing 401 refresh interceptors with queued promise caching preventing burst re-auth stampedes.
- Hardened Error normalization exposing exact `ApiError` typings bridging directly into TanStack forms preserving MSW backward compatibility.
- Fixed complex Playwright E2E detachment race conditions mapping structural Radix primitive transitions (`Select`/`Dialog`) rigorously.
- Full quality gates verification passed across Format, Check, Lint, Jest, Vitest, and Playwright integration suites natively preserving Phase 11 dependencies.

### Added (Phase 11: Cross-Role Business Workflows)
- Connected independent Domain modules (Memberships, Receivables, Workouts, Tenancy) via robust cross-context state hydration inside TanStack query layer.
- Enforced Role-based view transformations (Trainers accessing specialized `TrainerMembersList` and `TrainerWorkoutsWorkspace` bounded exclusively to their managed targets).
- Simulated complete, atomic state lifecycles within `msw` implementations (e.g. paying invoices directly alters associated global mock schemas: Invoice, Receipt, Membership).
- Expanded Playwright structural assertions capturing deterministic multi-hop operations across the GymOS application.


### Added (Phase 10: Production Hardening & Settings)
- Stabilized Application layout enveloping all internal navigation under a global fallback `ErrorBoundary`.
- Authored the core Application Themes context scaling CSS classes bridging across four custom aesthetics seamlessly maintaining preference sync via local-storage.
- Configured a dedicated `<SettingsLayout />` injecting comprehensive cross-object settings (Profile, Appearance, Security, Organization) with Zod-schema validations.
- Fortified standard E2E suites extending Playwright structural assertions to capture RBAC settings exclusions effectively maintaining member perimeter logic.

### Added (Phase 9: SaaS Platform Administration)
- Integrated `AdminTenantsList` and `AdminTenantDetail` to provide Super Admins deep overarching visibility over Tenant resources and Subscription limits.
- Upgraded the unified `RequireRole` AppRouting constraints preventing unauthorized horizontal scaling from lesser bounds.
- Augmented MSW definitions routing structured platform payloads resolving `memberCount` and `branchCount` statistics.
- Finalized exhaustive E2E and Jest coverage guaranteeing structural integrity across all strict layout integrations.

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
