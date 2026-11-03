import { getWeekDayName, localNow } from "@/utils/data";

export type StudyRecommendation = {
  task_id: number;
  title: string;
  overview: string;
  prerequisites: string[];
  topics_to_study: string[];
  common_mistakes: string[];
  study_tips: string[];
};

export type Session = {
  task_id: number;
  title: string;
  start_time: string;
  end_time: string;
  reason: string;
};

export type PlannerResult = {
  summary: {
    general_analysis: string;
    study_recommendations: StudyRecommendation[];
  };
  sessions: Session[];
};

export type AvailabilityWindow = {
  date: string;
  weekday_name: string;
  start: string;
  finish: string;
};

// Expands the weekly availability into concrete slots for the next `days` days,
// in the student's time zone, without slots (or parts of slots) that already passed.
export function buildAvailabilityWindows(
  availabilities: { weekday: number; start: string; finish: string }[],
  now: Date,
  days = 7,
) {
  const today = localNow(now);
  const windows: AvailabilityWindow[] = [];

  for (let i = 0; i < days; i++) {
    const day = new Date(`${today.date}T00:00:00Z`);
    day.setUTCDate(day.getUTCDate() + i);
    const date = day.toISOString().slice(0, 10);
    const weekday = day.getUTCDay();

    for (const availability of availabilities) {
      if (availability.weekday !== weekday) continue;
      const start = availability.start.slice(0, 5);
      const finish = availability.finish.slice(0, 5);
      if (i === 0 && finish <= today.time) continue;
      windows.push({
        date,
        weekday_name: getWeekDayName(weekday),
        start: i === 0 && start < today.time ? today.time : start,
        finish,
      });
    }
  }

  return windows;
}

const DATE_TIME = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2})?$/;
// "2026-11-03T14:00:00" and "2026-11-03 14:00:00" -> "2026-11-03T14:00", comparable as strings.
const minute = (value: string) => value.replace(" ", "T").slice(0, 16);

// The AI is only asked to respect availability and booked time; keep only the sessions that really do.
export function pickValidSessions(
  sessions: Session[],
  windows: AvailabilityWindow[],
  booked: { startTime: string; endTime: string }[],
) {
  const taken = booked.map((b) => [minute(b.startTime), minute(b.endTime)]);
  const valid: Session[] = [];

  for (const session of sessions) {
    if (
      !DATE_TIME.test(session.start_time) ||
      !DATE_TIME.test(session.end_time)
    )
      continue;
    const start = minute(session.start_time);
    const end = minute(session.end_time);
    const date = start.slice(0, 10);
    if (end.slice(0, 10) !== date || start >= end) continue;

    const fits = windows.some(
      (w) =>
        w.date === date &&
        `${date}T${w.start}` <= start &&
        end <= `${date}T${w.finish}`,
    );
    const overlaps = taken.some(([s, e]) => start < e && s < end);
    if (!fits || overlaps) continue;

    taken.push([start, end]);
    valid.push(session);
  }

  return valid;
}
