import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { readTarefas } from "../../actions";

function formatDueDate(due_date: string) {
  const [year, month, day] = due_date.split("-");
  return `${day}/${month}/${year}`;
}

export default async function TarefaData({ userEmail }: { userEmail: string }) {
  const tarefas = await readTarefas({ userEmail });
  return (
    <div className="flex items-center justify-center">
      <Table>
        <TableCaption>Suas tarefas cadastradas.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Matéria</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-center">Dificuldade</TableHead>
            <TableHead className="text-center">Estimativa</TableHead>
            <TableHead className="text-center">Data Limite</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tarefas.ok &&
            tarefas.data!.map((tarefa) => {
              return (
                <TableRow key={tarefa.id}>
                  <TableCell className="font-medium">{tarefa.title}</TableCell>
                  <TableCell>{tarefa.subject}</TableCell>
                  <TableCell>{tarefa.type}</TableCell>
                  <TableCell className="text-center">
                    {tarefa.dificulty}
                  </TableCell>
                  <TableCell className="text-center">
                    {tarefa.estimated_minutes} min
                  </TableCell>
                  <TableCell className="text-center">
                    {formatDueDate(tarefa.due_date)}
                  </TableCell>
                  <TableCell className="text-center">{tarefa.status}</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}
