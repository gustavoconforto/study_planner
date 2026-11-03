"use client";
import { useState } from "react";
import PlannerData from "../plannerData";
import { Button } from "@/components/ui/button";
import { generatePlan } from "../../actions";
import type { PlannerResult } from "../../lib";

export default function PlannerClient({ taskCount }: { taskCount: number }) {
  const [result, setResult] = useState<PlannerResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setError(false);
    try {
      const response = await generatePlan();
      if (response.ok) setResult(response.data);
      else setError(true);
    } catch {
      setError(true);
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
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? "Gerando..." : "Criar"}
        </Button>
      </div>
    </div>
  );
}
