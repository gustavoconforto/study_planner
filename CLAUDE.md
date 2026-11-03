# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project overview

Uníco studyPlanner ("Único planner") is a Next.js app that helps students build their weekly study schedules. Users authenticate, register their study availability and tasks (tarefas), and an AI planner (OpenAI) turns those into a generated schedule (agenda) with per-task study recommendations. UI copy is in Portuguese (pt-BR).

## Commands

```bash
npm run dev          # start the dev server
npm run build         # production build
npm run start          # run the production build
npm run lint            # eslint (eslint-config-next core-web-vitals + typescript)
npm run test             # run the vitest suite (tests live under tests/, mirroring src/)
npm run commit            # conventional commit prompt (commitizen), used instead of raw `git commit`
npm run db:generate        # generate Drizzle migrations from src/db/schema.ts into ./drizzle
npm run db:migrate          # apply migrations to DATABASE_URL
```

Required env vars (`.env`, not committed): `DATABASE_URL` (Neon Postgres), `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `OPENAI_API_KEY` (used by `lib/openai.ts` for the AI planner in `src/app/planner/actions.ts`).

## Architecture

- **Path alias `@/*` maps to the repo root**, not to `src/`, per `tsconfig.json` (`"@/*": ["./*"]`). This means imports are mixed: root-level dirs (`components/`, `lib/`, `utils/`) are imported as `@/components/...`, `@/lib/utils`, `@/utils/data`, while app code is imported as `@/src/app/...`, `@/src/db/...`. When adding new shared UI/utils, put them at the repo-root `components/`/`lib/`/`utils/` to match the shadcn convention already in use; app/feature code stays under `src/app/`.
- **Feature folders** live under `src/app/<feature>/` and colocate `page.tsx`, a `components/` subfolder, and an `actions.ts` server-actions file (`"use server"`). `src/app/disponibilidade/`, `src/app/tarefas/`, `src/app/planner/`, and `src/app/agenda/` follow this pattern (`src/app/chat/` uses a route handler instead, see Chat below): the page does an `auth.protect()` check, then renders a client form component (`<feature>Form`) and a server component that reads data (`<feature>Data`), both driven by server actions in `actions.ts`. Server actions are public endpoints: each one takes the owner from `requireUserId()` (`lib/auth.ts`), never from its arguments, validates input with zod on the server, and scopes updates/deletes to `user_id`. Rows are owned by Clerk `user_id` (the old email columns stay only until `scripts/backfill-user-id.mjs` has run).
- **Auth**: Clerk (`@clerk/nextjs`). `ClerkProvider` wraps the root layout (`src/app/layout.tsx`). Protected pages call `await auth.protect()` from `@clerk/nextjs/server` directly in the page. Clerk's middleware runs from `src/proxy.ts` (`clerkMiddleware()` with a matcher skipping static assets), not `middleware.ts`. Sign in/out UI uses Clerk's `<Show when="signed-in" | "signed-out">` plus `<SignInButton>`/`<UserButton>`.
- **Database**: Drizzle ORM against Neon serverless Postgres. Schema in `src/db/schema.ts`, client in `src/db/db.ts` (`drizzle-orm/neon-http`, reads `DATABASE_URL`). `drizzle.config.ts` outputs migrations to `./drizzle`. Tables: `disponibilidadeTable` (`agendamentos`, backing `disponibilidade`), `tarefaTable` (`tasks`, backing `tarefas`, with pgEnums `TASK_TYPE`, `TASK_DIFICULTY`, `TASK_STATUS`, `TASK_SUBJECT` whose value arrays are exported alongside the enum for reuse in form options/types), `recomendacaoTable` (`recommendations` — AI-generated study guidance per task) and `agendamentoTable` (`schedules` — AI-generated calendar sessions, FK to `recomendacaoTable`, backing `agenda`).
- **AI planner** (`src/app/planner/actions.ts`): `generatePlan()` expands the recurring availability into a 7-day window of concrete slots in São Paulo time (`buildAvailabilityWindows` in `planner/lib.ts`), atomically claims the user's `CADASTRADO` tasks by flipping them to `AGENDADO`, and calls `aiPlanner()` (OpenAI Responses API, structured JSON output via `text.format.json_schema`) with the window plus upcoming booked sessions. `pickValidSessions` drops AI sessions outside availability or overlapping; the rest are saved server-side into `recomendacaoTable` (linked to the task by `task_id`, cascade delete) and `agendamentoTable`. On failure the saved rows are deleted and the tasks go back to `CADASTRADO`. `src/app/agenda/` reads the joined `agendamentoTable`/`recomendacaoTable` rows to render the resulting schedule.
- **UI components**: shadcn/ui (`components.json`: style `base-nova`, base color `mist`, icon library `remixicon`) generated into `components/ui/`. Tailwind v4 is CSS-driven — there is no `tailwind.config.js`; theme tokens/variants are defined in `src/app/globals.css` via `@theme inline` and `@custom-variant dark (...)`, keyed off `data-color-mode` on `<html>`.
- **Shared layout pieces**: `src/app/layout/PageHeader/` renders each page's title/subtitle/CTA banner and is used across the feature pages. `src/app/layout/Navbar/` holds the global nav (the `menuItems` array), so a new feature link goes there; `src/app/layout.tsx` renders it next to Clerk's sign-in/user buttons. `src/app/layout/Footer/` is used only on the home page (`src/app/page.tsx`).
- **Chat**: `src/app/chat/` is the tutor chat page (`ChatWindow` client component, helpers in `chat/lib.ts`); it streams from the route handler `src/app/api/chat/route.ts`, which validates the message history with zod and adds the student's upcoming tasks as context.
- **Tests**: Vitest (`vitest.config.ts`, `environment: "node"`), with the same `@/*` root alias as the app. Tests live under `tests/`, mirroring the `src/` path of the file under test (e.g. `tests/app/planner/lib.test.js` tests `src/app/planner/lib.ts`).
