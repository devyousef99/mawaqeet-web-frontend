"use client";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageCard } from "@mawaqeet/ui/TableShell";
import { Btn, Modal, SelectField, SwitchField } from "@mawaqeet/ui/form";
import {
  DAY_LABELS, DEFAULT_WEEKLY_RULES, SLOT_MINUTES, START_TIME_OPTIONS, TIME_OPTIONS, WEEKEND_DAYS,
  formatDateKey, generateScheduleForDates, generateSlots, getMonthDates, getWeekDates,
  isWithinWorkingWeek, mergeExceptions, resolveDay,
  type DaySchedule, type IAvailabilityConfig, type IBreakTime, type IException,
  type IWeeklyRule, type ScheduleMap, type TimeSlot,
} from "@/lib/availability";
import { loadConfig, saveConfig } from "@/lib/availability-store";

const dayOptions = DAY_LABELS.map((label, i) => ({ value: i, label }));
const timeOptions = TIME_OPTIONS.map(t => ({ value: t, label: t }));
const startTimeOptions = START_TIME_OPTIONS.map(t => ({ value: t, label: t }));

export default function Availability() {
  // Read the persisted config once, during the first render, rather than in an
  // effect — an effect would set state synchronously and cascade a re-render
  // (and trip react-hooks/set-state-in-effect).
  const [stored] = useState(() => loadConfig());
  const storedBreak = stored && stored.breakTime?.start !== "00:00" ? stored.breakTime : undefined;

  const [weeklyRules, setWeeklyRules] = useState<IWeeklyRule[]>(stored?.weeklyRules ?? DEFAULT_WEEKLY_RULES);
  const [breakEnabled, setBreakEnabled] = useState(!!storedBreak);
  const [breakStart, setBreakStart] = useState(storedBreak?.start ?? "13:00");
  const [breakEnd, setBreakEnd] = useState(storedBreak?.end ?? "14:00");
  const [startDay, setStartDay] = useState(stored?.startDay ?? 0); // 0=Sun (default: Sun–Thu)
  const [endDay, setEndDay] = useState(stored?.endDay ?? 4);       // 4=Thu
  const [exceptions, setExceptions] = useState<IException[]>(stored?.exceptions ?? []);
  const [templateStart, setTemplateStart] = useState(
    () => (stored?.weeklyRules ?? DEFAULT_WEEKLY_RULES).find(r => !r.isDayOff)?.workStart ?? "09:00");
  const [templateEnd, setTemplateEnd] = useState(
    () => (stored?.weeklyRules ?? DEFAULT_WEEKLY_RULES).find(r => !r.isDayOff)?.workEnd ?? "17:00");
  const [refDate, setRefDate] = useState(() => new Date());
  const [toast, setToast] = useState<string | null>(null);

  const [editingSlot, setEditingSlot] = useState<{ dateKey: string; slot: TimeSlot } | null>(null);
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");
  const [editActive, setEditActive] = useState(true);

  const weekDates = useMemo(() => getWeekDates(refDate), [refDate]);
  // Memoised so it stays referentially stable — the derived schedule depends on it.
  const breakTime: IBreakTime | undefined = useMemo(
    () => (breakEnabled ? { start: breakStart, end: breakEnd } : undefined),
    [breakEnabled, breakStart, breakEnd],
  );

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  /**
   * The visible week's schedule is derived from the saved exceptions rather than
   * held in state, so navigating weeks needs no effect and manual slot edits
   * (which are written onto the date's exception) show up automatically.
   */
  const schedule: ScheduleMap = useMemo(
    () => generateScheduleForDates(weekDates, weeklyRules, exceptions, breakTime, startDay, endDay),
    [weekDates, weeklyRules, exceptions, breakTime, startDay, endDay],
  );

  const buildFullConfig = (): IAvailabilityConfig => ({
    userID: "local-provider",
    slotDurationMinutes: SLOT_MINUTES,
    startDay,
    endDay,
    breakTime: {
      start: breakEnabled ? breakStart : "00:00",
      end: breakEnabled ? breakEnd : "00:00",
    },
    weeklyRules,
    exceptions,
  });

  /* ---------- Save Config: full template + regenerate existing exceptions ---------- */
  const handleSaveConfig = () => {
    const regenerated = exceptions.map(e =>
      e.isDayOff
        ? e
        : {
            ...e,
            slots: generateSlots(e.workStart ?? "09:00", e.workEnd ?? "17:00", breakTime)
              .map(({ start, end, active }) => ({ start, end, active })),
          },
    );
    setExceptions(regenerated);
    // Regenerated slots supersede earlier manual edits.
    saveConfig({ ...buildFullConfig(), exceptions: regenerated });
    notify("Availability config saved");
  };

  /* ---------- weekend enable/disable ---------- */
  const toggleWeekendDay = (dayOfWeek: number, enabled: boolean) => {
    const nextRules = weeklyRules.map(r =>
      r.dayOfWeek === dayOfWeek
        ? { ...r, isDayOff: !enabled, workStart: templateStart, workEnd: templateEnd }
        : r,
    );
    setWeeklyRules(nextRules);

    let nextExceptions = exceptions;
    if (!enabled) {
      // Turning the day OFF: mark this weekday's visible dates as day-off and clear slots.
      const offDates = getWeekDates(refDate)
        .filter(d => d.getDay() === dayOfWeek)
        .map(d => ({ date: formatDateKey(d), isDayOff: true }));
      nextExceptions = mergeExceptions(exceptions, offDates);
      setExceptions(nextExceptions);
    }
    saveConfig({ ...buildFullConfig(), weeklyRules: nextRules, exceptions: nextExceptions });
  };

  /* ---------- per-date exception building ---------- */
  const buildExceptionForDate = (date: Date): IException => {
    const dow = date.getDay();
    const inRange = isWithinWorkingWeek(dow, startDay, endDay);
    const weekendEnabled = !inRange && WEEKEND_DAYS.includes(dow)
      && weeklyRules.find(r => r.dayOfWeek === dow)?.isDayOff === false;
    const rule = weeklyRules.find(r => r.dayOfWeek === dow) ?? DEFAULT_WEEKLY_RULES[dow];
    const isDayOff = inRange ? false : !weekendEnabled;
    if (isDayOff) return { date: formatDateKey(date), isDayOff: true };
    const workStart = inRange ? templateStart : rule.workStart;
    const workEnd = inRange ? templateEnd : rule.workEnd;
    const slots = generateSlots(workStart, workEnd, breakTime)
      .map(({ start, end, active }) => ({ start, end, active }));
    return { date: formatDateKey(date), isDayOff: false, workStart, workEnd, slots };
  };

  const persistDates = (dates: Date[], successMsg: string) => {
    const newExceptions = dates.map(buildExceptionForDate);
    const merged = mergeExceptions(exceptions, newExceptions);
    setExceptions(merged);
    saveConfig({ ...buildFullConfig(), weeklyRules, exceptions: merged });
    notify(successMsg);
  };

  const handleApplyToDay = (date: Date) => persistDates([date], "Time slots applied to selected day");
  const handleApplyToWeek = () => persistDates(getWeekDates(refDate), "Time slots applied to current week");

  const handleApplyToMonth = () => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const isCurrentMonth =
      refDate.getFullYear() === today.getFullYear() && refDate.getMonth() === today.getMonth();
    const dates = getMonthDates(refDate).filter(d => !isCurrentMonth || d >= today);
    persistDates(dates, "Time slots applied to current month");
  };

  /* ---------- slot editor ---------- */
  const openSlotEditor = (dateKey: string, slot: TimeSlot) => {
    setEditingSlot({ dateKey, slot });
    setEditStart(slot.start);
    setEditEnd(slot.end);
    setEditActive(slot.active);
  };

  const saveSlotEdit = () => {
    if (!editingSlot) return;
    const { dateKey, slot } = editingSlot;
    const day = schedule[dateKey] || { dayOff: false, slots: [] };
    const updatedSlots = day.slots.map(s =>
      s.id === slot.id ? { ...s, start: editStart, end: editEnd, active: editActive } : s,
    );
    // The edit is written onto the date's exception below, which the derived
    // schedule reads back — no separate preview state needed.
    const plainSlots = updatedSlots.map(({ start, end, active }) => ({ start, end, active }));
    const prevExc = exceptions.find(e => e.date === dateKey);
    const workStart = prevExc?.workStart ?? updatedSlots[0]?.start;
    const workEnd = prevExc?.workEnd ?? updatedSlots[updatedSlots.length - 1]?.end;
    const merged = mergeExceptions(exceptions, [
      { date: dateKey, isDayOff: day.dayOff, workStart, workEnd, slots: plainSlots },
    ]);
    setExceptions(merged);
    saveConfig({ ...buildFullConfig(), exceptions: merged });
    setEditingSlot(null);
  };

  const getDaySchedule = (dateKey: string): DaySchedule =>
    schedule[dateKey] || { dayOff: false, slots: [] };

  const goPrevWeek = () => setRefDate(p => { const d = new Date(p); d.setDate(d.getDate() - 7); return d; });
  const goNextWeek = () => setRefDate(p => { const d = new Date(p); d.setDate(d.getDate() + 7); return d; });
  const goToday = () => setRefDate(new Date());

  return (
    <div className="space-y-8">
      {/* ── Config toolbar ─────────────────────────────────────────── */}
      <PageCard>
        <h2 className="mb-6 text-[26px] font-extrabold tracking-wide text-neutral-800 dark:text-white">
          Availability
        </h2>

        <div className="flex flex-wrap items-end gap-5">
          <SelectField label="Start Day" value={startDay} onChange={setStartDay} options={dayOptions} className="w-32" />
          <SelectField label="End Day" value={endDay} onChange={setEndDay} options={dayOptions} className="w-32" />

          <span className="mb-1 hidden h-11 w-px bg-neutral-200 lg:block dark:bg-white/10" />

          <SelectField
            label="Start Time" value={templateStart} options={startTimeOptions} className="w-32"
            onChange={v => {
              setTemplateStart(v);
              setWeeklyRules(prev => prev.map(r => (r.isDayOff ? r : { ...r, workStart: v })));
            }}
          />
          <SelectField
            label="End Time" value={templateEnd} options={timeOptions} className="w-32"
            onChange={v => {
              setTemplateEnd(v);
              setWeeklyRules(prev => prev.map(r => (r.isDayOff ? r : { ...r, workEnd: v })));
            }}
          />

          <div className="mb-1.5">
            <SwitchField checked={breakEnabled} onChange={setBreakEnabled} label="Break Time" />
          </div>

          {breakEnabled && (
            <>
              <SelectField label="Break Start" value={breakStart} onChange={setBreakStart} options={timeOptions} className="w-32" />
              <SelectField label="Break End" value={breakEnd} onChange={setBreakEnd} options={timeOptions} className="w-32" />
            </>
          )}
        </div>

        <div className="mt-7 border-t border-neutral-100 pt-6 dark:border-white/5">
          <div className="flex flex-wrap gap-4">
            <Btn onClick={handleApplyToWeek}>Apply to Current Week</Btn>
            <Btn onClick={handleApplyToMonth} variant="outline">Apply to Current Month</Btn>
            <Btn onClick={handleSaveConfig} tone="mint">Save Config</Btn>
          </div>
          <p className="mt-4 text-[13px] font-semibold text-neutral-400">
            Slots are {SLOT_MINUTES} minutes. Break-time slots stay listed but are marked unavailable.
          </p>
        </div>
      </PageCard>

      {/* ── Week grid ──────────────────────────────────────────────── */}
      <PageCard>
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={goPrevWeek} aria-label="Previous week"
              className="flex size-10 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white">
              <ChevronLeft className="size-5 rtl:rotate-180" />
            </button>
            <h3 className="text-xl font-extrabold text-neutral-800 dark:text-white">
              {weekDates[0].toLocaleDateString()} – {weekDates[6].toLocaleDateString()}
            </h3>
            <button onClick={goNextWeek} aria-label="Next week"
              className="flex size-10 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white">
              <ChevronRight className="size-5 rtl:rotate-180" />
            </button>
          </div>
          <Btn onClick={goToday} variant="ghost">Today</Btn>
        </div>

        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
          {weekDates.map(date => {
            const dateKey = formatDateKey(date);
            const dow = date.getDay();
            const rule = weeklyRules.find(r => r.dayOfWeek === dow) ?? DEFAULT_WEEKLY_RULES[dow];
            const exc = exceptions.find(e => e.date === dateKey);
            const { isDayOff, outsideRange } = resolveDay(date, weeklyRules, exceptions, startDay, endDay);
            const day = getDaySchedule(dateKey);
            // Only weekend days OUTSIDE the configured range get the Enable toggle.
            const isWeekend = WEEKEND_DAYS.includes(dow) && !isWithinWorkingWeek(dow, startDay, endDay);
            const weekendOn = isWeekend && rule.isDayOff === false;

            return (
              <div
                key={dateKey}
                className={`w-52 shrink-0 rounded-xl border border-neutral-200 p-4 transition-opacity dark:border-white/10 ${
                  outsideRange && !weekendOn ? "opacity-60" : ""
                }`}
              >
                <div className="text-[15px] font-extrabold text-neutral-800 dark:text-white">
                  {DAY_LABELS[dow]}
                </div>
                <div className="mt-0.5 text-xs font-semibold text-neutral-400">
                  {date.toLocaleDateString()}
                </div>

                {!outsideRange && (
                  <div className={`mt-1 text-xs font-bold ${exc ? "text-brand" : "text-neutral-400"}`}>
                    {exc
                      ? exc.isDayOff ? "Day Off" : `${exc.workStart} – ${exc.workEnd}`
                      : isDayOff ? "Day Off" : `${rule.workStart} – ${rule.workEnd}`}
                  </div>
                )}

                {isWeekend && (
                  <div className="mt-3">
                    <SwitchField
                      checked={weekendOn}
                      onChange={v => toggleWeekendDay(dow, v)}
                      label="Enable"
                    />
                  </div>
                )}

                {!isDayOff ? (
                  <>
                    <button
                      onClick={() => handleApplyToDay(date)}
                      className="mt-3 mb-2 text-[13px] font-extrabold text-brand transition-colors hover:underline"
                    >
                      Generate Slots
                    </button>
                    <div className="no-scrollbar max-h-96 space-y-1.5 overflow-y-auto">
                      {day.slots.length === 0 && (
                        <p className="text-xs font-semibold text-neutral-400">No slots</p>
                      )}
                      {day.slots.map(slot => (
                        <button
                          key={slot.id}
                          onClick={() => openSlotEditor(dateKey, slot)}
                          title={slot.active ? "Available — click to edit" : "Unavailable (break) — click to edit"}
                          className={`block w-full rounded-md px-3 py-1.5 text-center text-[13px] font-bold transition-transform active:scale-[0.98] ${
                            slot.active
                              ? "bg-mint text-emerald-900 hover:brightness-105"
                              : "border border-neutral-300 text-neutral-400 line-through dark:border-white/15"
                          }`}
                        >
                          {slot.start} – {slot.end}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="mt-4 text-sm font-bold text-neutral-400">Day Off</p>
                )}
              </div>
            );
          })}
        </div>
      </PageCard>

      {/* ── Slot editor ────────────────────────────────────────────── */}
      <Modal
        open={!!editingSlot}
        onClose={() => setEditingSlot(null)}
        title="Edit Slot"
        footer={
          <>
            <Btn onClick={() => setEditingSlot(null)} variant="ghost" tone="coral">Cancel</Btn>
            <Btn onClick={saveSlotEdit} tone="mint">Save</Btn>
          </>
        }
      >
        <div className="space-y-5">
          <SelectField label="Start Time" value={editStart} onChange={setEditStart} options={timeOptions} />
          <SelectField label="End Time" value={editEnd} onChange={setEditEnd} options={timeOptions} />
          <SwitchField checked={editActive} onChange={setEditActive} label="Active" />
        </div>
      </Modal>

      {/* ── Toast ──────────────────────────────────────────────────── */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-8 end-8 z-50 rounded-lg bg-neutral-800 px-6 py-4 text-[14px] font-bold text-white shadow-2xl dark:bg-neutral-700"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
