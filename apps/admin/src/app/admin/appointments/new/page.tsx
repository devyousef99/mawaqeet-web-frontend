"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { PageCard } from "@mawaqeet/ui/TableShell";
import { ActionBar } from "@mawaqeet/ui/ui";
import { CheckField, FormNotice, SelectField } from "@mawaqeet/ui/form";
import { useStore } from "@mawaqeet/ui/store";
import {
  services as seedServices, categoryOptions, dayOptions, approvalOptions, countOptions, timeSlots,
  type Service, type AppointmentPlan,
} from "@mawaqeet/data";

const SoftLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-3 text-lg font-bold text-neutral-400 sm:mb-4 sm:text-xl">{children}</div>
);

export default function CreateAppointments() {
  const router = useRouter();
  const svcStore = useStore<Service>("services", seedServices);
  const plans = useStore<AppointmentPlan>("appointmentPlans", []);

  const [category, setCategory] = useState("MASSAGE");
  const [service, setService] = useState("");
  const [employees, setEmployees] = useState(1);
  const [day, setDay] = useState("SUNDAY");
  const [approval, setApproval] = useState("FULL PAYMENT");
  const [slots, setSlots] = useState<string[]>(timeSlots);
  const [repeat, setRepeat] = useState({ week: false, month: false, year: false });
  const [notice, setNotice] = useState<{ kind: "error" | "success"; text: string } | null>(null);

  // Services filtered by the chosen category (falls back to all if none match).
  const serviceOptions = useMemo(() => {
    const inCat = svcStore.items.filter(s => s.type.toUpperCase() === category);
    return (inCat.length ? inCat : svcStore.items).map(s => ({ value: s.name, label: s.name.toUpperCase() }));
  }, [svcStore.items, category]);
  const selectedService = svcStore.items.find(s => s.name === service);
  const maxEmployees = selectedService?.employees ?? 30;

  const toggleSlot = (s: string, on: boolean) => setSlots(cur => (on ? [...cur, s].sort((a, b) => timeSlots.indexOf(a) - timeSlots.indexOf(b)) : cur.filter(x => x !== s)));
  const allOn = slots.length === timeSlots.length;

  const buildPlan = (): AppointmentPlan | string => {
    if (!service) return "Choose a service.";
    if (!slots.length) return "Select at least one appointment slot.";
    return {
      id: `${day}-${service}-${Date.now()}`,
      category, service, employees, day, approval, slots, repeat,
      createdAt: new Date().toISOString(),
    };
  };

  const saveDay = () => {
    const p = buildPlan();
    if (typeof p === "string") { setNotice({ kind: "error", text: p }); return; }
    plans.add(p);
    setNotice({ kind: "success", text: `Saved ${slots.length} slot(s) for ${day}. Pick another day or press SAVE to finish.` });
  };

  const finish = () => {
    if (!plans.items.length) {
      const p = buildPlan();
      if (typeof p === "string") { setNotice({ kind: "error", text: p }); return; }
      plans.add(p);
    }
    router.push("/admin/appointments");
  };

  return (
    <div className="space-y-6">
      <PageCard>
        <form onSubmit={e => { e.preventDefault(); finish(); }} noValidate>
          <h2 className="mb-8 text-2xl font-extrabold tracking-wide text-neutral-800 dark:text-white">Create Appointments</h2>

          {/* ---------- selectors ---------- */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <div className="min-w-0">
              <SoftLabel>Static Category</SoftLabel>
              <SelectField value={category} onChange={v => { setCategory(v); setService(""); setNotice(null); }} options={categoryOptions} tone="mint" center />
            </div>
            <div className="min-w-0 sm:col-span-2 xl:col-span-2">
              <SoftLabel>Defined Service</SoftLabel>
              <SelectField value={service} onChange={v => { setService(v); setNotice(null); }} options={serviceOptions} placeholder="SELECT A SERVICE" tone="mint" center />
            </div>
            <div className="min-w-0">
              <SoftLabel>Number of Employees</SoftLabel>
              <SelectField value={Math.min(employees, maxEmployees)} onChange={setEmployees} options={countOptions(maxEmployees)} tone="mint" center className="w-full sm:w-32" />
            </div>
            <div className="min-w-0">
              <SoftLabel>Day</SoftLabel>
              <SelectField value={day} onChange={v => { setDay(v); setNotice(null); }} options={dayOptions} tone="mint" center />
            </div>
            <div className="min-w-0">
              <SoftLabel>Approval Requirement</SoftLabel>
              <SelectField value={approval} onChange={setApproval} options={approvalOptions} tone="mint" center />
            </div>
          </div>

          {/* ---------- slot grid ---------- */}
          <div className="mt-10">
            <SoftLabel>Appointments by Defined Working Hours</SoftLabel>
            <div className="rounded-md border border-grape/40 p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
                {timeSlots.map(s => {
                  const on = slots.includes(s);
                  return (
                    <div key={s} className="flex flex-col items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleSlot(s, !on)}
                        aria-pressed={on}
                        className={`flex aspect-square w-full max-w-24 items-center justify-center rounded-full text-base font-bold text-white shadow-lg transition-all sm:text-lg ${on ? "" : "opacity-35 grayscale"}`}
                        style={{ background: "linear-gradient(180deg,#5a54d1 0%,#4aa08a 100%)" }}
                      >
                        {s}
                      </button>
                      <CheckField checked={on} onChange={v => toggleSlot(s, v)} />
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-8">
                <CheckField checked={allOn} onChange={v => setSlots(v ? [...timeSlots] : [])} label="Select All" />
                <CheckField checked={!slots.length} onChange={v => setSlots(v ? [] : [...timeSlots])} label="Deselect All" />
                <span className="text-sm font-semibold text-neutral-400 sm:ms-2">{slots.length} of {timeSlots.length} selected</span>
                <button
                  type="button"
                  onClick={saveDay}
                  className="h-12 rounded-lg bg-mint-deep px-8 text-base font-extrabold tracking-wider text-white shadow hover:brightness-105 active:scale-[0.98] sm:ms-auto"
                >
                  SAVE THE DAY
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-8">
              <CheckField checked={repeat.week} onChange={v => setRepeat(r => ({ ...r, week: v }))} label="Repeat for the week" />
              <CheckField checked={repeat.month} onChange={v => setRepeat(r => ({ ...r, month: v }))} label="Repeat for the month" />
              <CheckField checked={repeat.year} onChange={v => setRepeat(r => ({ ...r, year: v }))} label="Repeat for the year" />
            </div>
          </div>

          {notice && <FormNotice kind={notice.kind}>{notice.text}</FormNotice>}

          <ActionBar onCancel={() => router.push("/admin/appointments")} saveLabel="SAVE" />
        </form>
      </PageCard>

      {/* ---------- saved day plans (localStorage) ---------- */}
      {plans.items.length > 0 && (
        <PageCard>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 className="text-lg font-extrabold text-neutral-800 dark:text-white">Saved day plans <span className="ms-2 text-sm font-bold text-neutral-400">{plans.items.length}</span></h3>
            <button type="button" onClick={() => plans.reset()} className="text-sm font-bold text-neutral-400 hover:text-coral-deep">Clear all</button>
          </div>
          <ul className="divide-y divide-neutral-100 dark:divide-white/5">
            {plans.items.map(p => (
              <li key={p.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:gap-6">
                <span className="w-28 shrink-0 text-sm font-extrabold text-brand">{p.day}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-bold text-neutral-800 dark:text-neutral-100">{p.service}</span>
                  <span className="block text-xs font-semibold text-neutral-400">
                    {p.category} · {p.employees} employee(s) · {p.approval}
                    {p.repeat.week ? " · weekly" : ""}{p.repeat.month ? " · monthly" : ""}{p.repeat.year ? " · yearly" : ""}
                  </span>
                </span>
                <span className="flex flex-wrap gap-1">
                  {p.slots.map(s => <span key={s} className="rounded-full bg-mint/60 px-2 py-0.5 text-[11px] font-extrabold text-emerald-900 dark:bg-mint/20 dark:text-mint">{s}</span>)}
                </span>
                <button type="button" onClick={() => plans.remove(p.id)} aria-label="Delete plan" className="self-end rounded p-1 text-neutral-400 hover:text-coral-deep sm:self-auto"><Trash2 className="size-4" /></button>
              </li>
            ))}
          </ul>
        </PageCard>
      )}
    </div>
  );
}
