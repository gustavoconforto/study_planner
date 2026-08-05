"use client";

import { Button } from "@/components/ui/button";
import { deleteTarefa, deleteRecommendation } from "../../actions";

export function DeleteTarefaButton({
  id,
  title,
}: {
  id: number;
  title: string;
}) {
  async function handleDelete() {
    await deleteTarefa(id);
    await deleteRecommendation(title);
  }

  return (
    <Button variant="ghost" onClick={handleDelete}>
      X
    </Button>
  );
}
