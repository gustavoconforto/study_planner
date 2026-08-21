import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { openai } from "@/lib/openai";
import { getTasksForChatContext } from "@/src/app/chat/actions";
import { buildChatInstructions } from "@/src/app/chat/lib";

const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1),
      }),
    )
    .min(1),
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

  const tasks = await getTasksForChatContext();
  const instructions = buildChatInstructions(tasks);

  const stream = await openai.responses.create({
    model: "gpt-5.6-terra",
    instructions,
    input: parsed.data.messages,
    stream: true,
  });

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
