"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PageCard } from "./TableShell";
import { ActionBar, Avatar, UploadBox } from "./ui";
import { DayToggle, FormNotice, SelectField, TextField } from "./form";
import { GradientCard } from "./GradientCard";
import { useStore, nextNumericId } from "./store";
import { days, employees as seedEmployees, jobOptions, workingStatusOptions, type Employee, type Status } from "@mawaqeet/data";

export type EmployeeRecord = Employee & Partial<{
  number: string;
  photo: string;
  schedule: Record<string, { on: boolean; from: string; to: string }>;
}>;

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-3 text-[14px] font-bold uppercase tracking-wide text-neutral-700 dark:text-neutral-300">{children}</div>
);

const statusDot: Record<string, Status> = { AVAILABLE: "green", VACATION: "yellow", WORKING: "red", BOOKED: "yellow" };
const title = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

type Draft = {
  name: string; job: string; status: string; number: string; photo: string;
  schedule: Record<string, { on: boolean; from: string; to: string }>;
};
const defaultSchedule = () => Object.fromEntries(days.map(d => [d, { on: true, from: "10:00", to: "22:00" }]));
const emptyDraft = (): Draft => ({ name: "", job: "", status: "AVAILABLE", number: "", photo: "", schedule: defaultSchedule() });
const fromRecord = (e: EmployeeRecord): Draft => ({
  name: e.name, job: e.job.toUpperCase(), status: e.status.toUpperCase(), number: e.number ?? String(e.id), photo: e.photo ?? "",
  schedule: e.schedule ?? defaultSchedule(),
});

function TimeBox({ value, onChange, active }: { value: string; onChange: (v: string) => void; active: boolean }) {
  return (
    <input
      type="time"
      value={value}
      disabled={!active}
      onChange={e => onChange(e.target.value)}
      className={`h-11 w-full rounded border text-center text-base font-bold outline-none focus:ring-2 focus:ring-brand/50 ${
        active
          ? "border-teal-400 bg-gradient-to-b from-teal-50 to-white text-neutral-700 dark:from-teal-900/30 dark:to-transparent dark:text-neutral-200"
          : "border-neutral-300 text-neutral-400 shadow-inner dark:border-white/15 dark:bg-transparent"
      }`}
    />
  );
}

/** Create (blank) / edit (id) an employee — persisted to the localStorage store. */
export function EmployeeForm({ blank, id: idProp }: { blank?: boolean; id?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const zone = `/${pathname.split("/")[1] || "admin"}`;
  const store = useStore<EmployeeRecord>("employees", seedEmployees);
  const id = idProp ?? String(store.items[0]?.id ?? 1);

  const record = blank ? undefined : store.get(Number(id));
  const [edited, setEdited] = useState<Draft | null>(null);
  const d: Draft = edited ?? (record ? fromRecord(record) : emptyDraft());
  const [notice, setNotice] = useState<{ kind: "error" | "success"; text: string } | null>(null);
  const patch = (p: Partial<Draft>) => { setEdited({ ...d, ...p }); setNotice(null); };
  const patchDay = (day: string, p: Partial<Draft["schedule"][string]>) =>
    patch({ schedule: { ...d.schedule, [day]: { ...d.schedule[day], ...p } } });

  const save = () => {
    if (!d.name.trim()) return setNotice({ kind: "error", text: "Employee name is required." });
    if (!d.job) return setNotice({ kind: "error", text: "Choose a job description." });
    const existing = record;
    const rec: EmployeeRecord = {
      id: blank ? nextNumericId(store.items) : Number(id),
      name: d.name.trim(), job: title(d.job), status: title(d.status), dot: statusDot[d.status] ?? "green",
      rating: existing?.rating ?? 5, ratingColor: existing?.ratingColor ?? "#10b981",
      number: d.number, photo: d.photo, schedule: d.schedule,
    };
    store.upsert(rec);
    setNotice({ kind: "success", text: blank ? "Employee added." : "Employee updated." });
    setTimeout(() => router.push(`${zone}/employees`), 400);
  };

  const remove = () => {
    if (!window.confirm(`Remove ${d.name}?`)) return;
    store.remove(Number(id));
    router.push(`${zone}/employees`);
  };

  return (
    <PageCard>
      <form onSubmit={e => { e.preventDefault(); save(); }} noValidate>
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(280px,360px)_1fr] xl:gap-14">
          <div className="min-w-0">
            {!blank && (
              <GradientCard className="mb-10 w-full">
                <div className="flex items-center gap-4">
                  <Avatar name={d.name || "?"} size={72} />
                  <div className="min-w-0">
                    <div className="truncate border-b border-white/60 pb-1 text-2xl font-bold">{d.name || "Unnamed"}</div>
                    <div className="mt-2 flex items-center gap-2 text-sm font-bold tracking-wider"><span className="size-2.5 rounded-full bg-white/70" /> {d.status}</div>
                  </div>
                </div>
                <div className="mt-8 flex items-center justify-between">
                  <span className="text-lg font-bold tracking-widest">{d.job || "—"}</span>
                  <span className="rounded-lg border-2 border-white/80 px-6 py-1 text-lg font-bold">{record?.rating ?? "—"}</span>
                </div>
              </GradientCard>
            )}

            <Label>Name</Label>
            <TextField value={d.name} onChange={v => patch({ name: v })} placeholder="ENTER EMPLOYEE NAME" center className="mb-8" />
            <Label>Job description</Label>
            <SelectField value={d.job} onChange={v => patch({ job: v })} options={jobOptions} placeholder="SELECT" center className="mb-8" />
            <Label>Working status</Label>
            <SelectField value={d.status} onChange={v => patch({ status: v })} options={workingStatusOptions} center className="mb-8" />
            <Label>Employee number</Label>
            <TextField value={d.number} onChange={v => patch({ number: v })} placeholder="0" type="number" min={0} center />
          </div>

          <div className="min-w-0">
            <div className="mb-8 flex justify-start lg:justify-end"><UploadBox label="UPLOAD EMPLOYEE IMAGE" value={d.photo} onChange={v => patch({ photo: v })} /></div>
            <Label>Weekly schedule</Label>
            <div className="space-y-4">
              {days.map(day => {
                const s = d.schedule[day];
                return (
                  <div key={day} className="grid grid-cols-1 items-end gap-3 rounded-lg border border-neutral-100 p-3 sm:grid-cols-[minmax(140px,200px)_1fr] sm:gap-6 dark:border-white/5">
                    <div>
                      <div className="mb-2 text-xs font-bold text-neutral-600 dark:text-neutral-300">{day}</div>
                      <DayToggle on={s.on} onChange={on => patchDay(day, { on })} />
                    </div>
                    <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
                      <div>
                        <div className="mb-2 text-xs font-bold text-neutral-600 dark:text-neutral-300">FROM</div>
                        <TimeBox value={s.from} onChange={v => patchDay(day, { from: v })} active={s.on} />
                      </div>
                      <span className="mb-5 h-0.5 w-6 bg-neutral-800 dark:bg-neutral-300" />
                      <div>
                        <div className="mb-2 text-xs font-bold text-neutral-600 dark:text-neutral-300">TO</div>
                        <TimeBox value={s.to} onChange={v => patchDay(day, { to: v })} active={s.on} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {notice && <FormNotice kind={notice.kind}>{notice.text}</FormNotice>}
        <ActionBar remove={!blank} removeLabel="REMOVE EMPLOYEE" onCancel={() => router.push(`${zone}/employees`)} onRemove={remove} saveLabel={blank ? "SAVE" : "UPDATE"} />
      </form>
    </PageCard>
  );
}
