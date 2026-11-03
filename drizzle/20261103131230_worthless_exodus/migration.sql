CREATE INDEX "schedules_user_id_end_time_index" ON "schedules" ("user_id","end_time");--> statement-breakpoint
CREATE INDEX "tasks_user_id_index" ON "tasks" ("user_id");