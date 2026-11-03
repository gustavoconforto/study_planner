import { auth } from "@clerk/nextjs/server";
import Header from "../layout/PageHeader";
import TarefaData from "./components/tarefaData";
import TarefaForm from "./components/tarefaForm";
export default async function TarefaPage() {
  await auth.protect();
  return (
    <div className="w-full">
      <Header
        title="Tarefas"
        subtitle="Cadastre suas tarefas para que possamos criar sua agenda."
      />
      <div className="flex flex-col md:flex-row items-center md:items-start gap-16 px-10 pb-8 w-full">
        <div className="w-full md:w-1/2 min-w-0 flex justify-center">
          <TarefaData />
        </div>
        <div className="w-full md:w-1/2 min-w-0 flex justify-center">
          <TarefaForm />
        </div>
      </div>
    </div>
  );
}
