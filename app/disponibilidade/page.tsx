import Header from "../layout/PageHeader";
import DisponibilidadeForm from "./components/disponibilidadeForm";
import DisponibilidadeData from "./components/disponibilidadeData";

export default function DisponibilidadePage() {
  return (
    <div className="w-full">
      <Header
        title="Disponibilidade"
        subtitle="Insira sua disponibilidade de estudos para que possamos ajudar na montagem ho seu horário"
      />
      <div className="flex flex-col md:flex-row gap-16 px-10 pb-8 w-full">
        <div className="w-[300px]">
          <DisponibilidadeData />
        </div>
        <div>
          <DisponibilidadeForm />
        </div>
      </div>
    </div>
  );
}
