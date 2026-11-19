"use client";
import { useState, useSyncExternalStore } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageCard } from "@mawaqeet/ui/TableShell";
import { ActionBar, Avatar } from "@mawaqeet/ui/ui";
import { FormNotice, SelectField, TextField } from "@mawaqeet/ui/form";
import { GradientCard } from "@mawaqeet/ui/GradientCard";
import { EmployeePicker } from "@mawaqeet/ui/EmployeePicker";
import { useStore } from "@mawaqeet/ui/store";
import { appointments as seedAppointments, employees as seedEmployees, currencyOptions, type Appointment, type Employee } from "@mawaqeet/data";
import { CalendarCheck, ClipboardCheck, PlusCircle, AlarmClockCheck, Star } from "lucide-react";

type AppointmentRecord = Appointment & Partial<{ desc: string; discount: string; currency: string; employeeId: number }>;

const steps = [
  { Icon: PlusCircle, label: "Appointment Created", when: "1/1/2023 · 09:00 AM", done: true },
  { Icon: AlarmClockCheck, label: "Reminder Was Sent", when: "12-01-2023 · 11:34 PM", done: true },
  { Icon: CalendarCheck, label: "Customer Verified", when: "13-01-2023 · 11:34 PM", done: true },
  { Icon: ClipboardCheck, label: "Appointment Closed", when: "13-01-2023 · 11:34 PM", done: true, current: true },
  { Icon: Star, label: "Rating", when: "Pending", done: false },
];

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-3 text-[14px] font-bold uppercase tracking-wide text-neutral-700 dark:text-neutral-300">{children}</div>
);
const SoftLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-3 text-lg font-bold text-neutral-400 sm:text-xl">{children}</div>
);

