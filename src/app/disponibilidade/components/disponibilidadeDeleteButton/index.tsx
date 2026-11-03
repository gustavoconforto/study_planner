"use client";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteDisponibilidade } from "../../actions";

export default function DisponibilidadeDeleteButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();
  const [failed, setFailed] = useState(false);

  function handleDisponibilidadeDelete() {
    startTransition(async () => {
      const result = await deleteDisponibilidade(id);
      setFailed(!result.ok);
    });
  }

  return (
    <span className="inline-flex items-center gap-2">
      {failed && (
        <span role="alert" className="text-sm text-destructive">
          Erro ao excluir
        </span>
      )}
      <Button
        onClick={handleDisponibilidadeDelete}
        disabled={isPending}
        aria-label="Excluir disponibilidade"
      >
        X
      </Button>
    </span>
  );
}
