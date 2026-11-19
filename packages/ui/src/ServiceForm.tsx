"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PageCard } from "./TableShell";
import { ActionBar, UploadBox } from "./ui";
import { DayToggle, FormNotice, SelectField, TextField } from "./form";
import { GradientCard } from "./GradientCard";
import { EmployeePicker } from "./EmployeePicker";
import { ServiceIcon } from "./ServiceIcon";
import { useStore, nextNumericId } from "./store";
import {
  services as seedServices, employees as seedEmployees, days, serviceTypeOptions, currencyOptions,
  durationUnitOptions, hourOptions, meridiemOptions, countOptions, serviceIconOptions, type Service, type Employee,
} from "@mawaqeet/data";

/** Seed shape + the extra fields this form captures. */
export type ServiceRecord = Service & Partial<{
  currency: string;
  discount: string;
  discountCurrency: string;
  logo: string;
  days: string[];
  fromH: number; fromM: string; toH: number; toM: string;
  employeeIds: number[];
}>;

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-3 text-[14px] font-bold uppercase tracking-wide text-neutral-700 dark:text-neutral-300">{children}</div>
);
const SoftLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-3 text-lg font-bold text-neutral-400 sm:text-xl">{children}</div>
);

type Draft = {
  name: string; desc: string; price: string; currency: string; discount: string; discountCurrency: string; logo: string;
  days: Record<string, boolean>; fromH: number; fromM: string; toH: number; toM: string;
  type: string; slot: string; slotUnit: string; employeesNum: number; employeeIds: number[]; icon: string;
};

const emptyDraft = (): Draft => ({
  name: "", desc: "", price: "", currency: "SR", discount: "", discountCurrency: "SR", logo: "",
  days: Object.fromEntries(days.map(d => [d, true])), fromH: 10, fromM: "AM", toH: 10, toM: "PM",
  type: "", slot: "45", slotUnit: "MINUTES", employeesNum: 1, employeeIds: [], icon: "massage",
});

const fromRecord = (s: ServiceRecord): Draft => ({
  name: s.name, desc: s.desc, price: String(parseFloat(s.price) || ""), currency: s.currency ?? "SR",
  discount: s.discount ?? "", discountCurrency: s.discountCurrency ?? "SR", logo: s.logo ?? "",
  days: Object.fromEntries(days.map(d => [d, s.days ? s.days.includes(d) : true])),
  fromH: s.fromH ?? 10, fromM: s.fromM ?? "AM", toH: s.toH ?? 11, toM: s.toM ?? "PM",
  type: s.type.toUpperCase(), slot: String(parseFloat(s.slot) || 45), slotUnit: s.slotUnit, employeesNum: s.employees,
  employeeIds: s.employeeIds ?? [], icon: s.icon,
});

/**
 * Create (blank) / edit (id) a service. Persists to the localStorage store and
 * returns to the zone's services list. Zone prefix (/admin or /provider) is
 * taken from the current URL so the same form serves both apps.
 */
