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
- **Feature folders** live under `src/app/<feature>/` and colocate `page.tsx`, a `components/` subfolder, and an `actions.ts` server-actions file (`"use server"`). See `src/app/disponibilidade/` as the reference pattern: the page does an `auth.protect()` + `currentUser()` check, then renders a client form component and a server component that reads data, both driven by server actions in `actions.ts`. Server actions call Drizzle directly and return `{ ok, data }`.
- **Auth**: Clerk (`@clerk/nextjs`). `ClerkProvider` wraps the root layout (`src/app/layout.tsx`). Protected pages call `await auth.protect()` from `@clerk/nextjs/server` directly in the page (no `middleware.ts` in this repo). Sign in/out UI uses Clerk's `<Show when="signed-in" | "signed-out">` plus `<SignInButton>`/`<UserButton>`.
- **Database**: Drizzle ORM against Neon serverless Postgres. Schema in `src/db/schema.ts`, client in `src/db/db.ts` (`drizzle-orm/neon-http`, reads `DATABASE_URL`). `drizzle.config.ts` outputs migrations to `./drizzle`.
- **UI components**: shadcn/ui (`components.json`: style `base-nova`, base color `mist`, icon library `remixicon`) generated into `components/ui/`. Tailwind v4 is CSS-driven — there is no `tailwind.config.js`; theme tokens/variants are defined in `src/app/globals.css` via `@theme inline` and `@custom-variant dark (...)`, keyed off `data-color-mode` on `<html>`.
- **Known inconsistency**: `src/app/layout.tsx` inlines its own header/nav markup rather than rendering the `Navbar` component at `src/app/layout/Navbar/`, which currently isn't used anywhere. If you're editing the global header, check whether you should edit `layout.tsx` directly or wire in the `Navbar` component instead of assuming one is authoritative.
