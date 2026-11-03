"use server";

import { db } from "@/src/db/db";
import { agendamentoTable, recomendacaoTable } from "@/src/db/schema";
import { and, eq, gte } from "drizzle-orm";
import { requireUserId } from "@/lib/auth";
import { localNow } from "@/utils/data";

export async function getSchedules() {
  const user_id = await requireUserId();
  try {
    const result = await db
      .select()
      .from(agendamentoTable)
      .where(
        and(
          eq(agendamentoTable.user_id, user_id),
          // Only today and later; past sessions stay in the DB but are not shown.
          gte(agendamentoTable.end_time, `${localNow().date} 00:00:00`),
        ),
      )
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
