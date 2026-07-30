import Image from "next/image";
import { RiCalendarLine, RiTaskLine, RiLineChartLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import Header from "@/app/layout/PageHeader";
import Footer from "@/app/layout/Footer";

const features = [
  {
    icon: RiCalendarLine,
    title: "Cronogramas inteligentes",
    description: "Monte agendas semanais ou mensais em poucos cliques.",
  },
  {
    icon: RiTaskLine,
    title: "Atribuição de tarefas",
    description:
      "Mantenha os estudos recorrentes para as provas bem como os deveres de casa diários atualizados.",
  },
  {
    icon: RiLineChartLine,
    title: "Acompanhamento em tempo real",
    description: "Veja seu progresso a qualquer momento.",
  },
];

const steps = [
  {
    title: "Horário de estudos",
    description: "Cadastre os horários disponíveis para estudo.",
  },
  {
    title: "Adicione as tarefas",
    description: "Insira as tarefas de casa e as datas de prova.",
  },
  {
    title: "Monte a agenda",
    description: "Distribua as tarefas e acompanhe os prazos em um só painel.",
  },
];

export default function Home() {
  return (
    <div className="w-full">
      <Header
        title="Organize sua agenda em um só lugar"
        subtitle="Crie cronogramas, distribua tarefas e acompanhe o progresso de cada turma em tempo real — tudo em uma interface simples e objetiva."
        actions={true}
      />

      <div className="flex flex-col md:flex-row gap-16 px-20 pb-8">
        <div>
          <div className="flex justify-center">
            <Image
              src="/hero-illustration.svg"
              alt="Ilustração de uma agenda semanal com tarefas organizadas"
              width={480}
              height={380}
              preload
            />
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold">
              Tudo o que você precisa para organizar a turma
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="flex flex-col gap-3 rounded-xl border border-red-100 p-4"
                >
                  <span className="flex size-9 items-center justify-center rounded-full bg-red-50 text-red-600">
                    <Icon size={18} />
                  </span>
                  <p className="text-base font-semibold">{title}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-start gap-4 rounded-xl border border-red-100 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-base font-semibold">
                  Pronto para organizar sua próxima agenda?
                </p>
                <p className="text-sm text-muted-foreground">
                  Crie sua agenda em poucos minutos.
                </p>
              </div>
              <Button variant="destructive" size="lg">
                Começar agora
              </Button>
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-col gap-5 px-4">
            <h3 className="text-xl font-semibold">Como funciona</h3>
            <ol className="flex flex-col gap-5">
              {steps.map((step, index) => (
                <li key={step.title} className="flex gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold">{step.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
