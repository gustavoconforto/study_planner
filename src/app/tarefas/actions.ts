"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/src/db/db";
import {
  tarefaTable,
  TASK_TYPE,
  TASK_DIFICULTY,
  TASK_SUBJECT,
} from "@/src/db/schema";
import { eq } from "drizzle-orm";

type readTarefasParams = {
  userEmail: string;
};

type saveTarefaParams = {
  email: string;
  type: (typeof TASK_TYPE)[number];
  dificulty: (typeof TASK_DIFICULTY)[number];
  subject: (typeof TASK_SUBJECT)[number];
  title: string;
  description: string;
  estimated_minutes: number;
  due_date: string;
};

export async function saveTarefa(params: saveTarefaParams) {
  try {
    await db.insert(tarefaTable).values({
      type: params.type,
      dificulty: params.dificulty,
      subject: params.subject,
      status: "CADASTRADO",
      student_email: params.email,
      title: params.title,
      description: params.description,
      estimated_minutes: params.estimated_minutes,
      due_date: params.due_date,
    });
    revalidatePath("tarefas");
    return {
      ok: true,
    };
  } catch {
    return {
      ok: false,
    };
  }
}

export async function readTarefas(params: readTarefasParams) {
  const result = await db
    .select()
    .from(tarefaTable)
    .where(eq(tarefaTable.student_email, params.userEmail))
    .orderBy(tarefaTable.due_date);

  if (result) {
    return {
      ok: true,
      data: result,
    };
  }
  return {
    ok: false,
    data: undefined,
  };
}

export async function deleteTarefa() {}
