import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { readDisponibilidade } from "../../actions";
import { getWeekDayName, weekDays } from "@/utils/data";
import DisponibilidadeDeleteButton from "../disponibilidadeDeleteButton";

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export default async function DisponibilidadeData({
  userEmail,
}: {
  userEmail: string;
}) {
  const disponibilidade = await readDisponibilidade({ userEmail });
  const eventos = disponibilidade.ok ? disponibilidade.data! : [];

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="w-full overflow-x-auto">
        <div className="grid min-w-175 grid-cols-7 gap-px rounded-md border bg-border">
          {weekDays.map((day) => (
            <div
              key={day.value}
              className="bg-background px-2 py-2 text-center text-sm font-medium"
            >
              {getWeekDayName(day.value)}
            </div>
          ))}
          {weekDays.map((day) => {
            const eventosDoDia = eventos.filter(
              (evento) => evento.weekday === day.value,
            );
            return (
              <div key={day.value} className="relative h-120 bg-background">
                {eventosDoDia.map((evento) => {
                  const inicio = timeToMinutes(evento.start);
                  const fim = timeToMinutes(evento.finish);
                  const top = (inicio / 1440) * 100;
                  const height = ((fim - inicio) / 1440) * 100;
                  return (
                    <div
                      key={evento.id}
                      className="absolute inset-x-1 overflow-hidden rounded-md border border-red-500/40 bg-red-500/15 px-1.5 py-1 text-xs text-red-700 dark:text-red-400"
                      style={{
                        top: `${top}%`,
                        height: `${Math.max(height, 4)}%`,
                      }}
                    >
                      {evento.start} - {evento.finish}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <Table>
        <TableCaption>Sua disponibilidade semanal.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-25">Dia</TableHead>
            <TableHead className="text-center">Início</TableHead>
            <TableHead className="text-center">Fim</TableHead>
            <TableHead className="text-center"> </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {disponibilidade.ok &&
            disponibilidade.data!.map((disp) => {
              return (
                <TableRow key={disp.id}>
                  <TableCell className="font-medium">
                    {getWeekDayName(disp.weekday)}
                  </TableCell>
                  <TableCell className="text-center">{disp.start}</TableCell>
                  <TableCell className="text-center">{disp.finish}</TableCell>
                  <TableCell className="text-center">
                    <DisponibilidadeDeleteButton id={disp.id} />
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}
