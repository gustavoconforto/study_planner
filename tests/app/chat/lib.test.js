import { expect, it, describe } from "vitest";
import { buildChatInstructions, normalizeMathDelimiters } from "@/src/app/chat/lib";

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
});
