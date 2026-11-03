"use client";

import { Button } from "@/components/ui/button";
import { deleteTarefa } from "../../actions";

export function DeleteTarefaButton({ id }: { id: number }) {
  async function handleDelete() {
    await deleteTarefa(id);
  }

  return (
    <Button variant="ghost" onClick={handleDelete}>
      X
    </Button>
  );
}
