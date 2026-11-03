import { auth } from "@clerk/nextjs/server";
import Header from "../layout/PageHeader";
import TarefaData from "./components/tarefaData";
import TarefaForm from "./components/tarefaForm";
export default async function TarefaPage() {
  await auth.protect();
  return (
    <div>
      <Header
        title="Tarefas"
        subtitle="Cadastre suas tarefas para que possamos criar sua agenda."
      />
      <div className="mx-auto grid w-full max-w-6xl items-start gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="min-w-0">
          <TarefaData />
        </section>
        <aside className="lg:sticky lg:top-6">
          <TarefaForm />
        </aside>
      </div>
    </div>
  );
}
