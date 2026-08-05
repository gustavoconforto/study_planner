"use server";
import { db } from "@/src/db/db";
import { eq, and } from "drizzle-orm";
import { tarefaTable, disponibilidadeTable } from "@/src/db/schema";
import { openai } from "@/lib/openai";

type TasksType = typeof tarefaTable.$inferSelect;

export async function changeTaskStatus({
  tasksData,
}: {
  tasksData: TasksType[];
}) {
  for (let i = 0; i < tasksData.length; i++) {
    if (tasksData[i].status === "CADASTRADO") {
      await db
        .update(tarefaTable)
        .set({ status: "AGENDADO" })
        .where(eq(tarefaTable.id, tasksData[i].id));
    } else {
      await db
        .update(tarefaTable)
        .set({ status: "CADASTRADO" })
        .where(eq(tarefaTable.id, tasksData[i].id));
    }
  }
}

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
    id: number;
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

  if (tasksData.length === 0) {
    return {
      summary: { general_analysis: "", study_recommendations: [] },
      sessions: [],
    };
  }

  const validTaskIds = tasksData.map((task) => task.id);

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
    - Cada tarefa enviada em "Tarefas" tem um campo "id" único. O "task_id" retornado DEVE ser exatamente igual a esse campo "id" — nunca invente, recalcule ou renumere um task_id.
    - IDs de tarefa válidos para esta chamada: ${JSON.stringify(validTaskIds)}.
    - "study_recommendations" deve conter exatamente um item para cada id em ${JSON.stringify(validTaskIds)} (nenhum a mais, nenhum a menos, sem ids repetidos).
    - Toda sessão em "sessions" deve usar o mesmo task_id da tarefa correspondente — se uma tarefa gerar várias sessões, todas elas repetem o mesmo task_id.


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

  const recommendationSchema = {
    type: "object",
    properties: {
      task_id: { type: "integer", enum: validTaskIds },
      title: { type: "string" },
      overview: { type: "string" },
      prerequisites: { type: "array", items: { type: "string" } },
      topics_to_study: { type: "array", items: { type: "string" } },
      common_mistakes: { type: "array", items: { type: "string" } },
      study_tips: { type: "array", items: { type: "string" } },
    },
    required: [
      "task_id",
      "title",
      "overview",
      "prerequisites",
      "topics_to_study",
      "common_mistakes",
      "study_tips",
    ],
    additionalProperties: false,
  };

  const sessionSchema = {
    type: "object",
    properties: {
      task_id: { type: "integer", enum: validTaskIds },
      title: { type: "string" },
      start_time: { type: "string" },
      end_time: { type: "string" },
      reason: { type: "string" },
    },
    required: ["task_id", "title", "start_time", "end_time", "reason"],
    additionalProperties: false,
  };

  const response = await openai.responses.create({
    model: "gpt-5.6-terra",
    instructions: prompt,
    input: input,
    text: {
      format: {
        type: "json_schema",
        name: "study_plan",
        strict: true,
        schema: {
          type: "object",
          properties: {
            summary: {
              type: "object",
              properties: {
                general_analysis: { type: "string" },
                study_recommendations: {
                  type: "array",
                  items: recommendationSchema,
                },
              },
              required: ["general_analysis", "study_recommendations"],
              additionalProperties: false,
            },
            sessions: {
              type: "array",
              items: sessionSchema,
            },
          },
          required: ["summary", "sessions"],
          additionalProperties: false,
        },
      },
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
  await changeTaskStatus({ tasksData: tasksResult.data });

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
