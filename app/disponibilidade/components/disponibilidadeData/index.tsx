import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DisponibilidadeData() {
  return (
    <div className="flex items-center justify-center">
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Dia</TableHead>
            <TableHead className="text-center">Início</TableHead>
            <TableHead className="text-center">Fim</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Terça-Feira</TableCell>
            <TableCell className="text-center">14:00:00</TableCell>
            <TableCell className="text-center">18:00:00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Quarta-Feira</TableCell>
            <TableCell className="text-center">14:00:00</TableCell>
            <TableCell className="text-center">20:00:00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Quinta-Feira</TableCell>
            <TableCell className="text-center">14:00:00</TableCell>
            <TableCell className="text-center">16:30:00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Quinta-Feira</TableCell>
            <TableCell className="text-center">18:00:00</TableCell>
            <TableCell className="text-center">20:00:00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Sexta-Feira</TableCell>
            <TableCell className="text-center">14:00:00</TableCell>
            <TableCell className="text-center">18:00:00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Sábado</TableCell>
            <TableCell className="text-center">14:00:00</TableCell>
            <TableCell className="text-center">16:00:00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Domingo</TableCell>
            <TableCell className="text-center">10:00:00</TableCell>
            <TableCell className="text-center">13:00:00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
