"use client";
import { Button } from "@/components/ui/button";
import { deleteDisponibilidade } from "../../actions";

export default function DisponibilidadeDeleteButton({ id }: { id: number }) {
  async function handleDisponibilidadeDelete() {
    await deleteDisponibilidade(id);
  }

  return <Button onClick={handleDisponibilidadeDelete}>X</Button>;
}
