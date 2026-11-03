import { beforeEach, describe, expect, it, vi } from "vitest";
import { PgDialect } from "drizzle-orm/pg-core";

// Signed in as user_a, every update/delete by id must also be limited to user_a's rows,
// or any signed-in user could change someone else's rows by guessing ids.
const wheres = vi.hoisted(() => []);

vi.mock("@clerk/nextjs/server", () => ({
  auth: async () => ({ userId: "user_a" }),
}));
vi.mock("next/cache", () => ({ revalidatePath: () => {} }));
vi.mock("@/src/db/db", () => {
  const chain = new Proxy(
    {},
    {
      get(_, name) {
        if (name === "then") return (resolve) => resolve([]);
        return (...args) => {
          if (name === "where") wheres.push(args[0]);
          return chain;
        };
      },
    },
  );
  return { db: { update: () => chain, delete: () => chain } };
});

const tarefas = await import("@/src/app/tarefas/actions");
const disponibilidade = await import("@/src/app/disponibilidade/actions");

const cases = {
  deleteTarefa: () => tarefas.deleteTarefa(7),
  updateTarefaStatus: () => tarefas.updateTarefaStatus(7, "CADASTRADO"),
  deleteDisponibilidade: () => disponibilidade.deleteDisponibilidade(7),
};

describe("actions that change a row by id are limited to the signed-in user", () => {
  beforeEach(() => {
    wheres.length = 0;
  });

  for (const [name, run] of Object.entries(cases)) {
    it(name, async () => {
      expect(await run()).toEqual({ ok: true });
      expect(wheres).toHaveLength(1);
      const { sql, params } = new PgDialect().sqlToQuery(wheres[0]);
      expect(sql).toContain('"user_id"');
      expect(params).toEqual(expect.arrayContaining([7, "user_a"]));
    });
  }
});
