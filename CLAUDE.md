# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project overview

Uníco studyPlanner ("Único planner") is a Next.js app that helps students build their weekly study schedules. Users authenticate, register their study availability, and (planned) the app will use AI to turn that availability into a generated schedule. UI copy is in Portuguese (pt-BR).

## Commands

```bash
npm run dev          # start the dev server
npm run build         # production build
npm run start          # run the production build
npm run lint            # eslint (eslint-config-next core-web-vitals + typescript)
npm run commit           # conventional commit prompt (commitizen), used instead of raw `git commit`
npm run db:generate       # generate Drizzle migrations from src/db/schema.ts into ./drizzle
npm run db:migrate         # apply migrations to DATABASE_URL
```

There is no test suite configured (no `test` script, no test files).

Required env vars (`.env`, not committed): `DATABASE_URL` (Neon Postgres), `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`.

## Architecture

- **Path alias `@/*` maps to the repo root**, not to `src/`, per `tsconfig.json` (`"@/*": ["./*"]`). This means imports are mixed: root-level dirs (`components/`, `lib/`) are imported as `@/components/...`, `@/lib/utils`, while app code is imported as `@/src/app/...`, `@/src/db/...`. When adding new shared UI/utils, put them at the repo-root `components/`/`lib/` to match the shadcn convention already in use; app/feature code stays under `src/app/`.
- **Feature folders** live under `src/app/<feature>/` and colocate `page.tsx`, a `components/` subfolder, and an `actions.ts` server-actions file (`"use server"`). `src/app/disponibilidade/` and `src/app/tarefas/` both follow this pattern: the page does an `auth.protect()` + `currentUser()` check, then renders a client form component (`<feature>Form`) and a server component that reads data (`<feature>Data`), both driven by server actions in `actions.ts`. Server actions call Drizzle directly and return `{ ok, data }`; a `delete<Feature>()` action exists in both features but is currently unimplemented (empty body).
- **Auth**: Clerk (`@clerk/nextjs`). `ClerkProvider` wraps the root layout (`src/app/layout.tsx`). Protected pages call `await auth.protect()` from `@clerk/nextjs/server` directly in the page (no `middleware.ts` in this repo). Sign in/out UI uses Clerk's `<Show when="signed-in" | "signed-out">` plus `<SignInButton>`/`<UserButton>`.
- **Database**: Drizzle ORM against Neon serverless Postgres. Schema in `src/db/schema.ts`, client in `src/db/db.ts` (`drizzle-orm/neon-http`, reads `DATABASE_URL`). `drizzle.config.ts` outputs migrations to `./drizzle`. Two tables so far: `disponibilidadeTable` (`agendamentos`, backing `disponibilidade`) and `tarefaTable` (`tasks`, backing `tarefas`), the latter with several pgEnums (`TASK_TYPE`, `TASK_DIFICULTY`, `TASK_STATUS`, `TASK_SUBJECT`) whose value arrays are exported alongside the enum for reuse in form options/types.
- **UI components**: shadcn/ui (`components.json`: style `base-nova`, base color `mist`, icon library `remixicon`) generated into `components/ui/`. Tailwind v4 is CSS-driven — there is no `tailwind.config.js`; theme tokens/variants are defined in `src/app/globals.css` via `@theme inline` and `@custom-variant dark (...)`, keyed off `data-color-mode` on `<html>`.
- **Shared layout pieces**: `src/app/layout/PageHeader/` renders each page's title/subtitle/CTA banner and is used by `src/app/page.tsx`, `disponibilidade/page.tsx`, and `tarefas/page.tsx`. `src/app/layout/Footer/` is used only on the home page (`src/app/page.tsx`). Neither is used by the _global_ header/nav — `src/app/layout.tsx` still inlines that markup directly in `RootLayout`, so global-nav edits (e.g. adding a new feature link) go in `layout.tsx`, not in `layout/PageHeader`.
