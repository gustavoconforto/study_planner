"use client";
import { useState } from "react";
import PlannerData, { type PlannerResult } from "../plannerData";
import { PlannerForm } from "../plannerForm";
import { generatePlan } from "../../actions";

export default function PlannerClient({ userEmail }: { userEmail: string }) {
  const [result, setResult] = useState<PlannerResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setError(false);
    const response = await generatePlan({ userEmail });
    if (response.ok) {
      setResult(response.data as PlannerResult);
    } else {
      setError(true);
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-16 px-10 pb-8 w-full">
      <div className="w-full md:w-1/2 min-w-0 flex justify-center">
        <PlannerData result={result} loading={loading} error={error} />
      </div>
      <div className="w-full md:w-1/2 min-w-0 flex justify-center">
        <PlannerForm onGenerate={handleGenerate} loading={loading} />
      </div>
    </div>
  );
}
