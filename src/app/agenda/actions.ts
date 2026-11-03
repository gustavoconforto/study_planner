"use server";

import { db } from "@/src/db/db";
import { agendamentoTable, recomendacaoTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { requireUserId } from "@/lib/auth";

export async function getSchedules() {
  const user_id = await requireUserId();
  try {
    const result = await db
      .select()
      .from(agendamentoTable)
      .where(eq(agendamentoTable.user_id, user_id))
      .leftJoin(
        recomendacaoTable,
        eq(agendamentoTable.recomentation_id, recomendacaoTable.id),
      )
      .orderBy(agendamentoTable.start_time);

    return {
      ok: true as const,
      data: result,
    };
  } catch {
    return {
      ok: false as const,
    };
  }
}
