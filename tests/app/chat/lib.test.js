import { expect, it, describe } from "vitest";
import {
  buildChatInstructions,
  fitHistory,
  normalizeMathDelimiters,
} from "@/src/app/chat/lib";

describe("chat/lib.test.js", () => {
  describe("buildChatInstructions", () => {
    it("Should mention there are no registered tasks when the list is empty", () => {
      const instructions = buildChatInstructions([]);
      expect(instructions).toContain(
        "O aluno ainda não tem nenhuma tarefa cadastrada no planner.",
      );
    });

    it("Should include each task's summary when tasks are provided", () => {
      const instructions = buildChatInstructions([
        {
          subject: "FÍSICA",
          title: "Plano Inclinado",
          theme: "Leis de Newton",
          dificulty: "DIFÍCIL",
          due_date: "2026-08-28",
          description: "Resolver a lista de exercícios do capítulo 4.",
        },
      ]);

      expect(instructions).toContain("[FÍSICA]");
      expect(instructions).toContain("Plano Inclinado");
      expect(instructions).toContain("Leis de Newton");
      expect(instructions).toContain("DIFÍCIL");
      expect(instructions).toContain("2026-08-28");
      expect(instructions).toContain(
        "Resolver a lista de exercícios do capítulo 4.",
      );
    });
  });

  describe("normalizeMathDelimiters", () => {
    it("Should convert \\[...\\] into $$...$$ block math", () => {
      const result = normalizeMathDelimiters("Veja: \\[ x^2-5x+6 \\] fim.");
      expect(result).toContain("$$\nx^2-5x+6\n$$");
    });

    it("Should convert \\(...\\) into $...$ inline math", () => {
      const result = normalizeMathDelimiters("O valor de \\( x \\) é 2.");
      expect(result).toBe("O valor de $x$ é 2.");
    });

    it("Should leave text without LaTeX delimiters untouched", () => {
      const result = normalizeMathDelimiters("Nenhuma fórmula aqui.");
      expect(result).toBe("Nenhuma fórmula aqui.");
    });
  });

  describe("fitHistory", () => {
    const user = (content) => ({ role: "user", content });
    const answer = (content) => ({ role: "assistant", content });

    it("drops empty answers and keeps the last 20 messages", () => {
      const messages = Array.from({ length: 25 }, (_, i) => user(`m${i}`));
      messages.splice(24, 0, answer(""));
      const result = fitHistory(messages);
      expect(result).toHaveLength(20);
      expect(result[0].content).toBe("m5");
      expect(result.every((m) => m.content)).toBe(true);
    });

    it("drops the oldest messages until the history fits 60000 characters", () => {
      const long = answer("x".repeat(25000));
      const result = fitHistory([
        user("a"),
        long,
        user("b"),
        long,
        user("c"),
        long,
        user("d"),
      ]);
      expect(result.map((m) => m.content.length)).toEqual([
        1, 25000, 1, 25000, 1,
      ]);
    });
  });
});
