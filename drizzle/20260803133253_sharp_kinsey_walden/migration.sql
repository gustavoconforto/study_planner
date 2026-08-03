ALTER TABLE "tasks" ADD COLUMN "due_date" date;
UPDATE "tasks" SET "due_date" = '2026-08-14' WHERE "due_date" IS NULL;
ALTER TABLE "tasks" ALTER COLUMN "due_date" SET NOT NULL;