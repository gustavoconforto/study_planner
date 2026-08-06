import { Fragment } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import Header from "../layout/PageHeader";
import { getSchedulesByEmail } from "./actions";
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function AgendaPage() {
  await auth.protect();
  const user = await currentUser();
  if (!user) return null;
  const userEmail = user.primaryEmailAddress!.emailAddress;

  const schedules = await getSchedulesByEmail(userEmail);

  function extractDayTimeFromTimestamp(dateTime: string) {
    const [date, time] = dateTime.trim().split(" ");
    return {
      day: date.split("-")[2],
      month: date.split("-")[1],
      year: date.split("-")[0],
      hour: time.split(":")[0],
      minute: time.split(":")[1],
    };
  }

  const scheduleGroups = schedules.ok
    ? schedules.data.reduce<
        {
          schedule: (typeof schedules.data)[number];
          startTime: ReturnType<typeof extractDayTimeFromTimestamp>;
          endTime: ReturnType<typeof extractDayTimeFromTimestamp>;
          showDate: boolean;
        }[]
      >((groups, schedule) => {
        const startTime = extractDayTimeFromTimestamp(
          schedule.schedules.start_time,
        );
        const endTime = extractDayTimeFromTimestamp(
          schedule.schedules.end_time,
        );
        const previous = groups[groups.length - 1];
        const showDate =
          !previous ||
          previous.startTime.day !== startTime.day ||
          previous.startTime.month !== startTime.month;

        groups.push({ schedule, startTime, endTime, showDate });
        return groups;
      }, [])
    : [];

  return (
    <div className="w-full">
      <Header
        title="Agenda"
        subtitle="Acompanhe por aqui a sua agenda de estudos."
      />

      {schedules.ok && (
        <div className="flex flex-col gap-4">
          {scheduleGroups.map(({ schedule, startTime, endTime, showDate }) => {
            return (
              <Fragment key={schedule.schedules.id}>
                {showDate && (
                  <p className="px-10 font-semibold text-4xl">
                    {startTime.day}/{startTime.month}
                  </p>
                )}
                <Card className="mx-10">
                  <CardTitle className="px-4 font-semibold text-4xl">
                    {schedule.recommendations?.title}
                  </CardTitle>
                  <CardDescription className="px-4 font-semibold text-3xl">
                    {startTime.hour}:{startTime.minute} até {endTime.hour}:
                    {endTime.minute}
                  </CardDescription>
                  <CardContent>
                    <p className="">
                      Visão geral: {schedule.recommendations?.overview}
                    </p>
                    <p className="">Pré-requisitos:</p>
                    <ol>
                      {schedule.recommendations?.prerequisites.map((item) => {
                        return <li key={item}> - {item}</li>;
                      })}
                    </ol>
                    <p className="">Tópicos: </p>
                    <ol>
                      {schedule.recommendations?.topics_to_study.map((item) => {
                        return <li key={item}> - {item}</li>;
                      })}
                    </ol>
                    <p className="">Dicas de estudo: </p>
                    <ol>
                      {schedule.recommendations?.study_tips.map((item) => {
                        return <li key={item}> - {item}</li>;
                      })}
                    </ol>
                    <p className="">Erros comuns: </p>
                    <ol>
                      {schedule.recommendations?.common_mistakes.map((item) => {
                        return <li key={item}> - {item}</li>;
                      })}
                    </ol>
                  </CardContent>
                </Card>
              </Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}
