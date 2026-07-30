import { auth, currentUser } from "@clerk/nextjs/server";
import Header from "../layout/PageHeader";
import DisponibilidadeForm from "./components/disponibilidadeForm";
import DisponibilidadeData from "./components/disponibilidadeData";

export default async function DisponibilidadePage() {
  await auth.protect();
  const user = await currentUser();
  if (!user) return null;
  const userEmail = user.primaryEmailAddress!.emailAddress;

  return (
    <div className="w-full">
      <Header
        title="Disponibilidade"
        subtitle="Insira sua disponibilidade de estudos para que possamos ajudar na montagem ho seu horário"
      />
      <div className="flex flex-col md:flex-row items-center md:items-start gap-16 px-10 pb-8 w-full">
        <div className="w-full md:w-3/5 flex justify-center">
          <DisponibilidadeData userEmail={userEmail} />
        </div>
        <div className="w-full md:flex-1 flex justify-center">
          <DisponibilidadeForm userEmail={userEmail} />
        </div>
      </div>
    </div>
  );
}
