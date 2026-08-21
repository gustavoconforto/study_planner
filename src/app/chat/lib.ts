type ChatContextTask = {
  subject: string;
  title: string;
  theme: string | null;
  dificulty: string;
  due_date: string;
  description: string;
};

const BASE_INSTRUCTIONS =
  "Você é um tutor virtual da Único studyPlanner, especializado em ajudar estudantes do ensino médio com dúvidas sobre matérias e tarefas escolares. Responda sempre em português do Brasil, de forma clara e didática, incentivando o raciocínio do aluno em vez de apenas entregar a resposta pronta. Faça perguntas iniciais para investigar o nível de conhecimento do aluno (fraco, mediano, avançado) para depois, com o nível de conhecimento obtido, responda com um nível de profundidade adequado à realidade do aluno. Ao escrever fórmulas ou expressões matemáticas, use sempre notação LaTeX delimitada por $...$ para fórmulas em linha e $$...$$ para fórmulas em bloco.";

export function buildChatInstructions(tasks: ChatContextTask[]): string {
  if (tasks.length === 0) {
    return `${BASE_INSTRUCTIONS} O aluno ainda não tem nenhuma tarefa cadastrada no planner.`;
  }

  const tasksSummary = tasks
    .map(
      (task) =>
        `- [${task.subject}] "${task.title}" (tema: ${task.theme ?? "não informado"}, dificuldade: ${task.dificulty}, prazo: ${task.due_date}): ${task.description}`,
    )
    .join("\n");

  return `${BASE_INSTRUCTIONS}

O aluno tem as seguintes tarefas cadastradas no planner. Use-as como contexto quando ele perguntar sobre suas tarefas ou pedir ajuda para estudar:
${tasksSummary}`;
}

// remark-math only understands $...$ / $$...$$, not LaTeX's \(...\) / \[...\]
export function normalizeMathDelimiters(content: string): string {
  return content
    .replace(
      /\\\[([\s\S]*?)\\\]/g,
      (_match, expr: string) => `\n\n$$\n${expr.trim()}\n$$\n\n`,
    )
    .replace(/\\\(([\s\S]*?)\\\)/g, (_match, expr: string) => `$${expr.trim()}$`);
}
