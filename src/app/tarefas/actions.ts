"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { db } from "@/src/db/db";
import {
  tarefaTable,
  TASK_TYPE,
  TASK_DIFICULTY,
  TASK_SUBJECT,
  TASK_STATUS,
} from "@/src/db/schema";
import { requireUserId } from "@/lib/auth";

const tarefaSchema = z.object({
  type: z.enum(TASK_TYPE, "Selecione um tipo de tarefa"),
  dificulty: z.enum(TASK_DIFICULTY, "Selecione a dificuldade"),
  subject: z.enum(TASK_SUBJECT, "Selecione a matéria"),
  theme: z
    .string()
    .min(1, "Informe o tema")
    .max(255, "O tema deve ter no máximo 255 caracteres"),
  title: z
    .string()
    .min(1, "Informe um título")
    .max(255, "O título deve ter no máximo 255 caracteres"),
  // Every chat message and plan resends all descriptions to OpenAI, so this caps their cost.
  description: z
    .string()
    .min(1, "Informe uma descrição")
    .max(2000, "A descrição deve ter no máximo 2000 caracteres"),
  estimated_minutes: z
    .number()
    .int("Informe uma estimativa de tempo válida")
    .min(1, "Informe uma estimativa de tempo válida"),
  due_date: z.iso.date("Informe uma data de entrega válida"),
});

export type TarefaErrors = Partial<
  Record<keyof z.infer<typeof tarefaSchema>, string[]>
>;

export async function saveTarefa(
  input: Record<keyof z.infer<typeof tarefaSchema>, unknown>,
): Promise<{ ok: true } | { ok: false; errors: TarefaErrors }> {
  const user_id = await requireUserId();
  const parsed = tarefaSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };
  }
  try {
    await db
      .insert(tarefaTable)
      .values({ ...parsed.data, user_id, status: "CADASTRADO" });
    revalidatePath("/tarefas");
    return { ok: true };
  } catch {
    return { ok: false, errors: {} };
  }
}

export async function readTarefas() {
  const user_id = await requireUserId();
  return db
    .select()
    .from(tarefaTable)
    .where(eq(tarefaTable.user_id, user_id))
    .orderBy(tarefaTable.due_date);
}

export async function updateTarefaStatus(
  id: number,
  status: (typeof TASK_STATUS)[number],
) {
  const user_id = await requireUserId();
  const parsed = z
    .object({ id: z.number().int(), status: z.enum(TASK_STATUS) })
    .safeParse({ id, status });
  if (!parsed.success) return { ok: false };
  try {
    await db
      .update(tarefaTable)
      .set({ status: parsed.data.status })
      .where(and(eq(tarefaTable.id, id), eq(tarefaTable.user_id, user_id)));
    revalidatePath("/tarefas");
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

// The task's recommendation and sessions go with it (onDelete: "cascade").
export async function deleteTarefa(id: number) {
  const user_id = await requireUserId();
  try {
    await db
      .delete(tarefaTable)
      .where(and(eq(tarefaTable.id, id), eq(tarefaTable.user_id, user_id)));
    revalidatePath("/tarefas");
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
