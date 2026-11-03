import { RiTaskLine } from "@remixicon/react";
import { Separator } from "@/components/ui/separator";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { DeleteButton } from "@/components/delete-button";
import { displayLabel } from "@/utils/data";
import { deleteTarefa, readTarefas } from "../../actions";
import TaskStatus from "../tarefaStatus";

function formatDueDate(due_date: string) {
  const [year, month, day] = due_date.split("-");
  return `${day}/${month}/${year}`;
}

export default async function TarefaData() {
  const tarefas = await readTarefas();

  if (tarefas.length === 0) {
    return (
      <Empty className="border bg-card">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <RiTaskLine />
          </EmptyMedia>
          <EmptyTitle>Nenhuma tarefa ainda</EmptyTitle>
          <EmptyDescription>
            Cadastre deveres, provas e leituras no formulário ao lado.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ul className="flex flex-col rounded-lg border bg-card">
      {tarefas.map((tarefa, index) => (
        <li key={tarefa.id} className="flex flex-col">
          {index > 0 && <Separator />}
          <article className="flex flex-col gap-3 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 flex-col gap-1">
                <p className="text-sm text-muted-foreground">
                  {displayLabel(tarefa.subject)}
                  {tarefa.theme && <> – {tarefa.theme}</>}
                </p>
                <h2 className="text-base font-semibold">{tarefa.title}</h2>
              </div>
              <DeleteButton
                action={deleteTarefa.bind(null, tarefa.id)}
                label="Excluir tarefa"
              />
            </div>

            <p className="text-sm text-pretty">{tarefa.description}</p>

            <div className="flex flex-wrap items-end justify-between gap-4">
              <dl className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-4">
                <div>
                  <dt className="text-muted-foreground">Tipo</dt>
                  <dd>{displayLabel(tarefa.type)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Dificuldade</dt>
                  <dd>{displayLabel(tarefa.dificulty)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Estimativa</dt>
                  <dd className="tabular-nums">{tarefa.estimated_minutes} min</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Data limite</dt>
                  <dd className="tabular-nums">{formatDueDate(tarefa.due_date)}</dd>
                </div>
              </dl>
              <TaskStatus taskId={tarefa.id} status={tarefa.status} />
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
