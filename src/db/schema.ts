import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("agendamentos", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull(),
  weekday: integer().notNull(),
  start: varchar({ length: 10 }).notNull(),
  finish: varchar({ length: 10 }).notNull(),
});
