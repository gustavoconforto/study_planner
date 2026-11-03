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
vi.mock("@/lib/openai", () => ({
  openai: {
    responses: {
      create: async () =>
        (async function* () {
          yield { type: "response.output_text.delta", delta: "ok" };
        })(),
    },
  },
}));

const { POST } = await import("@/src/app/api/chat/route");

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
});
