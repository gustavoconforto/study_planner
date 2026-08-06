"use server";

import { db } from "@/src/db/db";
import { agendamentoTable, recomendacaoTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function getSchedulesByEmail(email: string) {
  try {
    const result = await db
      .select()
      .from(agendamentoTable)
      .where(eq(agendamentoTable.email, email))
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
