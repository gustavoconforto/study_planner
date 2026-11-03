import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { PlannerResult } from "../../lib";

function formatDate(value: string) {
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}
function formatTime(value: string) {
  return new Date(value).toLocaleString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function TaskList({ title, items }: { title: string; items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="flex flex-col gap-1.5">
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-pretty marker:text-muted-foreground">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function PlannerData({
  result,
  loading,
  error,
}: {
  result: PlannerResult | null;
  loading: boolean;
  error: string | null;
}) {
  if (loading)
    return (
      <p role="status" className="text-sm text-muted-foreground">
        Gerando o plano de estudos. Isso pode levar alguns minutos.
      </p>
    );
  if (error)
    return (
      <p
        role="alert"
        className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
      >
        {error}
      </p>
    );
  if (!result) return null;

  return (
    <div className="flex flex-col gap-6">
      {result.summary.general_analysis && (
        <section className="flex max-w-prose flex-col gap-2">
          <h2 className="text-lg font-semibold tracking-tight">Análise geral</h2>
          <p className="text-pretty text-muted-foreground">
            {result.summary.general_analysis}
          </p>
        </section>
      )}

      {/* generatePlan only returns tasks with one recommendation and at least one session. */}
      <div className="flex flex-col gap-4">
        {result.summary.study_recommendations.map((recommendation) => (
          <Card key={recommendation.task_id}>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {recommendation.title}
              </CardTitle>
              {recommendation.overview && (
                <CardDescription className="max-w-prose text-pretty">
                  {recommendation.overview}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
              <div className="grid gap-5 sm:grid-cols-2">
                <TaskList
                  title="Pré-requisitos"
                  items={recommendation.prerequisites}
                />
                <TaskList
                  title="Tópicos para estudar"
                  items={recommendation.topics_to_study}
                />
                <TaskList
                  title="Erros comuns"
                  items={recommendation.common_mistakes}
                />
                <TaskList
                  title="Dicas de estudo"
                  items={recommendation.study_tips}
                />
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold">Sessões agendadas</h3>
                <ul className="flex flex-col gap-2">
                  {result.sessions
                    .filter((session) => session.task_id === recommendation.task_id)
                    .map((session, index) => (
                      <li
                        key={index}
                        className="flex flex-col gap-1 rounded-md bg-muted p-3 text-sm"
                      >
                        <span className="font-medium tabular-nums">
                          {formatDate(session.start_time)}, {formatTime(session.start_time)} –{" "}
                          {formatTime(session.end_time)}
                        </span>
                        <span className="text-muted-foreground">{session.reason}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
