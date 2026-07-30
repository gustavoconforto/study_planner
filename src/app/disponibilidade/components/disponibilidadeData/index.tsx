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

export default async function DisponibilidadeData({
  userEmail,
}: {
  userEmail: string;
}) {
  const disponibilidade = await readDisponibilidade({ userEmail });
  return (
    <div className="flex items-center justify-center">
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
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
                  <TableCell className="font-medium">Terça-Feira</TableCell>
                  <TableCell className="text-center">14:00:00</TableCell>
                  <TableCell className="text-center">18:00:00</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}
