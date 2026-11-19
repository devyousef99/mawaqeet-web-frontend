"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PageCard } from "./TableShell";
import { ActionBar } from "./ui";
import { FormNotice, SelectField, SwitchField, TextField } from "./form";
import { ServiceIcon } from "./ServiceIcon";
import { CheckField } from "./form";
import { useStore } from "./store";
import { promotions as seedPromotions, services as seedServices, categoryOptions, branchOptions, type Promotion, type Service } from "@mawaqeet/data";

export type PromotionRecord = Promotion & { id: string };
export const seedPromotionRecords: PromotionRecord[] = seedPromotions.map(p => ({ ...p, id: p.name }));

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-3 text-[14px] font-bold uppercase tracking-wide text-neutral-700 dark:text-neutral-300">{children}</div>
);

/* dd/mm/yyyy <-> yyyy-mm-dd (for <input type="date">) */
const toIso = (s: string) => { const [d, m, y] = s.split("/"); return d && m && y ? `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}` : ""; };
const fromIso = (s: string) => { const [y, m, d] = s.split("-"); return d && m && y ? `${d}/${m}/${y}` : ""; };

type Draft = { name: string; category: string; branch: string; capacity: string; on: boolean; service: string; start: string; end: string };
const emptyDraft = (): Draft => ({ name: "", category: "", branch: "MEDINA", capacity: "", on: false, service: "", start: "", end: "" });
const fromRecord = (p: PromotionRecord): Draft => ({
  name: p.name, category: p.category.toUpperCase(), branch: p.branch.toUpperCase(), capacity: String(p.capacity), on: p.on,
  service: p.service, start: toIso(p.start), end: toIso(p.end),
});

/** Create (blank) / edit (id = promo name) a promotion — persisted to the localStorage store. */
export function PromoForm({ blank, id: idProp }: { blank?: boolean; id?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const zone = `/${pathname.split("/")[1] || "admin"}`;
  const store = useStore<PromotionRecord>("promotions", seedPromotionRecords);
  const svcStore = useStore<Service>("services", seedServices);
  const id = idProp ? decodeURIComponent(idProp) : store.items[0]?.id ?? "";

  const record = blank ? undefined : store.get(id);
  const [edited, setEdited] = useState<Draft | null>(null);
  const d: Draft = edited ?? (record ? fromRecord(record) : emptyDraft());
  const [notice, setNotice] = useState<{ kind: "error" | "success"; text: string } | null>(null);
  const patch = (p: Partial<Draft>) => { setEdited({ ...d, ...p }); setNotice(null); };

  const inCategory = svcStore.items.filter(s => !d.category || s.type.toUpperCase() === d.category);
  const serviceList = inCategory.length ? inCategory : svcStore.items;

  const save = () => {
    if (!d.name.trim()) return setNotice({ kind: "error", text: "Promocode name is required." });
    if (!d.category) return setNotice({ kind: "error", text: "Select a category." });
    if (!d.service) return setNotice({ kind: "error", text: "Select the defined service." });
    if (!d.capacity || Number(d.capacity) <= 0) return setNotice({ kind: "error", text: "Capacity must be greater than 0." });
    if (!d.start || !d.end) return setNotice({ kind: "error", text: "Set a start and an end date." });
    if (d.end < d.start) return setNotice({ kind: "error", text: "End date must be after the start date." });
    const svc = svcStore.items.find(s => s.name === d.service);
    const existing = record;
    const newId = d.name.trim().toUpperCase();
    if (blank && store.items.some(p => p.id === newId)) return setNotice({ kind: "error", text: "A promotion with this name already exists." });
    const rec: PromotionRecord = {
      id: blank ? newId : id,
      name: blank ? newId : d.name.trim().toUpperCase(),
      start: fromIso(d.start), end: fromIso(d.end), service: d.service, icon: svc?.icon ?? "massage",
      category: d.category.charAt(0) + d.category.slice(1).toLowerCase(), branch: d.branch.charAt(0) + d.branch.slice(1).toLowerCase(),
      capacity: Number(d.capacity), available: existing?.available ?? Number(d.capacity), on: d.on, dot: d.on ? "green" : "red",
    };
    store.upsert(rec);
    setNotice({ kind: "success", text: blank ? "Promotion created." : "Promotion updated." });
    setTimeout(() => router.push(`${zone}/promotions`), 400);
  };

  const remove = () => {
    if (!window.confirm(`Remove promotion ${d.name}?`)) return;
    store.remove(id);
    router.push(`${zone}/promotions`);
  };

  return (
    <PageCard>
      <form onSubmit={e => { e.preventDefault(); save(); }} noValidate>
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(280px,340px)_1fr] xl:gap-14">
          <div className="min-w-0">
            <Label>Promocode name</Label>
            <TextField value={d.name} onChange={v => patch({ name: v })} placeholder="ENTER PROMOCODE NAME" center className="mb-8" />
            <Label>Select category</Label>
            <SelectField value={d.category} onChange={v => patch({ category: v, service: "" })} options={categoryOptions} placeholder="SELECT" center className="mb-8" />
            <Label>Branch</Label>
            <SelectField value={d.branch} onChange={v => patch({ branch: v })} options={branchOptions} center className="mb-8" />
            <Label>Capacity</Label>
            <TextField type="number" min={1} value={d.capacity} onChange={v => patch({ capacity: v })} placeholder="0" center className="mb-8" />
            <Label>Status</Label>
            <SwitchField checked={d.on} onChange={on => patch({ on })} label={d.on ? "ACTIVE" : "INACTIVE"} />
          </div>

          <div className="min-w-0">
            <h3 className="mb-4 text-xl font-bold text-neutral-400 sm:text-2xl">Select The Defined Service</h3>
            <div className="rounded-md border border-grape/40 p-3 sm:p-5">
              <div className="no-scrollbar flex gap-4 overflow-x-auto sm:gap-6">
                {serviceList.map(s => {
                  const on = d.service === s.name;
                  return (
                    <div key={s.id} className="flex w-24 shrink-0 flex-col items-center gap-2">
                      <button type="button" onClick={() => patch({ service: s.name })} className={`rounded-full transition-shadow ${on ? "ring-4 ring-brand/40" : ""}`} aria-label={s.name}>
                        <ServiceIcon kind={s.icon} size={56} />
                      </button>
                      <span className="w-full truncate text-center text-[11px] font-bold text-neutral-700 dark:text-neutral-200" title={s.name}>{s.name}</span>
                      <CheckField checked={on} onChange={v => patch({ service: v ? s.name : "" })} />
                    </div>
                  );
                })}
                {!serviceList.length && <span className="py-6 text-sm font-semibold text-neutral-400">No services in this category.</span>}
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <div className="mb-3 text-center text-sm font-extrabold tracking-wider text-neutral-400">START DATE</div>
                <TextField type="date" value={d.start} onChange={v => patch({ start: v })} variant="box" center />
              </div>
              <div>
                <div className="mb-3 text-center text-sm font-extrabold tracking-wider text-neutral-400">END DATE</div>
                <TextField type="date" value={d.end} onChange={v => patch({ end: v })} variant="box" center />
              </div>
            </div>
          </div>
        </div>

        {notice && <FormNotice kind={notice.kind}>{notice.text}</FormNotice>}
        <ActionBar remove={!blank} removeLabel="REMOVE PROMOTION" onCancel={() => router.push(`${zone}/promotions`)} onRemove={remove} saveLabel={blank ? "SAVE" : "UPDATE"} />
      </form>
    </PageCard>
  );
}
