"use client";
import { useState } from "react";
import PlannerData, { type PlannerResult } from "../plannerData";
import { PlannerForm } from "../plannerForm";
import { generatePlan, saveRecomendation, saveSchedules } from "../../actions";

export default function PlannerClient({
  userEmail,
  taskCount,
}: {
  userEmail: string;
  taskCount: number;
}) {
  const [result, setResult] = useState<PlannerResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setError(false);
    const response = await generatePlan({ userEmail });
    if (response.ok) {
      const data = response.data as PlannerResult;

      for (const recommendation of data.summary.study_recommendations) {
        const recommentadionId = await saveRecomendation({ recommendation });
        const task_id = recommendation.task_id;

        const sessions = data.sessions.filter(
          (session) => session.task_id == task_id,
        );
        for (const session of sessions) {
          await saveSchedules({ session, recommentadionId, userEmail });
        }
      }

      setResult(data);
    } else {
      setError(true);
    }
    setLoading(false);
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
        <PlannerForm onGenerate={handleGenerate} loading={loading} />
      </div>
    </div>
  );
}
