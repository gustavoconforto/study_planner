"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { db } from "@/src/db/db";
import { disponibilidadeTable } from "@/src/db/schema";
import { requireUserId } from "@/lib/auth";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

const disponibilidadeSchema = z
  .object({
    weekday: z
      .number()
      .int("Selecione um dia da semana")
      .min(0, "Selecione um dia da semana")
      .max(6, "Selecione um dia da semana"),
    start: z.string().regex(timeRegex, "Informe um horário inicial válido"),
    finish: z.string().regex(timeRegex, "Informe um horário final válido"),
  })
  .refine((data) => data.finish > data.start, {
    message: "O horário final deve ser depois do horário inicial",
    path: ["finish"],
  });

export type DisponibilidadeErrors = Partial<
  Record<"weekday" | "start" | "finish", string[]>
>;

export async function saveDisponibilidade(input: {
  weekday: unknown;
  start: unknown;
  finish: unknown;
}): Promise<{ ok: true } | { ok: false; errors: DisponibilidadeErrors }> {
  const user_id = await requireUserId();
  const parsed = disponibilidadeSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };
  }
  try {
    await db.insert(disponibilidadeTable).values({ ...parsed.data, user_id });
    revalidatePath("disponibilidade");
    return { ok: true };
  } catch {
    return { ok: false, errors: {} };
  }
}

export async function readDisponibilidade() {
  const user_id = await requireUserId();
  return db
    .select()
    .from(disponibilidadeTable)
    .where(eq(disponibilidadeTable.user_id, user_id))
    .orderBy(disponibilidadeTable.weekday);
}

export async function deleteDisponibilidade(id: number) {
  const user_id = await requireUserId();
  try {
    await db
      .delete(disponibilidadeTable)
      .where(
        and(
          eq(disponibilidadeTable.id, id),
          eq(disponibilidadeTable.user_id, user_id),
        ),
      );
    revalidatePath("disponibilidade");
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
