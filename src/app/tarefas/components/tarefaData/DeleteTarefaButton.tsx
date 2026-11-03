"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteTarefa } from "../../actions";

export function DeleteTarefaButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();
  const [failed, setFailed] = useState(false);

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteTarefa(id);
      setFailed(!result.ok);
    });
  }

  return (
    <span className="flex items-center gap-2">
      {failed && (
        <span role="alert" className="text-sm text-destructive">
          Erro ao excluir
        </span>
      )}
      <Button
        variant="ghost"
        onClick={handleDelete}
        disabled={isPending}
        aria-label="Excluir tarefa"
      >
        X
      </Button>
    </span>
  );
}
