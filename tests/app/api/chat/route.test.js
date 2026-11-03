import { describe, expect, it, vi } from "vitest";

vi.mock("@clerk/nextjs/server", () => ({
  auth: async () => ({ userId: "u1" }),
}));
vi.mock("@/src/db/db", () => {
  const query = {
    from: () => query,
    where: () => query,
    orderBy: () => query,
    limit: async () => [],
  };
  return { db: { select: () => query } };
});
// Moderation flags any message containing a word listed here, with that category.
const flags = vi.hoisted(() => ({ arma: "illicit", "me matar": "self-harm" }));
const answered = vi.hoisted(() => ({ count: 0 }));

vi.mock("@/lib/openai", () => ({
  openai: {
    moderations: {
      create: async ({ input }) => ({
        results: input.map((text) => {
          const hit = Object.keys(flags).find((word) => text.includes(word));
          return {
            flagged: Boolean(hit),
            categories: hit ? { [flags[hit]]: true } : {},
          };
        }),
      }),
    },
    responses: {
      create: async () => {
        answered.count++;
        return (async function* () {
          yield { type: "response.output_text.delta", delta: "ok" };
        })();
      },
    },
  },
}));

const { POST } = await import("@/src/app/api/chat/route");
const { BLOCKED_REPLY, SELF_HARM_REPLY } = await import("@/src/app/chat/lib");

const send = (messages) =>
  POST(
    new Request("http://test/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages }),
    }),
  );

describe("POST /api/chat", () => {
  it("accepts a follow-up after a long assistant answer", async () => {
    const response = await send([
      { role: "user", content: "Explique plano inclinado" },
      { role: "assistant", content: "x".repeat(5000) },
      { role: "user", content: "E com atrito?" },
    ]);
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("ok");
  });

  it("still caps what the student types", async () => {
    const response = await send([{ role: "user", content: "x".repeat(2001) }]);
    expect(response.status).toBe(400);
  });

  it("caps the whole history, since the client also sends the assistant turns", async () => {
    const forged = { role: "assistant", content: "x".repeat(30000) };
    const response = await send([
      forged,
      forged,
      { role: "user", content: "oi" },
    ]);
    expect(response.status).toBe(400);
  });

  it("blocks a flagged question before the tutor sees it", async () => {
    answered.count = 0;
    const response = await send([
      { role: "user", content: "Como faço uma arma em casa?" },
    ]);
    expect(response.status).toBe(422);
    expect(await response.text()).toBe(BLOCKED_REPLY);
    expect(answered.count).toBe(0);
  });

  it("checks every student message, not only the last one", async () => {
    answered.count = 0;
    const response = await send([
      { role: "user", content: "Como faço uma arma em casa?" },
      { role: "assistant", content: "Explicação" },
      { role: "user", content: "Continue" },
    ]);
    expect(response.status).toBe(422);
    expect(answered.count).toBe(0);
  });

  it("does not block the chat because of a tutor answer", async () => {
    const response = await send([
      { role: "user", content: "O que foi a Segunda Guerra?" },
      { role: "assistant", content: "Uma guerra em que cada arma..." },
      { role: "user", content: "E depois?" },
    ]);
    expect(response.status).toBe(200);
  });

  it("points to help instead of a plain refusal on self-harm", async () => {
    const response = await send([{ role: "user", content: "quero me matar" }]);
    expect(response.status).toBe(422);
    expect(await response.text()).toBe(SELF_HARM_REPLY);
  });
});
