ALTER TABLE "schedules" ADD COLUMN "user_id" varchar(255);--> statement-breakpoint
ALTER TABLE "agendamentos" ADD COLUMN "user_id" varchar(255);--> statement-breakpoint
ALTER TABLE "recommendations" ADD COLUMN "task_id" integer;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "user_id" varchar(255);--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN "completed_at";--> statement-breakpoint
ALTER TABLE "agendamentos" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "student_email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_task_id_tasks_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE;