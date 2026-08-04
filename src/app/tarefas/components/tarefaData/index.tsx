import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { readTarefas } from "../../actions";
import { DeleteTarefaButton } from "./DeleteTarefaButton";

function formatDueDate(due_date: string) {
  const [year, month, day] = due_date.split("-");
  return `${day}/${month}/${year}`;
}

export default async function TarefaData({ userEmail }: { userEmail: string }) {
  const tarefas = await readTarefas({ userEmail });
  return (
    <div className="flex flex-col gap-4">
      {tarefas.ok &&
        tarefas.data!.map((tarefa) => {
          return (
            <Card key={tarefa.id} className="flex-col gap-4 w-[500px]">
              <CardHeader>
                <CardTitle>{tarefa.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div className="flex justify-items-start">
                    <span className="text-muted-foreground font-semibold">
                      Matéria:&nbsp;
                    </span>
                    <span>{tarefa.subject}</span>
                  </div>
                  <DeleteTarefaButton id={tarefa.id} />
                </div>
                <div className="flex gap-2  justify-between">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-semibold">
                      Tipo:&nbsp;
                    </span>
                    <span>{tarefa.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-semibold">
                      Dificuldade:&nbsp;
                    </span>
                    <span>{tarefa.dificulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-semibold">
                      Estimativa:&nbsp;
                    </span>
                    <span>{tarefa.estimated_minutes} min</span>
                  </div>
                </div>
                <div className="flex gap-2  justify-between">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-semibold">
                      Data Limite:&nbsp;
                    </span>
                    <span>{formatDueDate(tarefa.due_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-semibold">
                      Status:&nbsp;
                    </span>
                    <span>{tarefa.status}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
}
