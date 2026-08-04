"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/src/db/db";
import { agendamentoTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";

type readDisponibilidadeParams = {
  userEmail: string;
};

type saveDisponibilidadeParams = {
  email: string;
  weekday: number;
  start: string;
  finish: string;
};

export async function saveDisponibilidade(params: saveDisponibilidadeParams) {
  try {
    await db.insert(agendamentoTable).values(params);
    revalidatePath("disponibilidade");
    return {
      ok: true,
    };
  } catch {
    return {
      ok: false,
    };
  }
}

export async function readDisponibilidade(params: readDisponibilidadeParams) {
  const result = await db
    .select()
    .from(agendamentoTable)
    .where(eq(agendamentoTable.email, params.userEmail))
    .orderBy(agendamentoTable.weekday);

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

export async function deleteDisponibilidade() {}
