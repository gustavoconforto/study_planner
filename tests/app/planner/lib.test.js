import { describe, expect, it } from "vitest";
import {
  buildAvailabilityWindows,
  pickValidSessions,
  pickRecommendations,
} from "@/src/app/planner/lib";

describe("pickRecommendations", () => {
  it("keeps the first recommendation per task, only for tasks with a session", () => {
    const rec = (task_id, title) => ({ task_id, title });
    const kept = pickRecommendations(
      [rec(1, "first"), rec(1, "duplicate"), rec(2, "no session")],
      [{ task_id: 1 }],
    );
    expect(kept).toEqual([rec(1, "first")]);
  });
});

// 2026-11-03 is a Tuesday (weekday 2). 21:00 UTC = 18:00 in São Paulo.
const now = new Date("2026-11-03T21:00:00Z");

describe("buildAvailabilityWindows", () => {
  it("uses the São Paulo date and drops or trims slots that already passed", () => {
    const windows = buildAvailabilityWindows(
      [
        { weekday: 2, start: "14:00", finish: "16:00" }, // today, already over
        { weekday: 2, start: "17:00", finish: "20:00" }, // today, in progress
        { weekday: 3, start: "08:00", finish: "09:00" }, // tomorrow
      ],
      now,
    );
    expect(windows).toEqual([
      {
        date: "2026-11-03",
        weekday_name: "Terça-feira",
        start: "18:00",
        finish: "20:00",
      },
      {
        date: "2026-11-04",
        weekday_name: "Quarta-feira",
        start: "08:00",
        finish: "09:00",
      },
    ]);
  });

  it("does not jump to tomorrow late in the evening (UTC is already the next day)", () => {
    const lateEvening = new Date("2026-11-04T01:30:00Z"); // 22:30 on the 3rd in São Paulo
    const windows = buildAvailabilityWindows(
      [{ weekday: 2, start: "22:00", finish: "23:30" }],
      lateEvening,
    );
    expect(windows[0]).toMatchObject({ date: "2026-11-03", start: "22:30" });
  });

  it("merges back-to-back and overlapping blocks of the same day", () => {
    const windows = buildAvailabilityWindows(
      [
        { weekday: 3, start: "16:00", finish: "18:00" },
        { weekday: 3, start: "14:00", finish: "16:00" }, // touches the one above
        { weekday: 3, start: "17:00", finish: "17:30" }, // inside it
        { weekday: 3, start: "19:00", finish: "20:00" }, // gap: stays separate
      ],
      now,
    );
    expect(windows.map((w) => `${w.start}-${w.finish}`)).toEqual([
      "14:00-18:00",
      "19:00-20:00",
    ]);
  });
});

describe("pickValidSessions", () => {
  const windows = [
    {
      date: "2026-11-04",
      weekday_name: "Quarta-feira",
      start: "08:00",
      finish: "12:00",
    },
  ];
  const session = (start, end, task_id = 1) => ({
    task_id,
    title: "t",
    start_time: `2026-11-04T${start}:00`,
    end_time: `2026-11-04T${end}:00`,
    reason: "r",
  });

  it("keeps only sessions inside availability, not overlapping booked or each other", () => {
    const kept = pickValidSessions(
      [
        session("08:00", "09:00"), // ok
        session("08:30", "09:30"), // overlaps the one above
        session("09:30", "10:30"), // overlaps booked 10:00-11:00
        session("11:00", "12:30"), // runs past availability
        session("11:00", "12:00"), // ok
        { ...session("11:00", "12:00"), start_time: "amanhã" }, // malformed
      ],
      windows,
      [{ startTime: "2026-11-04 10:00:00", endTime: "2026-11-04 11:00:00" }],
      new Map(),
    );
    expect(kept.map((s) => s.start_time)).toEqual([
      "2026-11-04T08:00:00",
      "2026-11-04T11:00:00",
    ]);
  });

  it("drops sessions after the task's due date, keeps those on it", () => {
    const kept = pickValidSessions(
      [session("08:00", "09:00", 1), session("09:00", "10:00", 2)],
      windows,
      [],
      new Map([
        [1, "2026-11-03"], // due the day before: dropped
        [2, "2026-11-04"], // due that day: kept
      ]),
    );
    expect(kept.map((s) => s.task_id)).toEqual([2]);
  });
});
