"use client";
import { Button } from "@/components/ui/button";

export function PlannerForm({
  onGenerate,
  loading,
}: {
  onGenerate: () => void;
  loading: boolean;
}) {
  return (
    <Button onClick={onGenerate} disabled={loading}>
      {loading ? "Gerando..." : "Criar"}
    </Button>
  );
}
