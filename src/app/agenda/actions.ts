"use server";

import { db } from "@/src/db/db";
import { agendamentoTable, recomendacaoTable } from "@/src/db/schema";
import { and, eq, gte } from "drizzle-orm";
import { requireUserId } from "@/lib/auth";
import { localNow } from "@/utils/data";

// Errors are not caught: Next's error page beats an empty agenda that looks like a lost plan.
export async function getSchedules() {
  const user_id = await requireUserId();
  return db
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
}
