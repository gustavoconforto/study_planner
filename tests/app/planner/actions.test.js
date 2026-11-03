import { describe, expect, it, vi } from "vitest";

// Fake db: every call starts a chain that records each method and resolves by what the chain did.
const { calls, tasks } = vi.hoisted(() => {
  const calls = [];
  const tasks = [{ id: 1 }, { id: 2 }];
  return { calls, tasks };
});

vi.mock("@clerk/nextjs/server", () => ({ auth: async () => ({ userId: "u1" }) }));
vi.mock("@/lib/openai", () => ({
  openai: {
    responses: {
      create: async () => {
        throw new Error("OpenAI down");
      },
    },
  },
}));
vi.mock("@/src/db/db", () => {
  const allDays = [0, 1, 2, 3, 4, 5, 6].map((weekday) => ({
    weekday,
    start: "00:00",
    finish: "23:59",
  }));
  let selects = 0;
  const chain = (op) => {
    const steps = [op];
    calls.push(steps);
    const result = () => {
      if (op.name === "select") return selects++ === 0 ? allDays : [];
      if (steps.some((s) => s.name === "returning")) return tasks;
      return [];
    };
    const proxy = new Proxy(
      {},
      {
        get(_, name) {
          if (name === "then")
            return (resolve, reject) =>
              Promise.resolve(result()).then(resolve, reject);
          return (...args) => {
            steps.push({ name, args });
            return proxy;
          };
        },
      },
    );
    return proxy;
  };
  return {
    db: new Proxy(
      {},
      { get: (_, name) => (...args) => chain({ name, args }) },
    ),
  };
});

const { generatePlan } = await import("@/src/app/planner/actions");

describe("generatePlan", () => {
  it("puts the claimed tasks back in the queue when the AI call fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(await generatePlan()).toEqual({ ok: false });

    const statuses = calls
      .filter((steps) => steps[0].name === "update")
      .map((steps) => steps.find((s) => s.name === "set").args[0].status);
    // First the claim, then the rollback.
    expect(statuses).toEqual(["AGENDADO", "CADASTRADO"]);
    // Nothing was saved, so nothing is deleted.
    expect(calls.some((steps) => steps[0].name === "delete")).toBe(false);
  });
});
