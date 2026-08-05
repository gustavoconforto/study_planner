CREATE TABLE "schedules" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "schedules_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"recomentation_id" integer,
	"start_time" timestamp(0) NOT NULL,
	"end_time" timestamp(0) NOT NULL,
	"reason" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recommendations" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "recommendations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(255) NOT NULL,
	"overview" varchar(255) NOT NULL,
	"prerequisites" text[] NOT NULL,
	"topics_to_study" text[] NOT NULL,
	"common_mistakes" text[] NOT NULL,
	"study_tips" text[] NOT NULL
);
--> statement-breakpoint
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_recomentation_id_recommendations_id_fkey" FOREIGN KEY ("recomentation_id") REFERENCES "recommendations"("id") ON DELETE CASCADE;