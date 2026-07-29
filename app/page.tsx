"use client";

import Image from "next/image";
import { Heading, Text, Button } from "@primer/react";
import { CalendarIcon, ChecklistIcon, GraphIcon } from "@primer/octicons-react";
import Header from "@/app/layout/PageHeader";
import Footer from "@/app/layout/Footer";

const features = [
  {
    icon: CalendarIcon,
    title: "Cronogramas inteligentes",
    description: "Monte agendas semanais ou mensais em poucos cliques.",
  },
  {
    icon: ChecklistIcon,
    title: "Atribuição de tarefas",
    description:
      "Mantenha os estudos recorrentes para as provas bem como os deveres de casa diários atualizados.",
  },
  {
    icon: GraphIcon,
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
            <Heading as="h2" variant="medium">
              Tudo o que você precisa para organizar a turma
            </Heading>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="flex flex-col gap-3 rounded-xl border border-red-100 p-4"
                >
                  <span className="flex size-9 items-center justify-center rounded-full bg-red-50 text-red-600">
                    <Icon size={18} />
                  </span>
                  <Text as="p" weight="semibold" size="large">
                    {title}
                  </Text>
                  <Text as="p" size="small" className="text-(--fgColor-muted)">
                    {description}
                  </Text>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-start gap-4 rounded-xl border border-red-100 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1">
                <Text as="p" weight="semibold" size="large">
                  Pronto para organizar sua próxima agenda?
                </Text>
                <Text as="p" size="small" className="text-(--fgColor-muted)">
                  Crie sua agenda em poucos minutos.
                </Text>
              </div>
              <Button variant="danger" size="large">
                Começar agora
              </Button>
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-col gap-5 px-4">
            <Heading as="h3" variant="small">
              Como funciona
            </Heading>
            <ol className="flex flex-col gap-5">
              {steps.map((step, index) => (
                <li key={step.title} className="flex gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <div className="flex flex-col gap-1">
                    <Text as="p" weight="semibold" size="small">
                      {step.title}
                    </Text>
                    <Text
                      as="p"
                      size="small"
                      className="text-(--fgColor-muted)"
                    >
                      {step.description}
                    </Text>
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
