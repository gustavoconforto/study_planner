"use server";
import { db } from "@/src/db/db";
import { eq, and } from "drizzle-orm";
import { tarefaTable, disponibilidadeTable } from "@/src/db/schema";
import { openai } from "@/lib/openai";

export async function getTasksFromUser({ userEmail }: { userEmail: string }) {
  try {
    const result = await db
      .select()
      .from(tarefaTable)
      .where(
        and(
          eq(tarefaTable.student_email, userEmail),
          eq(tarefaTable.status, "CADASTRADO"),
        ),
      );
    return {
      ok: true as const,
      data: result,
    };
  } catch {
    return {
      ok: false as const,
    };
  }
}

export async function getAvailabilityFromUser({
  userEmail,
}: {
  userEmail: string;
}) {
  try {
    const result = await db
      .select()
      .from(disponibilidadeTable)
      .where(eq(disponibilidadeTable.email, userEmail));
    return {
      ok: true as const,
      data: result,
    };
  } catch {
    return {
      ok: false as const,
    };
  }
}

export async function aiPlanner({
  tasksData,
  availabilitiesData,
}: {
  tasksData: {
    student_email: string;
    title: string;
    description: string;
    estimated_minutes: number;
    due_date: string;
    created_at: Date;
    updated_at: Date | null;
    completed_at: Date | null;
  }[];
  availabilitiesData: {
    id: number;
    email: string;
    weekday: number;
    start: string;
    finish: string;
  }[];
}) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const startDate = new Date().toISOString().slice(0, 10);
  const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const prompt = `
    Você é um orientador acadêmico especializado em estudantes do ensino médio.

    Crie um plano de estudos realista entre ${startDate} e ${endDate}.

    Regras:
    - Priorize tarefas com prazos mais próximos.
    - Dedique mais tempo para tarefas classificadas como difíceis.
    - Não agende sessões fora dos horários disponíveis do aluno.
    - Divida tarefas longas em sessões menores.
    - Evite sessões superiores a 60 minutos.
    - Evite escolher Sábado e Domingo a não ser que não haja outra opção
    - Caso a matéria (subject) esteja ente as opções: Matemática, Física, Química, coloque no início da tarde.
    - Caso a matéria seja redação e você consiga identificar algum tema, passe, nas dicas (study_tips) alguns links de matéria de páginas que julgar interessante. Tente no mínimo duas referências
    - Considere revisões quando houver tempo disponível.
    - Procure marcar os horários em horários disponíveis. Procure os horários já ocopados para nao sobrepor as tarefas.
    - Retorne apenas JSON válido.
    - Para cada tarefa, analise o tema informado e forneça orientações de estudo.


    Retorne exatamente neste formato:

    {
    "summary": {
        "general_analysis": "Análise geral da carga de estudos e distribuição das tarefas.",
        "study_recommendations": [
        {
            "task_id": 1,
            "title": "Plano Inclinado",
            "overview": "Resumo do tema e dos objetivos de aprendizagem.",
            "prerequisites": [
            "Leis de Newton",
            "Vetores",
            "Decomposição de forças"
            ],
            "topics_to_study": [
            "Força peso",
            "Força normal",
            "Atrito",
            "Componentes do peso",
            "Equilíbrio em planos inclinados"
            ],
            "common_mistakes": [
            "Confundir peso com força normal",
            "Errar a decomposição vetorial"
            ],
            "study_tips": [
            "Resolver exercícios progressivos",
            "Desenhar diagramas de forças"
            ]
        }
        ]
    },
    "sessions": [
        {
        "task_id": 1,
        "title": "Plano Inclinado",
        "start_time": "YYYY-MM-DDTHH:MM:SS",
        "end_time": "YYYY-MM-DDTHH:MM:SS",
        "reason": "Esta sessão foi agendada devido à proximidade do prazo e à alta dificuldade do conteúdo."
        }
    ]
    }`;

  const input = `
    Retorne a resposta em formato JSON.

    Tarefas:
    ${JSON.stringify(tasksData)}

    Disponibilidade do aluno:
    ${JSON.stringify(availabilitiesData)}`;

  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    instructions: prompt,
    input: input,
    text: {
      format: { type: "json_object" },
    },
  });

  return JSON.parse(response.output_text);
}

export async function generatePlan({ userEmail }: { userEmail: string }) {
  const tasksResult = await getTasksFromUser({ userEmail });
  const availabilitiesResult = await getAvailabilityFromUser({ userEmail });

  if (!tasksResult.ok || !availabilitiesResult.ok) {
    return { ok: false as const };
  }

  try {
    const data = await aiPlanner({
      tasksData: tasksResult.data,
      availabilitiesData: availabilitiesResult.data,
    });
    return { ok: true as const, data };
  } catch (error) {
    console.log(error);
    return { ok: false as const };
  }
}
