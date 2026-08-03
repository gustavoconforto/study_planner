CREATE TYPE "task_dificulty" AS ENUM('FÁCIL', 'MÉDIO', 'DIFÍCIL');--> statement-breakpoint
CREATE TYPE "task_status" AS ENUM('AGENDADO', 'CADASTRADO');--> statement-breakpoint
CREATE TYPE "task_type" AS ENUM('DEVER', 'PS', 'PB', 'REVISÃO', 'LEITURA', 'REDAÇÃO', 'SIMULADO', 'OUTROS');--> statement-breakpoint
CREATE TYPE "task_subject" AS ENUM('LÍNGUA PORTUGUESA', 'ARTES', 'MATEMÁTICA', 'BIOLOGIA', 'QUÍMICA', 'FÍSICA', 'HISTÓRIA', 'GEOGRAFIA', 'FILOSOFIA', 'SOCIOLOGIA', 'LÍNGUA ESTRANGEIRA', 'PROJETOS', 'OUTROS');--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tasks_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"task_type" "task_type" NOT NULL,
	"task_dificulty" "task_dificulty" NOT NULL,
	"task_status" "task_status" NOT NULL,
	"task_subject" "task_subject" NOT NULL,
	"student_email" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"estimated_minutes" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"completed_at" timestamp
);
