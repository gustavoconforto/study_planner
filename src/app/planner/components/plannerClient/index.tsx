"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PlannerData from "../plannerData";
import { Button } from "@/components/ui/button";
import { generatePlan, type PlanFailure } from "../../actions";
import { MAX_TASKS_PER_PLAN, type PlannerResult } from "../../lib";

const failureMessages: Record<PlanFailure, string> = {
  "sem-disponibilidade":
    "Nenhum horário livre nos próximos 7 dias. Cadastre sua disponibilidade antes de gerar o plano.",
  "sem-tarefas":
    "Não há tarefas novas para planejar. Cadastre tarefas antes de gerar o plano.",
  falhou: "Não foi possível gerar o plano de estudos. Tente novamente.",
};

export default function PlannerClient({ taskCount }: { taskCount: number }) {
  const [result, setResult] = useState<PlannerResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const response = await generatePlan();
      if (response.ok) setResult(response.data);
      else setError(failureMessages[response.reason]);
      // Reload taskCount: tasks past the limit, or that didn't fit, are still waiting.
      router.refresh();
    } catch {
      setError(failureMessages.falhou);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-16 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-card p-5">
        <div className="flex flex-col gap-1">
          <p className="font-semibold">
            {taskCount === 0
              ? "Nenhuma tarefa na fila"
              : taskCount === 1
                ? "1 tarefa na fila"
                : `${taskCount} tarefas na fila`}
          </p>
          <p className="text-sm text-muted-foreground">
            {taskCount === 0
              ? "Cadastre tarefas para gerar um novo plano."
              : taskCount > MAX_TASKS_PER_PLAN
                ? `Cada plano inclui as ${MAX_TASKS_PER_PLAN} tarefas com prazo mais próximo. As outras ficam para o próximo plano.`
                : "O plano distribui as tarefas nos seus horários livres dos próximos 7 dias."}
          </p>
        </div>
        <Button size="lg" onClick={handleGenerate} disabled={loading || taskCount === 0}>
          {loading ? "Gerando plano..." : "Gerar plano"}
        </Button>
      </div>

      <PlannerData result={result} loading={loading} error={error} />
    </div>
  );
}
