"use server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/src/db/db";
import { tarefaTable } from "@/src/db/schema";

export async function getTasksForChatContext() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await currentUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  if (!userEmail) {
    throw new Error("Unauthorized");
  }

  return db
    .select()
    .from(tarefaTable)
    .where(
      and(
        eq(tarefaTable.student_email, userEmail),
        isNull(tarefaTable.completed_at),
      ),
    );
}
