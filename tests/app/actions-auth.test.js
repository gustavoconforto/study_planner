import { describe, expect, it, vi } from "vitest";

// Every exported server action is a public endpoint. Signed out, each one must refuse
// before it touches the database, including actions added later (we loop over all exports).
vi.mock("@clerk/nextjs/server", () => ({
  auth: async () => ({ userId: null }),
}));
vi.mock("@/src/db/db", () => ({
  db: new Proxy(
    {},
    {
      get() {
        throw new Error("db touched without a signed-in user");
      },
    },
  ),
}));
vi.mock("@/lib/openai", () => ({ openai: {} }));
vi.mock("next/cache", () => ({ revalidatePath: () => {} }));

const modules = {
  tarefas: () => import("@/src/app/tarefas/actions"),
  disponibilidade: () => import("@/src/app/disponibilidade/actions"),
  planner: () => import("@/src/app/planner/actions"),
  agenda: () => import("@/src/app/agenda/actions"),
  chat: () => import("@/src/app/chat/actions"),
};

describe("server actions refuse callers who are not signed in", () => {
  for (const [name, load] of Object.entries(modules)) {
    it(name, async () => {
      const actions = Object.entries(await load()).filter(
        ([, value]) => typeof value === "function",
      );
      expect(actions.length).toBeGreaterThan(0);
      for (const [, action] of actions) {
        await expect(action(1, "CADASTRADO")).rejects.toThrow("Unauthorized");
      }
    });
  }
});
