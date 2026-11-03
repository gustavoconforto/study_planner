import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

// Local runs read .env; CI/hosts pass DATABASE_URL in the environment.
if (existsSync(".env")) process.loadEnvFile();

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
