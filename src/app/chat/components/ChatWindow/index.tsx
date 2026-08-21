"use client";

import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { normalizeMathDelimiters } from "@/src/app/chat/lib";

const markdownComponents = {
  p: ({ ...props }) => <p className="mb-2 last:mb-0" {...props} />,
  strong: ({ ...props }) => <strong className="font-semibold" {...props} />,
  em: ({ ...props }) => <em className="italic" {...props} />,
  ul: ({ ...props }) => (
    <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0" {...props} />
  ),
  ol: ({ ...props }) => (
    <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0" {...props} />
  ),
  li: ({ ...props }) => <li {...props} />,
  a: ({ ...props }) => (
    <a
      className="underline underline-offset-2"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  code: ({ ...props }) => (
    <code
      className="rounded bg-foreground/10 px-1 py-0.5 font-mono text-[0.85em]"
      {...props}
    />
  ),
  pre: ({ ...props }) => (
    <pre
      className="mb-2 overflow-x-auto rounded-lg bg-foreground/10 p-2 last:mb-0"
      {...props}
    />
  ),
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  function handleInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(event.target.value);
  }

  function scrollToBottom() {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  async function handleSend() {
    const content = input.trim();
    if (!content || isStreaming) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content },
    ];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsStreaming(true);
    scrollToBottom();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Falha ao consultar o assistente");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: "" },
      ]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        setMessages((current) => {
          const updated = [...current];
          const last = updated[updated.length - 1];
          updated[updated.length - 1] = {
            ...last,
            content: last.content + chunk,
          };
          return updated;
        });
        scrollToBottom();
      }
    } catch {
      setError("Não foi possível obter uma resposta. Tente novamente.");
    } finally {
      setIsStreaming(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  const isWaitingForFirstChunk =
    isStreaming && messages[messages.length - 1]?.role !== "assistant";

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto px-10 pb-8">
      <Card className="flex-1">
        <CardContent className="flex flex-col gap-3 overflow-y-auto max-h-[55vh] min-h-105">
          {messages.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Pergunte sobre suas tarefas, peça uma explicação de um tema ou
              tire dúvidas de matérias.
            </p>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                message.role === "user"
                  ? "self-end whitespace-pre-wrap bg-primary text-primary-foreground"
                  : "self-start bg-muted text-foreground",
              )}
            >
              {message.role === "assistant" ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={markdownComponents}
                >
                  {normalizeMathDelimiters(message.content)}
                </ReactMarkdown>
              ) : (
                message.content
              )}
            </div>
          ))}
          {isWaitingForFirstChunk && (
            <div className="self-start text-sm text-muted-foreground">
              Digitando...
            </div>
          )}
          <div ref={bottomRef} />
        </CardContent>
      </Card>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua dúvida..."
          disabled={isStreaming}
          className="min-h-12"
        />
        <Button onClick={handleSend} disabled={isStreaming || !input.trim()}>
          {isStreaming ? "Enviando..." : "Enviar"}
        </Button>
      </div>
    </div>
  );
}
