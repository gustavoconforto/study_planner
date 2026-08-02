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
import { getWeekDayName } from "@/utils/data";
export default async function DisponibilidadeData({
  userEmail,
}: {
  userEmail: string;
}) {
  const disponibilidade = await readDisponibilidade({ userEmail });
  return (
    <div className="flex items-center justify-center">
      <Table>
        <TableCaption>Sua disponibilidade semanal.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-25">Dia</TableHead>
            <TableHead className="text-center">Início</TableHead>
            <TableHead className="text-center">Fim</TableHead>
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
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}
