/* ------------------------------------------------------------------ */
/*  Availability domain logic                                          */
/*                                                                     */
/*  Ported from the provider implementation. Pure functions only — no   */
/*  React, no persistence — so the rules stay testable and the page     */
/*  component only deals with state + rendering.                       */
/* ------------------------------------------------------------------ */

export interface IBreakTime { start: string; end: string }

export interface IGeneratedSlot { start: string; end: string; active: boolean }

export interface IWeeklyRule {
  dayOfWeek: number;   // 0=Sun … 6=Sat
  isDayOff: boolean;
  workStart: string;   // "09:00"
  workEnd: string;     // "23:30"
}

export interface IException {
  date: string;             // "YYYY-MM-DD"
  isDayOff: boolean;
  workStart?: string;
  workEnd?: string;
  slots?: IGeneratedSlot[]; // explicit per-date list (persists manual edits/toggles)
}

export interface IAvailabilityConfig {
  userID: string;
  slotDurationMinutes: number;
  breakTime: IBreakTime;
  startDay: number;   // first working day of the week
  endDay: number;     // last working day of the week
  weeklyRules: IWeeklyRule[];
  exceptions: IException[];
}

/** Local UI only — not stored in the config. */
export interface TimeSlot extends IGeneratedSlot { id: string }
export interface DaySchedule { dayOff: boolean; slots: TimeSlot[] }
export type ScheduleMap = Record<string, DaySchedule>;

export const SLOT_MINUTES = 30;
export const WEEKEND_DAYS = [5, 6];
export const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const DEFAULT_WEEKLY_RULES: IWeeklyRule[] = [0, 1, 2, 3, 4, 5, 6].map(dow => ({
  dayOfWeek: dow,
  isDayOff: WEEKEND_DAYS.includes(dow),
  workStart: "09:00",
  workEnd: "17:00",
}));

/* ---------- date helpers ---------- */

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function startOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getWeekDates(reference: Date): Date[] {
  const start = startOfWeek(reference);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export function getMonthDates(reference: Date): Date[] {
  const year = reference.getFullYear();
  const month = reference.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
}

/* ---------- time helpers ---------- */

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => minutesToTime(i * 30));
export const START_TIME_OPTIONS = TIME_OPTIONS.filter(t => t >= "06:00");

/* ---------- core rules ---------- */

export function generateSlots(workStart: string, workEnd: string, breakTime?: IBreakTime): TimeSlot[] {
  const startMin = timeToMinutes(workStart);
  let endMin = timeToMinutes(workEnd);
  if (endMin <= startMin) endMin += 24 * 60;

  const breakStartMin = breakTime ? timeToMinutes(breakTime.start) : null;
  const breakEndMin = breakTime ? timeToMinutes(breakTime.end) : null;

  const slots: TimeSlot[] = [];
  for (let t = startMin; t + SLOT_MINUTES <= endMin; t += SLOT_MINUTES) {
    // Slots inside the break window stay in the list but are marked inactive
    // (greyed / not bookable) rather than removed.
    const inBreak =
      breakStartMin !== null && breakEndMin !== null && t >= breakStartMin && t < breakEndMin;
    slots.push({
      id: `${t}`,
      start: minutesToTime(t),
      end: minutesToTime(t + SLOT_MINUTES),
      active: !inBreak,
    });
  }
  return slots;
}

export function isWithinWorkingWeek(dow: number, startDay: number, endDay: number): boolean {
  if (startDay <= endDay) return dow >= startDay && dow <= endDay;
  return dow >= startDay || dow <= endDay; // wraps around e.g. Sat→Wed
}

export function resolveDay(
  date: Date,
  weeklyRules: IWeeklyRule[],
  exceptions: IException[],
  startDay: number,
  endDay: number,
) {
  const dow = date.getDay();
  const inRange = isWithinWorkingWeek(dow, startDay, endDay);
  // A weekend day (Fri/Sat) OUTSIDE the range can still be enabled via its weeklyRule.
  const weekendEnabled =
    !inRange && WEEKEND_DAYS.includes(dow)
    && weeklyRules.find(r => r.dayOfWeek === dow)?.isDayOff === false;
  // Days outside the configured range are off — unless a weekend day is explicitly enabled.
  if (!inRange && !weekendEnabled) {
    return { isDayOff: true, outsideRange: true, workStart: "09:00", workEnd: "17:00" };
  }
  const dateKey = formatDateKey(date);
  const exc = exceptions.find(e => e.date === dateKey);
  const rule = weeklyRules.find(r => r.dayOfWeek === dow) ?? DEFAULT_WEEKLY_RULES[dow];
  // A just-enabled weekend day should not stay off due to a stale day-off exception — rule wins.
  if (exc && !(weekendEnabled && exc.isDayOff)) {
    return {
      isDayOff: exc.isDayOff,
      outsideRange: false,
      workStart: exc.workStart ?? "09:00",
      workEnd: exc.workEnd ?? "17:00",
    };
  }
  // In-range days are working days by default (ignoring the weekend day-off default of the rule);
  // an out-of-range weekend day that reached here is enabled, so also a working day.
  const isDayOff = inRange ? false : rule.isDayOff;
  return { isDayOff, outsideRange: false, workStart: rule.workStart, workEnd: rule.workEnd };
}

/** Merge new exceptions (by date) into the existing list, replacing same-date entries. */
export function mergeExceptions(base: IException[], incoming: IException[]): IException[] {
  const byDate = new Map(base.map(e => [e.date, e]));
  incoming.forEach(e => byDate.set(e.date, e));
  return Array.from(byDate.values());
}

/**
 * Preview only shows slots for dates that were EXPLICITLY generated (i.e. have an
 * exception). Template days without an exception stay empty ("No slots") until
 * the user generates them.
 */
export function generateScheduleForDates(
  dates: Date[],
  rules: IWeeklyRule[],
  excs: IException[],
  bt: IBreakTime | undefined,
  sd: number,
  ed: number,
): ScheduleMap {
  const result: ScheduleMap = {};
  dates.forEach(date => {
    const dateKey = formatDateKey(date);
    const exc = excs.find(e => e.date === dateKey);
    const { isDayOff, workStart, workEnd } = resolveDay(date, rules, excs, sd, ed);
    if (isDayOff || !exc) {
      result[dateKey] = { dayOff: isDayOff, slots: [] };
    } else if (exc.slots && exc.slots.length > 0) {
      // Restore the exact saved slot list (preserves manual edits / active toggles).
      result[dateKey] = { dayOff: false, slots: exc.slots.map((s, i) => ({ id: `${i}`, ...s })) };
    } else {
      result[dateKey] = { dayOff: false, slots: generateSlots(workStart, workEnd, bt) };
    }
  });
  return result;
}
