# Uníco studyPlanner

An intelligent study planner that helps students build their weekly schedules. Students provide their availability, and the app uses AI to generate an optimized study timetable around it.

Built with [Next.js](https://nextjs.org), [Clerk](https://clerk.com) for authentication, and [Neon](https://neon.tech) (Postgres) with [Drizzle ORM](https://orm.drizzle.team) for data storage.

## Features

- **Authentication** — sign in/sign up powered by Clerk.
- **Disponibilidade (Availability)** — students register the weekdays and time ranges they're free to study.
- **AI-generated schedules** — planned: turn a student's availability into a suggested study schedule.

## Getting Started

### Prerequisites

- Node.js
- A [Neon](https://neon.tech) Postgres database
- A [Clerk](https://clerk.com) application

### Environment variables

Create a `.env` file in the project root with:

```bash
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
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
    layout/             # Navbar, Footer, PageHeader
  db/
    schema.ts           # Drizzle schema
    db.ts                # Drizzle/Neon client
```

## Scripts

| Command             | Description                          |
| -------------------- | ------------------------------------ |
| `npm run dev`         | Start the development server         |
| `npm run build`       | Build for production                 |
| `npm run start`       | Start the production server          |
| `npm run lint`        | Run ESLint                           |
| `npm run db:generate` | Generate Drizzle migrations          |
| `npm run db:migrate`  | Apply Drizzle migrations             |
