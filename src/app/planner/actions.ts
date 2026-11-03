"use server";
import { db } from "@/src/db/db";
import { eq, and, or, gte, inArray, isNull, notInArray } from "drizzle-orm";
import {
  tarefaTable,
  disponibilidadeTable,
  recomendacaoTable,
  agendamentoTable,
} from "@/src/db/schema";
import { openai } from "@/lib/openai";
import { requireUserId } from "@/lib/auth";
import {
  buildAvailabilityWindows,
  pickValidSessions,
  pickRecommendations,
  type AvailabilityWindow,
  type PlannerResult,
} from "./lib";
import { localNow } from "@/utils/data";

export type PlanFailure = "sem-disponibilidade" | "sem-tarefas" | "falhou";

type Task = typeof tarefaTable.$inferSelect;
type Booked = { startTime: string; endTime: string };

export async function countTasksToPlan() {
  const user_id = await requireUserId();
  return db.$count(
    tarefaTable,
    and(
      eq(tarefaTable.user_id, user_id),
      eq(tarefaTable.status, "CADASTRADO"),
    ),
  );
}

async function aiPlanner({
  tasks,
  windows,
  booked,
}: {
  tasks: Task[];
  windows: AvailabilityWindow[];
  booked: Booked[];
}) {
  const validTaskIds = tasks.map((task) => task.id);

  const prompt = `
    Você é um orientador acadêmico especializado em estudantes do ensino médio.

    Crie um plano de estudos realista entre ${windows[0].date} e ${windows[windows.length - 1].date}.
    A disponibilidade do aluno já foi convertida em datas exatas (campo "Disponibilidade do aluno" no input, lista de { date, weekday_name, start, finish }). Utilize apenas esses intervalos exatos — não infira dias da semana a partir de outro campo nem agende fora dessas datas/horários.
    O aluno já possui sessões agendadas anteriormente (campo "Horários já ocupados" no input, lista de { startTime, endTime }). Esses intervalos NÃO estão disponíveis — nenhuma sessão nova pode se sobrepor, total ou parcialmente, a nenhum desses intervalos.
    Regras:
    - Priorize tarefas com prazos mais próximos.
    - Dedique mais tempo para tarefas classificadas como difíceis.
    - Não agende sessões fora dos horários disponíveis do aluno.
    - Não agende nenhuma sessão que se sobreponha a um intervalo listado em "Horários já ocupados".
    - Divida tarefas longas em sessões menores.
    - Evite sessões superiores a 60 minutos.
    - Evite escolher Sábado e Domingo a não ser que não haja outra opção
    - Caso a matéria (subject) esteja ente as opções: Matemática, Física, Química, coloque no início da tarde.
    - Caso a matéria seja redação e você consiga identificar algum tema, passe, nas dicas (study_tips) alguns links de matéria de páginas que julgar interessante. Tente no mínimo duas referências
    - Considere revisões quando houver tempo disponível.
    - Antes de definir cada sessão, verifique o campo "Horários já ocupados" e não sobreponha as tarefas a nenhum desses intervalos.
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
    ${JSON.stringify(
      // Only what the planner needs: no email or account id goes to OpenAI.
      tasks.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        theme: t.theme,
        subject: t.subject,
        type: t.type,
        dificulty: t.dificulty,
        estimated_minutes: t.estimated_minutes,
        due_date: t.due_date,
      })),
    )}

    Disponibilidade do aluno (datas exatas dentro da janela de planejamento, já calculadas a partir da disponibilidade recorrente do aluno):
    ${JSON.stringify(windows)}

    Horários já ocupados (sessões já agendadas anteriormente; nenhuma nova sessão pode se sobrepor a estes intervalos):
    ${JSON.stringify(booked)}`;

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

  return JSON.parse(response.output_text) as PlannerResult;
}

export async function generatePlan(): Promise<
  { ok: true; data: PlannerResult } | { ok: false; reason: PlanFailure }
