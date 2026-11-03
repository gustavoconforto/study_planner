import { RiCalendarLine } from "@remixicon/react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import Header from "../layout/PageHeader";
import { TaskList } from "../planner/components/plannerData";
import { getSchedules } from "./actions";
import { auth } from "@clerk/nextjs/server";
import { getWeekDayName, localNow } from "@/utils/data";

const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export default async function AgendaPage() {
  await auth.protect();

  const schedules = await getSchedules();
  const today = localNow().date;

  // Postgres sends "YYYY-MM-DD HH:MM:SS".
  function extractDayTimeFromTimestamp(dateTime: string) {
    return {
      day: dateTime.slice(8, 10),
      month: dateTime.slice(5, 7),
      hour: dateTime.slice(11, 13),
      minute: dateTime.slice(14, 16),
    };
  }

  // Sessions come sorted by start time; one group per calendar day.
  const days = new Map<string, typeof schedules>();
  for (const schedule of schedules) {
    const date = schedule.schedules.start_time.slice(0, 10);
    days.set(date, [...(days.get(date) ?? []), schedule]);
  }

  return (
    <div>
      <Header
        title="Agenda"
        subtitle="Acompanhe por aqui a sua agenda de estudos."
      />

      <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
        {days.size === 0 ? (
          <Empty className="border bg-card">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <RiCalendarLine />
              </EmptyMedia>
              <EmptyTitle>Nenhuma sessão de estudo marcada</EmptyTitle>
              <EmptyDescription>
                Gere um plano para preencher sua agenda com as tarefas cadastradas.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Link href="/planner" className={buttonVariants()}>
                Gerar plano
              </Link>
            </EmptyContent>
          </Empty>
        ) : (
          <ol className="flex flex-col">
            {[...days].map(([date, sessions]) => {
              const isToday = date === today;
              const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
              return (
                <li
                  key={date}
                  className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-4 border-t py-6 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-8"
                >
                  {/* The planner's margin: the date stays in view while the day's sessions scroll. */}
                  <div className="flex flex-col self-start sm:sticky sm:top-6">
                    <span className="text-sm text-muted-foreground">
                      {isToday ? "Hoje" : getWeekDayName(weekday).replace("-feira", "")}
                    </span>
                    <span
                      className={cn(
                        "text-4xl font-semibold tabular-nums sm:text-5xl",
                        isToday && "text-primary",
                      )}
                    >
                      {date.slice(8, 10)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {MONTHS[Number(date.slice(5, 7)) - 1]}
                    </span>
                  </div>

                  <ul className="flex flex-col gap-3">
                    {sessions.map((schedule) => {
                      const startTime = extractDayTimeFromTimestamp(
                        schedule.schedules.start_time,
                      );
                      const endTime = extractDayTimeFromTimestamp(
                        schedule.schedules.end_time,
                      );
                      const recommendation = schedule.recommendations;
                      return (
                        <li
                          key={schedule.schedules.id}
                          className="flex flex-col gap-2 rounded-lg border bg-card p-5"
                        >
                          <p className="text-sm font-medium tabular-nums text-muted-foreground">
                            {startTime.hour}:{startTime.minute} – {endTime.hour}:
                            {endTime.minute}
                          </p>
                          <h2 className="text-lg font-semibold tracking-tight">
                            {recommendation?.title}
                          </h2>
                          {recommendation?.overview && (
                            <p className="max-w-prose text-sm text-pretty text-muted-foreground">
                              {recommendation.overview}
                            </p>
                          )}
                          <details className="mt-1">
                            <summary className="w-fit cursor-pointer text-sm font-medium text-primary underline-offset-4 hover:underline">
                              Orientações de estudo
                            </summary>
                            <div className="mt-4 grid gap-5 sm:grid-cols-2">
                              <TaskList
                                title="Pré-requisitos"
                                items={recommendation?.prerequisites}
                              />
                              <TaskList
                                title="Tópicos"
                                items={recommendation?.topics_to_study}
                              />
                              <TaskList
                                title="Dicas de estudo"
                                items={recommendation?.study_tips}
                              />
                              <TaskList
                                title="Erros comuns"
                                items={recommendation?.common_mistakes}
                              />
                            </div>
                          </details>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
