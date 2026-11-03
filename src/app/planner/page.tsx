import Header from "../layout/PageHeader";
import { auth } from "@clerk/nextjs/server";
import PlannerClient from "./components/plannerClient";
import { countTasksToPlan } from "./actions";

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
