import Header from "../layout/PageHeader";
import { auth, currentUser } from "@clerk/nextjs/server";
import PlannerClient from "./components/plannerClient";
import { getTasksFromUser } from "./actions";

export default async function PlannerPage() {
  await auth.protect();
  const user = await currentUser();
  if (!user) return null;
  const userEmail = user.primaryEmailAddress!.emailAddress;
  const tasksResult = await getTasksFromUser({ userEmail });
  const taskCount = tasksResult.ok ? tasksResult.data.length : 0;

  return (
    <div className="w-full">
      <Header title="Planner" subtitle="Crie seu plano de estudos." />
      <PlannerClient userEmail={userEmail} taskCount={taskCount} />
    </div>
  );
}
