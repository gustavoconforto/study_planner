import Header from "../layout/PageHeader";
import { auth } from "@clerk/nextjs/server";
import PlannerClient from "./components/plannerClient";
import { countTasksToPlan } from "./actions";

// generatePlan (a server action used on this page) waits on a slow AI call; if the host kills it
// mid-call, the claimed tasks stay AGENDADO with no plan.
export const maxDuration = 300;

export default async function PlannerPage() {
  await auth.protect();
  const taskCount = await countTasksToPlan();

  return (
    <div className="w-full">
      <Header title="Planner" subtitle="Crie seu plano de estudos." />
      <PlannerClient taskCount={taskCount} />
    </div>
  );
}
