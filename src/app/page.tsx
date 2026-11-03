import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { RiCalendarLine, RiTaskLine, RiLineChartLine } from "@remixicon/react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import Header from "@/src/app/layout/PageHeader";
import Footer from "@/src/app/layout/Footer";

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

export default async function Home() {
  const user = await currentUser();

  return (
    <div className="flex min-h-full flex-col">
      <Header
        title={`Bem vindo(a)${user?.firstName ? ` ${user.firstName}.` : ""} Organize sua agenda em um só lugar`}
        subtitle="Crie cronogramas, distribua tarefas e acompanhe o progresso de cada turma em tempo real em uma interface simples e objetiva."
        actions={true}
      />

      <div className="mx-auto grid w-full max-w-6xl flex-1 gap-12 px-4 pb-16 sm:px-6 lg:grid-cols-[1fr_20rem]">
        <section className="flex flex-col gap-8">
          <Image
            src="/hero-illustration.svg"
            alt="Ilustração de uma agenda semanal com tarefas organizadas"
            width={480}
            height={380}
            preload
            className="h-auto w-full max-w-md"
          />

          <div className="flex flex-col gap-5">
            <h2 className="text-xl font-semibold tracking-tight">
              Tudo o que você precisa para organizar a turma
            </h2>
            <ul className="grid gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-3">
              {features.map(({ icon: Icon, title, description }) => (
                <li key={title} className="flex flex-col gap-2 bg-card p-5">
                  <Icon aria-hidden className="size-5 text-primary" />
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-start gap-4 rounded-lg bg-accent p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-accent-foreground">
                Pronto para organizar sua próxima agenda?
              </p>
              <p className="text-sm text-muted-foreground">
                Crie sua agenda em poucos minutos.
              </p>
            </div>
            <Link href="/disponibilidade" className={buttonVariants({ size: "lg" })}>
              Começar agora
            </Link>
          </div>
        </section>

        <section id="como-funciona" className="flex flex-col gap-5 scroll-mt-6">
          <h2 className="text-xl font-semibold tracking-tight">Como funciona</h2>
          <ol className="flex flex-col">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="flex gap-4 border-l py-3 pl-5 relative"
              >
                <span className="absolute -left-3 top-3 flex size-6 items-center justify-center rounded-full border bg-card text-xs font-semibold tabular-nums">
                  {index + 1}
                </span>
                <div className="flex flex-col gap-1">
                  <p className="font-semibold">{step.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <Footer />
    </div>
  );
}
