"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

// `action` is a server action with the row id already bound, e.g. deleteTarefa.bind(null, id).
export function DeleteButton({
  action,
  label,
}: {
  action: () => Promise<{ ok: boolean }>;
  label: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [failed, setFailed] = useState(false);

  function handleDelete() {
    startTransition(async () => {
      const result = await action();
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
        variant="ghost"
        onClick={handleDelete}
        disabled={isPending}
        aria-label={label}
      >
        X
      </Button>
    </span>
  );
}
