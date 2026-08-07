# Uníco studyPlanner

An intelligent study planner that helps students build their weekly study schedules. Students register their availability and tasks, and an AI planner turns that into a scheduled agenda with per-task study recommendations.

Built with [Next.js](https://nextjs.org), [Clerk](https://clerk.com) for authentication, [Neon](https://neon.tech) (Postgres) with [Drizzle ORM](https://orm.drizzle.team) for data storage, and the [OpenAI API](https://platform.openai.com) for schedule generation. UI copy is in Portuguese (pt-BR).

## Features

- **Authentication** — sign in/sign up powered by Clerk.
- **Disponibilidade (Availability)** — students register the weekdays and time ranges they're free to study.
- **Tarefas (Tasks)** — students register study tasks (type, subject, difficulty, theme, estimated duration, due date).
- **Planner** — generates an AI study plan from a student's registered tasks and availability, avoiding overlaps with previously scheduled sessions.
- **Agenda** — displays the resulting schedule, grouped by day, along with the AI's study recommendations (overview, prerequisites, topics, common mistakes, study tips) for each task.

## Getting Started

### Prerequisites

- Node.js
- A [Neon](https://neon.tech) Postgres database
- A [Clerk](https://clerk.com) application
- An [OpenAI](https://platform.openai.com) API key

### Environment variables

Create a `.env` file in the project root with:

```bash
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
OPENAI_API_KEY=
```

### Install dependencies

```bash
npm install
```

### Set up the database

Generate and run migrations with Drizzle:

```bash
npm run db:generate
npm run db:migrate
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project structure

```
src/
  app/
    disponibilidade/   # Availability form and data, server actions
    tarefas/            # Task registration form and data, server actions
    planner/             # Triggers AI plan generation from tasks + availability
    agenda/               # Displays the generated schedule and recommendations
    layout/                # Navbar, Footer, PageHeader
  db/
    schema.ts               # Drizzle schema
    db.ts                     # Drizzle/Neon client
  proxy.ts                     # Clerk middleware
lib/
  openai.ts                     # OpenAI client
utils/
  data.ts                        # Shared UI data/helpers (e.g. weekday labels)
tests/                            # Vitest suite, mirrors src/ structure
```

## Database schema

Defined in `src/db/schema.ts` with Drizzle ORM. Four tables, all with an auto-generated `id` primary key.

### `agendamentos` (`disponibilidadeTable`)

A student's recurring weekly availability.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `integer` | Primary key |
| `email` | `varchar(255)` | Student's email |
| `weekday` | `integer` | `0` (Domingo) – `6` (Sábado) |
| `start` | `varchar(10)` | Start time (`HH:MM`) |
| `finish` | `varchar(10)` | End time (`HH:MM`) |

### `tasks` (`tarefaTable`)

A student's study tasks — source data for the AI planner.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `integer` | Primary key |
| `task_type` | enum | `TASK_TYPE`: DEVER, PS, PB, REVISÃO, LEITURA, REDAÇÃO, SIMULADO, OUTROS |
| `task_dificulty` | enum | `TASK_DIFICULTY`: FÁCIL, MÉDIO, DIFÍCIL |
| `task_status` | enum | `TASK_STATUS`: CADASTRADO, AGENDADO |
| `task_subject` | enum | `TASK_SUBJECT`: one of 13 school subjects (see schema for full list) |
| `student_email` | `varchar(255)` | Owning student's email |
| `title` | `varchar(255)` | Task title |
| `theme` | `varchar(255)` | Optional theme/topic |
| `description` | `text` | Task description |
| `estimated_minutes` | `integer` | Estimated time to complete |
| `due_date` | `date` | Deadline |
| `created_at` | `timestamp` | Defaults to now |
| `updated_at` | `timestamp` | Set on update |
| `completed_at` | `timestamp` | Nullable |

### `recommendations` (`recomendacaoTable`)

AI-generated study guidance for a task, produced by the planner.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `integer` | Primary key |
| `title` | `varchar(255)` | Recommendation title (task's title) |
| `overview` | `text` | Summary of the topic |
| `prerequisites` | `text[]` | List of prerequisite concepts |
| `topics_to_study` | `text[]` | List of topics to cover |
| `common_mistakes` | `text[]` | List of common mistakes |
| `study_tips` | `text[]` | List of study tips |

### `schedules` (`agendamentoTable`)

AI-generated calendar sessions that make up a student's agenda.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `integer` | Primary key |
| `email` | `varchar(255)` | Student's email |
| `recomentation_id` | `integer` | FK → `recommendations.id`, `onDelete: cascade` |
| `start_time` | `timestamp` | Session start |
| `end_time` | `timestamp` | Session end |
| `reason` | `text` | Why the AI scheduled this session at this time |

## Scripts

| Command             | Description                          |
| -------------------- | ------------------------------------ |
| `npm run dev`         | Start the development server         |
| `npm run build`       | Build for production                 |
| `npm run start`       | Start the production server          |
| `npm run lint`        | Run ESLint                           |
| `npm run test`        | Run the Vitest test suite            |
| `npm run commit`      | Conventional commit prompt (commitizen) |
| `npm run db:generate` | Generate Drizzle migrations          |
| `npm run db:migrate`  | Apply Drizzle migrations             |
