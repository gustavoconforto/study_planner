"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PlannerData from "../plannerData";
import { Button } from "@/components/ui/button";
import { generatePlan, type PlanFailure } from "../../actions";
import type { PlannerResult } from "../../lib";

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
    <div className="flex flex-col md:flex-row items-center md:items-start gap-16 px-10 pb-8 w-full">
      <div className="w-full md:w-1/2 min-w-0 flex justify-center">
        <PlannerData
          result={result}
          loading={loading}
          error={error}
          taskCount={taskCount}
        />
      </div>
      <div className="w-full md:w-1/2 min-w-0 flex justify-center">
        <Button onClick={handleGenerate} disabled={loading || taskCount === 0}>
          {loading ? "Gerando..." : "Criar"}
        </Button>
      </div>
    </div>
  );
}
