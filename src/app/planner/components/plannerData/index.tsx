import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type StudyRecommendation = {
  task_id: number;
  title: string;
  overview: string;
  prerequisites: string[];
  topics_to_study: string[];
  common_mistakes: string[];
  study_tips: string[];
};

type Session = {
  task_id: number;
  title: string;
  start_time: string;
  end_time: string;
  reason: string;
};

export type PlannerResult = {
  summary: {
    general_analysis: string;
    study_recommendations: StudyRecommendation[];
  };
  sessions: Session[];
};

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

function TaskList({ title, items }: { title: string; items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <span className="text-muted-foreground font-semibold">{title}</span>
      <ul className="list-disc pl-5">
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
  error: boolean;
}) {
  if (loading) return <div>Gerando plano de estudos...</div>;
  if (error) return <div>Não foi possível gerar o plano de estudos.</div>;
  if (!result)
    return (
      <div>Clique em &quot;Criar&quot; para gerar seu plano de estudos.</div>
    );

  const recommendationsByTask = new Map<number, StudyRecommendation>();
  result.summary?.study_recommendations?.forEach((recommendation) => {
    recommendationsByTask.set(recommendation.task_id, recommendation);
  });
  console.log(result);
  const sessionsByTask = new Map<number, Session[]>();
  result.sessions?.forEach((session) => {
    const sessions = sessionsByTask.get(session.task_id) ?? [];
    sessions.push(session);
    sessionsByTask.set(session.task_id, sessions);
  });

  const taskIds = Array.from(
    new Set([...recommendationsByTask.keys(), ...sessionsByTask.keys()]),
  );

  return (
    <div className="flex flex-col gap-4 w-full">
      {result.summary?.general_analysis && (
        <Card className="w-125">
          <CardHeader>
            <CardTitle>Análise geral</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {result.summary.general_analysis}
            </p>
          </CardContent>
        </Card>
      )}

      {taskIds.map((taskId) => {
        const recommendation = recommendationsByTask.get(taskId);
        const sessions = sessionsByTask.get(taskId) ?? [];

        return (
          <Card key={taskId} className="flex-col gap-4 w-300">
            <CardHeader>
              <CardTitle>
                {recommendation?.title ?? sessions[0]?.title}
              </CardTitle>
              {recommendation?.overview && (
                <CardDescription>{recommendation.overview}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {recommendation && (
                <>
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
                </>
              )}

              {sessions.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-muted-foreground font-semibold">
                    Sessões agendadas
                  </span>
                  {sessions.map((session, index) => (
                    <div
                      key={index}
                      className="flex flex-col rounded-lg ring-1 ring-foreground/10 p-3 gap-1"
                    >
                      <div className="flex justify-items-start">
                        <span>{formatDate(session.start_time)}:&nbsp;</span>
                        <span>De: {formatTime(session.start_time)}</span>
                        <span> &nbsp;às {formatTime(session.end_time)}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {session.reason}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
