import { beforeEach, describe, expect, it, vi } from "vitest";
import { PgDialect } from "drizzle-orm/pg-core";

// Fake db: every call starts a chain that records each method and resolves by what the chain did.
const state = vi.hoisted(() => ({
  calls: [],
  tasks: [{ id: 1 }, { id: 2 }],
  selects: 0,
  aiResult: null, // null: the AI call fails
}));
const { calls, tasks } = state;

vi.mock("@clerk/nextjs/server", () => ({
  auth: async () => ({ userId: "u1" }),
}));
vi.mock("@/lib/openai", () => ({
  openai: {
    responses: {
      create: async () => {
        if (!state.aiResult) throw new Error("OpenAI down");
        return { output_text: JSON.stringify(state.aiResult) };
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
  const chain = (op) => {
    const steps = [op];
    calls.push(steps);
    const result = () => {
      if (op.name === "select") return state.selects++ === 0 ? allDays : [];
      if (!steps.some((s) => s.name === "returning")) return [];
      // insert ... returning: the saved recommendation of task 1.
      return op.name === "insert" ? [{ id: 100, task_id: 1 }] : tasks;
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
      {
        get:
          (_, name) =>
          (...args) =>
            chain({ name, args }),
      },
    ),
  };
});

const { generatePlan } = await import("@/src/app/planner/actions");
const { localNow } = await import("@/utils/data");

// The SQL and params a recorded `.where(...)` would send.
const whereOf = (steps) =>
  new PgDialect().sqlToQuery(steps.find((s) => s.name === "where").args[0]);

describe("generatePlan", () => {
  beforeEach(() => {
    calls.length = 0;
    state.selects = 0;
    state.aiResult = null;
  });

  it("puts the claimed tasks back in the queue when the AI call fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(await generatePlan()).toEqual({ ok: false, reason: "falhou" });

    const statuses = calls
      .filter((steps) => steps[0].name === "update")
      .map((steps) => steps.find((s) => s.name === "set").args[0].status);
    // First the claim, then the rollback.
    expect(statuses).toEqual(["AGENDADO", "CADASTRADO"]);
    // Nothing was saved, so nothing is deleted.
    expect(calls.some((steps) => steps[0].name === "delete")).toBe(false);
  });

  it("replaces only the re-planned task's old plan and requeues the task the AI left out", async () => {
    const tomorrow = localNow(new Date(Date.now() + 24 * 60 * 60 * 1000)).date;
    const recommendation = {
      title: "t",
      overview: "o",
      prerequisites: [],
      topics_to_study: [],
      common_mistakes: [],
      study_tips: [],
    };
    // Task 1 gets a session; task 2 only a recommendation, so it is not planned.
    state.aiResult = {
      summary: {
        general_analysis: "",
        study_recommendations: [
          { task_id: 1, ...recommendation },
          { task_id: 2, ...recommendation },
        ],
      },
      sessions: [
        {
          task_id: 1,
          title: "t",
          start_time: `${tomorrow}T10:00:00`,
          end_time: `${tomorrow}T11:00:00`,
          reason: "r",
        },
      ],
    };

    const result = await generatePlan();
    expect(result.ok).toBe(true);

    const requeue = calls.filter(
      (steps) =>
        steps[0].name === "update" &&
        steps.find((s) => s.name === "set").args[0].status === "CADASTRADO",
    );
    expect(requeue.map((steps) => whereOf(steps).params)).toEqual([[2]]);

    const deletes = calls.filter((steps) => steps[0].name === "delete");
    expect(deletes).toHaveLength(1);
    const { sql, params } = whereOf(deletes[0]);
    // Old recommendations of task 1, but never the one just saved (id 100).
    expect(sql).toBe(
      '(("recommendations"."task_id" in ($1)) and ("recommendations"."id" not in ($2)))',
    );
    expect(params).toEqual([1, 100]);
  });
});
