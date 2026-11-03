import {
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// shortcut: the old `email`/`student_email` (and unused `completed_at`) columns stay until the new code is deployed and
// scripts/backfill-user-id.mjs has run; then drop them and make user_id notNull in one cleanup migration.
export const disponibilidadeTable = pgTable("agendamentos", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: varchar({ length: 255 }),
  email: varchar({ length: 255 }),
  weekday: integer().notNull(),
  start: varchar({ length: 10 }).notNull(),
  finish: varchar({ length: 10 }).notNull(),
});

export const TASK_TYPE = [
  "DEVER",
  "PS",
  "PB",
  "REVISÃO",
  "LEITURA",
  "REDAÇÃO",
  "SIMULADO",
  "OUTROS",
] as const;
export const TASK_DIFICULTY = ["FÁCIL", "MÉDIO", "DIFÍCIL"] as const;
export const TASK_STATUS = ["AGENDADO", "CADASTRADO"] as const;
export const TASK_SUBJECT = [
  "LÍNGUA PORTUGUESA",
  "ARTES",
  "MATEMÁTICA",
  "BIOLOGIA",
  "QUÍMICA",
  "FÍSICA",
  "HISTÓRIA",
  "GEOGRAFIA",
  "FILOSOFIA",
  "SOCIOLOGIA",
  "LÍNGUA ESTRANGEIRA",
  "PROJETOS",
  "OUTROS",
] as const;

export const taskTypeEnum = pgEnum("task_type", TASK_TYPE);
export const taskDificultyEnum = pgEnum("task_dificulty", TASK_DIFICULTY);
export const taskStatusEnum = pgEnum("task_status", TASK_STATUS);
export const tasksubjectEnum = pgEnum("task_subject", TASK_SUBJECT);

export const tarefaTable = pgTable(
  "tasks",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    type: taskTypeEnum("task_type").notNull(),
    dificulty: taskDificultyEnum("task_dificulty").notNull(),
    status: taskStatusEnum("task_status").notNull(),
    subject: tasksubjectEnum("task_subject").notNull(),
    user_id: varchar({ length: 255 }),
    student_email: varchar({ length: 255 }),
    title: varchar({ length: 255 }).notNull(),
    theme: varchar({ length: 255 }),
    description: text().notNull(),
    estimated_minutes: integer().notNull(),
    due_date: date("due_date").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").$onUpdate(() => new Date()),
    completed_at: timestamp("completed_at"), // unused; drop in the cleanup migration with the email columns
  },
  (t) => [index().on(t.user_id)],
);

export const agendamentoTable = pgTable(
  "schedules",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    user_id: varchar({ length: 255 }),
    email: varchar({ length: 255 }),
    recomentation_id: integer().references(() => recomendacaoTable.id, {
      onDelete: "cascade",
    }),
    start_time: timestamp({ mode: "string", precision: 0 }).notNull(),
    end_time: timestamp({ mode: "string", precision: 0 }).notNull(),
    reason: text().notNull(),
  },
  // Agenda and planner read one user's upcoming sessions; past rows are kept forever.
  // recomentation_id: Postgres doesn't index foreign keys, and every re-plan cascades a delete through it.
  (t) => [index().on(t.user_id, t.end_time), index().on(t.recomentation_id)],
);

export const recomendacaoTable = pgTable(
  "recommendations",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    task_id: integer().references(() => tarefaTable.id, { onDelete: "cascade" }),
    title: varchar({ length: 255 }).notNull(),
    overview: text().notNull(),
    prerequisites: text().array().notNull(),
    topics_to_study: text().array().notNull(),
    common_mistakes: text().array().notNull(),
    study_tips: text().array().notNull(),
  },
  // generatePlan deletes old plans by task_id, and deleting a task cascades through it.
  (t) => [index().on(t.task_id)],
);