/** Live clock without setState-in-effect: subscribe to a 1s ticker. */
function useNow() {
  return useSyncExternalStore(
    cb => { const t = setInterval(cb, 1000); return () => clearInterval(t); },
    () => Math.floor(Date.now() / 1000),
    () => 0,
  );
}
const fmt = (d: Date) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function AppointmentDetail() {
  const router = useRouter();
  const { id: rawId } = useParams<{ id: string }>();
  const id = `#${rawId}`;
  const store = useStore<AppointmentRecord>("appointments", seedAppointments);
  const empStore = useStore<Employee>("employees", seedEmployees);
  const rec = store.get(id);
  const now = useNow();

  type Draft = { service: string; desc: string; price: string; currency: string; discount: string; employeeId: number };
  const [edited, setEdited] = useState<Draft | null>(null);
  const d: Draft = edited ?? {
    service: rec?.service ?? "", desc: rec?.desc ?? "1 hour full body massaging includes feet, hand and neck with a Thailand way therapy",
    price: rec ? String(parseFloat(rec.price) || "") : "", currency: rec?.currency ?? "SR", discount: rec?.discount ?? "",
    employeeId: rec?.employeeId ?? empStore.items[0]?.id ?? 1,
  };
  const patch = (p: Partial<Draft>) => { setEdited({ ...d, ...p }); setNotice(null); };
  const [notice, setNotice] = useState<{ kind: "error" | "success"; text: string } | null>(null);

  const assigned = empStore.items.find(e => e.id === d.employeeId);
  // Demo: the appointment is 45 minutes from "now".
  const apptAt = now ? new Date((now + 45 * 60) * 1000) : null;
  const remaining = apptAt && now ? Math.max(0, Math.floor(apptAt.getTime() / 1000) - now) : 0;
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0"), ss = String(remaining % 60).padStart(2, "0");

  if (store.ready && !rec) {
    return (
      <PageCard>
        <h2 className="text-xl font-extrabold">Appointment {id} not found</h2>
        <p className="mt-2 text-sm font-semibold text-neutral-400">It may have been cancelled from the local demo data.</p>
        <ActionBar cancelLabel="BACK" onCancel={() => router.push("/admin/appointments")} saveLabel="CREATE NEW" onSave={() => router.push("/admin/appointments/new")} />
      </PageCard>
    );
  }

  const save = () => {
    if (!d.service.trim()) return setNotice({ kind: "error", text: "Service name is required." });
    if (!d.price || Number(d.price) <= 0) return setNotice({ kind: "error", text: "Enter a price greater than 0." });
    store.update(id, { service: d.service.trim(), desc: d.desc, price: `${d.price} ${d.currency === "SR" ? "S.R" : d.currency}`, currency: d.currency, discount: d.discount, employeeId: d.employeeId });
    setNotice({ kind: "success", text: "Appointment updated." });
    setTimeout(() => router.push("/admin/appointments"), 400);
  };
  const cancel = () => {
    if (!window.confirm(`Cancel appointment ${id}?`)) return;
    store.remove(id);
    router.push("/admin/appointments");
  };

  return (
    <PageCard>
      <form onSubmit={e => { e.preventDefault(); save(); }} noValidate>
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(300px,380px)_minmax(0,1fr)] xl:gap-14">
          {/* ---------- left: booking card + editable service ---------- */}
          <div className="min-w-0">
            <GradientCard className="mb-8 w-full">
              <div className="mb-3 flex justify-end gap-1 text-[11px] font-extrabold">
                <span className="rounded-s bg-[#e858a8] px-2 py-1">{(rec?.type ?? "").toUpperCase()}</span>
                <span className="rounded-e bg-[#e858a8]/80 px-2 py-1">{(rec?.branch ?? "").toUpperCase()}</span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <div className="shrink-0 rounded border border-white/70 p-2 text-xs font-bold">
                  {rec?.id}
                  <div className="mt-1 max-w-28 border border-white/60 p-1 text-[9px] font-semibold leading-tight">Branch : King fahad, abdulrahman ibn saad al hosainy</div>
                </div>
                <div className="min-w-0 text-end">
                  <div className="break-words border-b border-white/70 pb-1 text-lg font-bold sm:text-xl">{rec?.customer}</div>
                  <div className="mt-2 text-base font-bold sm:text-lg">{rec?.number}</div>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
                <div className="rounded border border-white/70 p-2 text-[12px] font-extrabold uppercase leading-relaxed">{d.service}</div>
                <div className="flex flex-wrap gap-2 text-[13px] font-bold">
                  <span className="rounded border border-white/70 px-2 py-1">{rec?.time}</span>
                  <span className="rounded border border-white/70 px-2 py-1">{d.price} {d.currency}</span>
                </div>
              </div>
            </GradientCard>

            <Label>Service name</Label>
            <TextField value={d.service} onChange={v => patch({ service: v })} className="mb-8" />
            <Label>Service description</Label>
            <textarea
              value={d.desc}
              onChange={e => patch({ desc: e.target.value })}
              className="mb-8 h-36 w-full resize-none rounded-3xl bg-fog p-6 text-[14px] font-bold uppercase leading-relaxed text-neutral-700 outline-none focus:ring-2 focus:ring-brand/50 dark:bg-white/10 dark:text-neutral-200"
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-1">
              <div>
                <SoftLabel>Price</SoftLabel>
                <div className="flex items-center gap-3">
                  <TextField type="number" min={0} value={d.price} onChange={v => patch({ price: v })} variant="box" center className="min-w-0 flex-1" />
                  <SelectField value={d.currency} onChange={v => patch({ currency: v })} options={currencyOptions} tone="mint" className="w-24 shrink-0" />
                </div>
              </div>
              <div>
                <SoftLabel>Discount Price</SoftLabel>
                <div className="flex items-center gap-3">
                  <TextField type="number" min={0} value={d.discount} onChange={v => patch({ discount: v })} variant="box" center className="min-w-0 flex-1" />
                  <SelectField value={d.currency} onChange={v => patch({ currency: v })} options={currencyOptions} tone="mint" className="w-24 shrink-0" />
                </div>
              </div>
            </div>
          </div>

          {/* ---------- right: timeline, assignment, timers ---------- */}
          <div className="min-w-0">
            <SoftLabel>Progress</SoftLabel>
            {/* Timeline scrolls inside its own box on narrow screens instead of widening the page. */}
            <div className="-mx-2 overflow-x-auto px-2 pb-2">
              <ol className="grid min-w-[640px] grid-cols-5">
                {steps.map(({ Icon, label, when, done, current }, i) => (
                  <li key={label} className="relative flex flex-col items-center px-1 text-center">
                    {i < steps.length - 1 && (
                      <span className={`absolute top-8 h-1 w-full ltr:left-1/2 rtl:right-1/2 ${steps[i + 1].done ? "bg-brand" : "bg-neutral-300 dark:bg-white/15"}`} aria-hidden />
                    )}
                    <span className={`relative z-10 flex size-16 items-center justify-center rounded-full ring-4 ring-white dark:ring-night-2 ${
                      current ? "bg-[#67b7c4] text-white" : done ? "bg-brand-soft text-teal-900 dark:bg-brand/25 dark:text-brand" : "bg-neutral-100 text-neutral-400 dark:bg-white/10"
                    }`}>
                      <Icon className="size-7" strokeWidth={1.7} />
                    </span>
                    <span className={`mt-3 text-[13px] font-bold leading-tight ${done ? "text-neutral-800 dark:text-neutral-100" : "text-neutral-400"}`}>{label}</span>
                    <span className="mt-1 text-[11px] font-semibold text-neutral-400">{when}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-[auto_1fr] md:items-center md:gap-10">
              <div className="flex items-center gap-4 md:flex-col md:text-center">
                <Avatar name={assigned?.name ?? "?"} size={84} dot={assigned?.dot} />
                <div>
                  <div className="text-sm font-bold text-neutral-400">Assigned Employee</div>
                  <div className="text-lg font-extrabold text-neutral-800 dark:text-neutral-100">{assigned?.name ?? "—"}</div>
                  <div className="text-xs font-semibold uppercase text-neutral-400">{assigned?.job}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-neutral-200 p-4 dark:border-white/10">
                  <div className="text-sm font-bold text-neutral-400">Timer till appointment</div>
                  <div className="mt-1 font-mono text-3xl font-extrabold tabular-nums text-neutral-800 dark:text-neutral-100">
                    {mm}:<span className="text-emerald-400">{ss}</span>
                  </div>
                  <div className="text-xs font-semibold text-neutral-400">at {apptAt ? fmt(apptAt) : "--:--"}</div>
                </div>
                <div className="rounded-xl border border-neutral-200 p-4 dark:border-white/10">
                  <div className="text-sm font-bold text-neutral-400">Current time</div>
                  <div className="mt-1 font-mono text-3xl font-extrabold tabular-nums text-neutral-800 dark:text-neutral-100">{now ? fmt(new Date(now * 1000)) : "--:--"}</div>
                  <div className="text-xs font-semibold text-neutral-400">{rec?.time}</div>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <SoftLabel>Re-Assign Employee</SoftLabel>
              <EmployeePicker list={empStore.items} value={[d.employeeId]} onChange={ids => { const next = ids.find(i => i !== d.employeeId) ?? d.employeeId; patch({ employeeId: next }); }} />
            </div>
          </div>
        </div>

        {notice && <FormNotice kind={notice.kind}>{notice.text}</FormNotice>}
        <ActionBar remove removeLabel="CANCEL APPOINTMENT" onCancel={() => router.push("/admin/appointments")} onRemove={cancel} saveLabel="UPDATE" />
      </form>
    </PageCard>
  );
}
