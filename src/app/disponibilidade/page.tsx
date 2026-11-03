import { auth } from "@clerk/nextjs/server";
import Header from "../layout/PageHeader";
import DisponibilidadeForm from "./components/disponibilidadeForm";
import DisponibilidadeData from "./components/disponibilidadeData";

export default async function DisponibilidadePage() {
  await auth.protect();

  return (
    <div>
      <Header
        title="Disponibilidade"
        subtitle="Insira sua disponibilidade de estudos para que possamos ajudar na montagem do seu horário"
      />
      <div className="mx-auto grid w-full max-w-6xl items-start gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="min-w-0">
          <DisponibilidadeData />
        </section>
        <aside className="lg:sticky lg:top-6">
          <DisponibilidadeForm />
        </aside>
      </div>
    </div>
  );
}
