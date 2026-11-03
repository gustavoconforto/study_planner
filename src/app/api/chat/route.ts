import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { and, eq, gte } from "drizzle-orm";
import { openai } from "@/lib/openai";
import { db } from "@/src/db/db";
import { tarefaTable } from "@/src/db/schema";
import { localNow } from "@/utils/data";
import {
  buildChatInstructions,
  MAX_ASSISTANT_CHARS,
  MAX_HISTORY_CHARS,
  MAX_MESSAGES,
  MAX_USER_CHARS,
  BLOCKED_REPLY,
  SELF_HARM_REPLY,
} from "@/src/app/chat/lib";

// Caps what one request can cost on OpenAI. Assistant turns are our own earlier answers
// (up to 8000 output tokens), so they get a larger limit than what the student types.
// shortcut: no per-user request rate limit; add one (stored in the DB) if abuse shows up.
const chatRequestSchema = z.object({
  messages: z
    .array(
      z.discriminatedUnion("role", [
        z.object({
          role: z.literal("user"),
          content: z.string().min(1).max(MAX_USER_CHARS),
        }),
        z.object({
          role: z.literal("assistant"),
          content: z.string().min(1).max(MAX_ASSISTANT_CHARS),
        }),
      ]),
    )
    .min(1)
    .max(MAX_MESSAGES)
    // Assistant turns come from the client too, so cap the whole history, not just each message.
    .refine(
      (messages) =>
        messages.reduce((total, m) => total + m.content.length, 0) <=
        MAX_HISTORY_CHARS,
    ),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const parsed = chatRequestSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return new Response("Bad Request", { status: 400 });
  }

  // Students are minors: OpenAI's moderation (free) checks what the student wrote before the tutor answers.
  // Every student turn, since the client sends the history; not the tutor's answers, or one flagged
  // history/biology answer would block the rest of the conversation.
  const moderation = await openai.moderations.create({
    model: "omni-moderation-latest",
    input: parsed.data.messages
      .filter((m) => m.role === "user")
      .map((m) => m.content),
  });
  const flagged = moderation.results.filter((r) => r.flagged);
  if (flagged.length > 0) {
    const selfHarm = flagged.some(
      (r) =>
        r.categories["self-harm"] ||
        r.categories["self-harm/intent"] ||
        r.categories["self-harm/instructions"],
    );
    // 422 keeps the message out of the history, so the next question isn't blocked by it.
    return new Response(selfHarm ? SELF_HARM_REPLY : BLOCKED_REPLY, {
      status: 422,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const tasks = await db
    .select({
      subject: tarefaTable.subject,
      title: tarefaTable.title,
      theme: tarefaTable.theme,
      dificulty: tarefaTable.dificulty,
      due_date: tarefaTable.due_date,
      description: tarefaTable.description,
    })
    .from(tarefaTable)
    .where(
      and(
        eq(tarefaTable.user_id, userId),
        gte(tarefaTable.due_date, localNow().date),
      ),
    )
    // Sent with every message, so only the nearest deadlines.
    .orderBy(tarefaTable.due_date)
    .limit(15);
  const instructions = buildChatInstructions(tasks);

  const stream = await openai.responses.create(
    {
      model: "gpt-5.6-terra",
      instructions,
      input: parsed.data.messages,
      // Includes reasoning tokens, so keep room for a full answer.
      max_output_tokens: 8000,
      stream: true,
    },
    // Student closed the tab: stop generating (and paying for) the answer.
    { signal: request.signal },
  );

  const encoder = new TextEncoder();
  const responseBody = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "response.output_text.delta") {
            controller.enqueue(encoder.encode(event.delta));
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(responseBody, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
