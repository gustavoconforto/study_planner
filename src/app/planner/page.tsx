import Header from "../layout/PageHeader";

export default async function PlannerPage() {
  return (
    <div className="w-full">
      <Header title="Planner" subtitle="Crie seu plano de estudos." />
      <div className="flex flex-col md:flex-row items-center md:items-start gap-16 px-10 pb-8 w-full">
        <div className="w-full md:w-1/2 min-w-0 flex justify-center">
          <div>data</div>
        </div>
        <div className="w-full md:w-1/2 min-w-0 flex justify-center">
          <div>form</div>
        </div>
      </div>
    </div>
  );
}
