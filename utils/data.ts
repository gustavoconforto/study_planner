export const weekDays = [
  { label: "Domingo", value: 0 },
  { label: "Segunda-feira", value: 1 },
  { label: "Terça-feira", value: 2 },
  { label: "Quarta-feira", value: 3 },
  { label: "Quinta-feira", value: 4 },
  { label: "Sexta-feira", value: 5 },
  { label: "Sábado", value: 6 },
];

export function getWeekDayName(value: number): string {
  return weekDays.find((day) => day.value === value)?.label ?? "";
}

// shortcut: one fixed time zone for every student; store a per-user zone if students outside Brazil join.
const TIME_ZONE = "America/Sao_Paulo";

export function localNow(now = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(now)
      .map((part) => [part.type, part.value]),
  );
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}`,
  };
}

// Enum values are stored in caps ("LÍNGUA PORTUGUESA"); show them in sentence case. Acronyms ("PS", "PB") stay.
export function displayLabel(value: string) {
  return value.length <= 2
    ? value
    : value[0] + value.slice(1).toLocaleLowerCase("pt-BR");
}
