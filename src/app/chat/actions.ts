"use server";
import { and, eq, gte } from "drizzle-orm";
import { db } from "@/src/db/db";
import { tarefaTable } from "@/src/db/schema";
import { requireUserId } from "@/lib/auth";
import { localNow } from "@/utils/data";

export async function getTasksForChatContext() {
  const user_id = await requireUserId();

  return db
    .select()
    .from(tarefaTable)
    .where(
      and(
        eq(tarefaTable.user_id, user_id),
        gte(tarefaTable.due_date, localNow().date),
      ),
    );
}
