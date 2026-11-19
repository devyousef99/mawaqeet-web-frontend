"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageCard } from "@mawaqeet/ui/TableShell";
import { ActionBar } from "@mawaqeet/ui/ui";
import { CheckField, FormNotice, SelectField, SwitchField } from "@mawaqeet/ui/form";
import { ServiceIcon } from "@mawaqeet/ui/ServiceIcon";
import { useStore } from "@mawaqeet/ui/store";
import { services as seedServices, countOptions, type Service } from "@mawaqeet/data";

type LoyaltyConfig = { id: "settings"; bookings: number; ratings: number; enabled: boolean; serviceIds: number[] };
const DEFAULT: LoyaltyConfig = { id: "settings", bookings: 10, ratings: 5, enabled: false, serviceIds: [] };

export default function LoyaltySettings() {
  const router = useRouter();
  const store = useStore<LoyaltyConfig>("loyaltySettings", [DEFAULT]);
  const svcStore = useStore<Service>("services", seedServices);
  // Derived from the stored config until the first edit — no effect needed.
  const [edited, setEdited] = useState<LoyaltyConfig | null>(null);
  const d: LoyaltyConfig = edited ?? store.items[0] ?? DEFAULT;
  const setD = (f: (x: LoyaltyConfig) => LoyaltyConfig) => setEdited(f(d));
  const [notice, setNotice] = useState<{ kind: "error" | "success"; text: string } | null>(null);

  const save = () => {
    if (!d.serviceIds.length) return setNotice({ kind: "error", text: "Select at least one service for the program." });
    store.upsert(d);
    setNotice({ kind: "success", text: "Loyalty settings saved." });
    setTimeout(() => router.push("/admin/loyal-program"), 400);
  };
  const toggleSvc = (id: number, on: boolean) => setD(x => ({ ...x, serviceIds: on ? [...x.serviceIds, id] : x.serviceIds.filter(i => i !== id) }));

  return (
    <PageCard>
      <form onSubmit={e => { e.preventDefault(); save(); }} noValidate>
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(280px,340px)_1fr] xl:gap-14">
          <div className="space-y-10">
            <div>
              <div className="mb-4 text-center text-[15px] font-bold uppercase leading-relaxed tracking-wide text-neutral-700 dark:text-neutral-300">
                Add to program if<br />customer reaches
              </div>
              <SelectField value={d.bookings} onChange={v => setD(x => ({ ...x, bookings: v }))} options={countOptions(50).map(o => ({ ...o, label: `${o.label} BOOKINGS` }))} center />
            </div>
            <div>
              <div className="mb-4 text-center text-[15px] font-bold uppercase leading-relaxed tracking-wide text-neutral-700 dark:text-neutral-300">
                Add to program if<br />customer reaches
              </div>
              <SelectField value={d.ratings} onChange={v => setD(x => ({ ...x, ratings: v }))} options={countOptions(20).map(o => ({ ...o, label: `${o.label} RATINGS` }))} center />
            </div>
            <div>
              <div className="mb-4 text-[15px] font-bold uppercase tracking-wide text-neutral-700 dark:text-neutral-300">Status</div>
              <SwitchField checked={d.enabled} onChange={v => setD(x => ({ ...x, enabled: v }))} label={d.enabled ? "PROGRAM ON" : "PROGRAM OFF"} />
            </div>
          </div>
          <div className="min-w-0">
            <h3 className="mb-6 text-center text-2xl font-bold text-neutral-400 sm:text-3xl">Select The Defined Services to the Program</h3>
            <div className="rounded-md border border-grape/40 p-3 sm:p-5">
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
                {svcStore.items.map(s => {
                  const on = d.serviceIds.includes(s.id);
                  return (
                    <div key={s.id} className="flex flex-col items-center gap-2">
                      <button type="button" onClick={() => toggleSvc(s.id, !on)} className={`rounded-full transition-shadow ${on ? "ring-4 ring-brand/40" : ""}`} aria-label={s.name}>
                        <ServiceIcon kind={s.icon} size={56} />
                      </button>
                      <span className="w-full truncate text-center text-[11px] font-bold text-neutral-700 dark:text-neutral-200" title={s.name}>{s.name}</span>
                      <CheckField checked={on} onChange={v => toggleSvc(s.id, v)} />
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 text-xs font-semibold text-neutral-400">{d.serviceIds.length} selected</div>
            </div>
          </div>
        </div>
        {notice && <FormNotice kind={notice.kind}>{notice.text}</FormNotice>}
        <ActionBar onCancel={() => router.push("/admin/loyal-program")} />
      </form>
    </PageCard>
  );
}