> {
  const user_id = await requireUserId();

  const availabilities = await db
    .select()
    .from(disponibilidadeTable)
    .where(eq(disponibilidadeTable.user_id, user_id));
  const windows = buildAvailabilityWindows(availabilities, new Date());
  if (windows.length === 0) return { ok: false, reason: "sem-disponibilidade" };

  // Claim the tasks in one statement, so a second tab or a double click can't plan them twice.
  const tasks = await db
    .update(tarefaTable)
    .set({ status: "AGENDADO" })
    .where(
      and(
        eq(tarefaTable.user_id, user_id),
        eq(tarefaTable.status, "CADASTRADO"),
      ),
    )
    .returning();
  if (tasks.length === 0) return { ok: false, reason: "sem-tarefas" };

  let savedRecommendationIds: number[] = [];
  try {
    const booked = await db
      .select({
        startTime: agendamentoTable.start_time,
        endTime: agendamentoTable.end_time,
      })
      .from(agendamentoTable)
      .leftJoin(
        recomendacaoTable,
        eq(agendamentoTable.recomentation_id, recomendacaoTable.id),
      )
      .where(
        and(
          eq(agendamentoTable.user_id, user_id),
          gte(agendamentoTable.end_time, `${windows[0].date} 00:00:00`),
          // Sessions of the tasks being planned again are replaced below, so they don't block slots.
          // isNull: rows from before task_id existed (NOT IN against NULL would drop them).
          or(
            isNull(recomendacaoTable.task_id),
            notInArray(
              recomendacaoTable.task_id,
              tasks.map((t) => t.id),
            ),
          ),
        ),
      );

    const plan = await aiPlanner({ tasks, windows, booked });

    const today = localNow().date;
    const sessions = pickValidSessions(
      plan.sessions,
      windows,
      booked,
      // Overdue tasks get no limit: studying late beats never being planned.
      new Map(
        tasks.filter((t) => t.due_date >= today).map((t) => [t.id, t.due_date]),
      ),
    );
    const recommendations = pickRecommendations(
      plan.summary.study_recommendations,
      sessions,
    );
    if (recommendations.length === 0) throw new Error("No valid sessions");

    const saved = await db
      .insert(recomendacaoTable)
      .values(recommendations)
      .returning({
        id: recomendacaoTable.id,
        task_id: recomendacaoTable.task_id,
      });
    savedRecommendationIds = saved.map((r) => r.id);
    const recommendationIdByTask = new Map(saved.map((r) => [r.task_id, r.id]));
    const plannedSessions = sessions.filter((s) =>
      recommendationIdByTask.has(s.task_id),
    );

    await db.insert(agendamentoTable).values(
      plannedSessions.map((s) => ({
        user_id,
        recomentation_id: recommendationIdByTask.get(s.task_id),
        start_time: s.start_time,
        end_time: s.end_time,
        reason: s.reason,
      })),
    );

    // Tasks the AI could not fit go back to the queue for the next run.
    const unplanned = tasks
      .map((t) => t.id)
      .filter((id) => !recommendationIdByTask.has(id));
    if (unplanned.length > 0) {
      await db
        .update(tarefaTable)
        .set({ status: "CADASTRADO" })
        .where(inArray(tarefaTable.id, unplanned));
    }

    // Last write on purpose: if anything above fails, the catch removes the new plan and the old one survives.
    // A task planned again replaces its old plan (old sessions go with it via cascade).
    await db
      .delete(recomendacaoTable)
      .where(
        and(
          inArray(
            recomendacaoTable.task_id,
            recommendations.map((r) => r.task_id),
          ),
          notInArray(recomendacaoTable.id, savedRecommendationIds),
        ),
      );

    return {
      ok: true,
      data: {
        summary: { ...plan.summary, study_recommendations: recommendations },
        sessions: plannedSessions,
      },
    };
  } catch (error) {
    console.error(error);
    // No transactions over neon-http: undo by hand (sessions go with their recommendation via cascade).
    if (savedRecommendationIds.length > 0) {
      await db
        .delete(recomendacaoTable)
        .where(inArray(recomendacaoTable.id, savedRecommendationIds));
    }
    await db
      .update(tarefaTable)
      .set({ status: "CADASTRADO" })
      .where(
        inArray(
          tarefaTable.id,
          tasks.map((t) => t.id),
        ),
      );
    return { ok: false, reason: "falhou" };
  }
}