export function ServiceForm({ blank, id: idProp }: { blank?: boolean; id?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const zone = `/${pathname.split("/")[1] || "admin"}`;
  const store = useStore<ServiceRecord>("services", seedServices);
  const empStore = useStore<Employee>("employees", seedEmployees);
  // Zones that render <ServiceForm /> without an id get the first record (demo).
  const id = idProp ?? String(store.items[0]?.id ?? 1);

  // The draft is derived from the stored record until the user's first edit,
  // so edit mode needs no "copy the record into state" effect.
  const record = blank ? undefined : store.get(Number(id));
  const [edited, setEdited] = useState<Draft | null>(null);
  const d: Draft = edited ?? (record ? fromRecord(record) : emptyDraft());
  const [notice, setNotice] = useState<{ kind: "error" | "success"; text: string } | null>(null);
  const patch = (p: Partial<Draft>) => { setEdited({ ...d, ...p }); setNotice(null); };

  const missing = !blank && store.ready && !record;

  const validate = () => {
    if (!d.name.trim()) return "Service name is required.";
    if (!d.type) return "Choose a type of service.";
    if (!d.price || Number(d.price) <= 0) return "Enter a price greater than 0.";
    if (d.discount && Number(d.discount) >= Number(d.price)) return "Discount price must be lower than the price.";
    if (!Object.values(d.days).some(Boolean)) return "Turn on at least one working day.";
    if (!d.employeeIds.length) return "Select at least one employee.";
    return null;
  };

  const save = () => {
    const err = validate();
    if (err) { setNotice({ kind: "error", text: err }); return; }
    const rec: ServiceRecord = {
      id: blank ? nextNumericId(store.items) : Number(id),
      name: d.name.trim(), desc: d.desc.trim(),
      type: d.type.charAt(0) + d.type.slice(1).toLowerCase(),
      employees: d.employeesNum, slot: d.slot, slotUnit: d.slotUnit,
      hours: `${d.fromH} ${d.fromM} - ${d.toH} ${d.toM}`,
      price: `${d.price} ${d.currency === "SR" ? "S.R" : d.currency}`,
      icon: d.icon, dot: "green",
      currency: d.currency, discount: d.discount, discountCurrency: d.discountCurrency, logo: d.logo,
      days: days.filter(x => d.days[x]), fromH: d.fromH, fromM: d.fromM, toH: d.toH, toM: d.toM, employeeIds: d.employeeIds,
    };
    store.upsert(rec);
    setNotice({ kind: "success", text: blank ? "Service created." : "Service updated." });
    setTimeout(() => router.push(`${zone}/services`), 400);
  };

  const remove = () => {
    if (!window.confirm(`Remove "${d.name}"? This only affects the local demo data.`)) return;
    store.remove(Number(id));
    router.push(`${zone}/services`);
  };

  if (missing) {
    return (
      <PageCard>
        <h2 className="text-xl font-extrabold">Service not found</h2>
        <p className="mt-2 text-sm font-semibold text-neutral-400">It may have been deleted from the local demo data.</p>
        <ActionBar cancelLabel="BACK" onCancel={() => router.push(`${zone}/services`)} saveLabel="CREATE NEW" onSave={() => router.push(`${zone}/services/new`)} />
      </PageCard>
    );
  }

  return (
    <PageCard>
      <form onSubmit={e => { e.preventDefault(); save(); }} noValidate>
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(300px,380px)_1fr] xl:gap-14">
          {/* ---------- left column ---------- */}
          <div className="min-w-0">
            {!blank && (
              <GradientCard className="mb-8 w-full">
                <div className="flex items-start gap-4">
                  <ServiceIcon kind={d.icon} size={52} />
                  <div className="min-w-0">
                    <div className="truncate border-b border-white/60 pb-2 text-xl font-bold">{d.name || "Untitled service"}</div>
                    <p className="mt-3 line-clamp-3 text-[13px] font-semibold leading-relaxed text-white/90">{d.desc}</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <span className="truncate text-lg font-bold tracking-widest">{d.type || "—"}</span>
                  <span className="shrink-0 rounded-lg border-2 border-white/80 px-4 py-1 text-lg font-bold">{d.price || "0"} {d.currency}</span>
                </div>
              </GradientCard>
            )}

            <Label>Service name</Label>
            <TextField value={d.name} onChange={v => patch({ name: v })} placeholder="ENTER SERVICE NAME" className="mb-8" required />

            <Label>Service description</Label>
            <textarea
              value={d.desc}
              onChange={e => patch({ desc: e.target.value })}
              placeholder="ENTER A DESCRIPTION OF SERVICE"
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
                  <SelectField value={d.discountCurrency} onChange={v => patch({ discountCurrency: v })} options={currencyOptions} tone="mint" className="w-24 shrink-0" />
                </div>
              </div>
            </div>
          </div>

          {/* ---------- right column ---------- */}
          <div className="min-w-0">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="sm:order-2"><UploadBox label="UPLOAD SERVICE LOGO" value={d.logo} onChange={v => patch({ logo: v })} /></div>
              <div className="sm:order-1">
                <Label>Icon</Label>
                <div className="flex flex-wrap gap-2">
                  {serviceIconOptions.map(o => (
                    <button key={o.value} type="button" onClick={() => patch({ icon: o.value })} aria-label={o.label}
                      className={`rounded-full p-0.5 transition-shadow ${d.icon === o.value ? "ring-4 ring-brand/40" : "opacity-70 hover:opacity-100"}`}>
                      <ServiceIcon kind={o.value} size={40} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_auto] lg:gap-10">
              <div>
                <Label>Working days</Label>
                <div className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4">
                  {days.map(day => (
                    <div key={day} className="min-w-0">
                      <div className="mb-2 truncate text-xs font-bold text-neutral-600 dark:text-neutral-300">{day}</div>
                      <DayToggle on={d.days[day]} onChange={on => patch({ days: { ...d.days, [day]: on } })} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:w-72">
                <h3 className="mb-4 text-xl font-bold text-neutral-400 sm:text-2xl">Working Hours</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-12 shrink-0 text-lg font-semibold text-neutral-400">From</span>
                    <SelectField value={d.fromH} onChange={v => patch({ fromH: v })} options={hourOptions} tone="mint" center className="flex-1" />
                    <SelectField value={d.fromM} onChange={v => patch({ fromM: v })} options={meridiemOptions} tone="mint" center className="flex-1" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-12 shrink-0 text-lg font-semibold text-neutral-400">To</span>
                    <SelectField value={d.toH} onChange={v => patch({ toH: v })} options={hourOptions} tone="mint" center className="flex-1" />
                    <SelectField value={d.toM} onChange={v => patch({ toM: v })} options={meridiemOptions} tone="mint" center className="flex-1" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="min-w-0">
                <SoftLabel>Type of service</SoftLabel>
                <SelectField value={d.type} onChange={v => patch({ type: v })} options={serviceTypeOptions} placeholder="SELECT" tone="mint" center />
              </div>
              <div className="min-w-0">
                <SoftLabel>Time Slot</SoftLabel>
                <div className="flex gap-3">
                  <SelectField value={Number(d.slot) || 1} onChange={v => patch({ slot: String(v) })} options={countOptions(d.slotUnit === "HOURS" ? 12 : 180, d.slotUnit === "HOURS" ? 1 : 5).filter(o => d.slotUnit === "HOURS" || o.value % 5 === 0)} tone="mint" center className="w-24 shrink-0" />
                  <SelectField value={d.slotUnit} onChange={v => patch({ slotUnit: v, slot: v === "HOURS" ? "1" : "45" })} options={durationUnitOptions} tone="mint" center className="min-w-0 flex-1" />
                </div>
              </div>
              <div className="min-w-0">
                <SoftLabel>Employees Num</SoftLabel>
                <SelectField value={d.employeesNum} onChange={v => patch({ employeesNum: v })} options={countOptions(30)} tone="mint" center className="w-28" />
              </div>
            </div>

            <div className="mt-10">
              <SoftLabel>Select Employees</SoftLabel>
              <EmployeePicker list={empStore.items} value={d.employeeIds} onChange={ids => patch({ employeeIds: ids })} max={d.employeesNum} />
            </div>
          </div>
        </div>

        {notice && <FormNotice kind={notice.kind}>{notice.text}</FormNotice>}

        <ActionBar
          remove={!blank}
          removeLabel="REMOVE SERVICE"
          onCancel={() => router.push(`${zone}/services`)}
          onRemove={remove}
          saveLabel={blank ? "SAVE" : "UPDATE"}
        />
      </form>
    </PageCard>
  );
}
