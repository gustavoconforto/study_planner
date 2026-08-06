import {
  date,
  integer,
  pgEnum,
  pgTable,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const disponibilidadeTable = pgTable("agendamentos", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull(),
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

export const tarefaTable = pgTable("tasks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  type: taskTypeEnum("task_type").notNull(),
  dificulty: taskDificultyEnum("task_dificulty").notNull(),
  status: taskStatusEnum("task_status").notNull(),
  subject: tasksubjectEnum("task_subject").notNull(),
  student_email: varchar({ length: 255 }).notNull(),
  title: varchar({ length: 255 }).notNull(),
  theme: varchar({ length: 255 }),
  description: text().notNull(),
  estimated_minutes: integer().notNull(),
  due_date: date("due_date").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").$onUpdate(() => new Date()),
  completed_at: timestamp("completed_at"),
});

export const agendamentoTable = pgTable("schedules", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }),
  recomentation_id: integer().references(() => recomendacaoTable.id, {
    onDelete: "cascade",
  }),
  start_time: timestamp({ mode: "string", precision: 0 }).notNull(),
  end_time: timestamp({ mode: "string", precision: 0 }).notNull(),
  reason: varchar({ length: 255 }).notNull(),
});

export const recomendacaoTable = pgTable("recommendations", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  overview: text().notNull(),
  prerequisites: text().array().notNull(),
  topics_to_study: text().array().notNull(),
  common_mistakes: text().array().notNull(),
  study_tips: text().array().notNull(),
});
