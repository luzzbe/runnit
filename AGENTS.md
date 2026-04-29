# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Vite HMR)
npm run build        # Type-check then build for production
npm run lint         # ESLint
npm run preview      # Preview production build locally
npm run preview:gh   # Preview with /runnit/ base path (GitHub Pages)
```

No test suite is configured.

## Architecture

**Runnit** is a French-language PWA for personal running tracking. It has no backend — all data lives in `localStorage` via `src/lib/storage/index.ts` (keys: `runnit_profile`, `runnit_runs`).

### Data flow

`App.tsx` is the single orchestrator. It owns all state via three hooks:
- `useProfile` — read/write `UserProfile` from storage
- `useRuns` — CRUD on `Run[]`, keeps React state in sync with storage
- `useStats` — pure computation (memoized), derives `WeeklyStats`, `PersonalRecords`, `ProgressInsight[]` from runs

Stats/insights are computed in `src/lib/stats/calculations.ts` and never stored. Everything is passed down as props — there is no global state manager.

### Routing

`HashRouter` (required for GitHub Pages static hosting). Routes are in French:
- `/` — Dashboard
- `/ajouter` — Add/edit run
- `/historique` — Run history
- `/records` — Personal records
- `/profil` — Profile + onboarding

If no `UserProfile` exists in storage, only `OnboardingPage` renders (outside the main `Layout`).

### Key types (`src/types/index.ts`)

- `Run.feeling`: `1–5` where **1 = hard, 5 = great** (higher is better)
- `Run.fatigue`: `1–5` where **1 = fresh, 5 = exhausted** (higher is worse — inverse scale)
- `Run.pace`: stored as minutes/km (float)

### Path alias

`@/` maps to `src/`. All imports use this alias.

### UI

Tailwind CSS with a custom `primary-*` color scale (indigo-based, defined in `tailwind.config.js`). UI primitives are in `src/components/ui/`. Icons from `lucide-react`. Charts via `recharts`.
