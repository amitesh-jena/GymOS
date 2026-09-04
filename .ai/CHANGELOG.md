# Changelog

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
