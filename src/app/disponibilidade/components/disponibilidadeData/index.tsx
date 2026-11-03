import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteDisponibilidade, readDisponibilidade } from "../../actions";
import { getWeekDayName, weekDays } from "@/utils/data";
import { DeleteButton } from "@/components/delete-button";

// Hour scale: a line every 6 hours, like the ruling of a timetable.
const HOUR_LINES = [6, 12, 18];

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export default async function DisponibilidadeData() {
  const eventos = await readDisponibilidade();

  return (
    <div className="flex flex-col gap-8">
      <div className="overflow-x-auto rounded-lg border bg-card">
        <div className="grid min-w-175 grid-cols-[2.5rem_repeat(7,minmax(0,1fr))]">
          <div className="border-b" />
          {weekDays.map((day) => (
            <div
              key={day.value}
              className="border-b border-l px-2 py-2.5 text-center text-sm font-medium"
            >
              {day.label.replace("-feira", "")}
            </div>
          ))}

          <div className="relative h-120 text-[0.7rem] text-muted-foreground tabular-nums">
            {HOUR_LINES.map((hour) => (
              <span
                key={hour}
                className="absolute right-1.5 -translate-y-1/2"
                style={{ top: `${(hour / 24) * 100}%` }}
              >
                {hour}h
              </span>
            ))}
          </div>
          {weekDays.map((day) => {
            const eventosDoDia = eventos.filter(
              (evento) => evento.weekday === day.value,
            );
            return (
              <div key={day.value} className="relative h-120 border-l">
                {HOUR_LINES.map((hour) => (
                  <div
                    key={hour}
                    aria-hidden
                    className="absolute inset-x-0 border-t border-dashed"
                    style={{ top: `${(hour / 24) * 100}%` }}
                  />
                ))}
                {eventosDoDia.map((evento) => {
                  const inicio = timeToMinutes(evento.start);
                  const fim = timeToMinutes(evento.finish);
                  const top = (inicio / 1440) * 100;
                  const height = ((fim - inicio) / 1440) * 100;
                  return (
                    <div
                      key={evento.id}
                      className="absolute inset-x-1 overflow-hidden rounded-md border-l-2 border-primary bg-accent px-1.5 py-1 text-xs text-accent-foreground tabular-nums"
                      style={{
                        top: `${top}%`,
                        height: `${Math.max(height, 4)}%`,
                      }}
                    >
                      {evento.start}–{evento.finish}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {eventos.length > 0 && (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableCaption className="sr-only">Sua disponibilidade semanal.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Dia</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Fim</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventos.map((disp) => {
                return (
                  <TableRow key={disp.id}>
                    <TableCell className="pl-4 font-medium">
                      {getWeekDayName(disp.weekday)}
                    </TableCell>
                    <TableCell className="tabular-nums">{disp.start}</TableCell>
                    <TableCell className="tabular-nums">{disp.finish}</TableCell>
                    <TableCell className="text-right">
                      <DeleteButton
                        action={deleteDisponibilidade.bind(null, disp.id)}
                        label="Excluir disponibilidade"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
