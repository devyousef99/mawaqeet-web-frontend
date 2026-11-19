"use client";
import { useState } from "react";
import { PageCard } from "@mawaqeet/ui/TableShell";
import { SelectField } from "@mawaqeet/ui/form";
import { monthOptions } from "@mawaqeet/data";

const years = Array.from({ length: 5 }, (_, i) => ({ value: String(2022 + i), label: String(2022 + i) }));

/* Deterministic dummy numbers so switching month/year visibly changes the report. */
const vary = (base: number, seed: number) => Math.round(base * (0.8 + ((seed * 37) % 41) / 100));

function Report({ title, rows, options, initial }: { title: string; rows: [string, number][]; options: { value: string; label: string }[]; initial: string }) {
  const [sel, setSel] = useState(initial);
  const seed = options.findIndex(o => o.value === sel) + 1;
  const exportCsv = () => {
    const csv = ["Metric,Value", ...rows.map(([k, v]) => `${k},${vary(v, seed)}`)].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `${title.replace(/\s+/g, "-").toLowerCase()}-${sel}.csv`;
    a.click();
  };
  return (
    <PageCard>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <h2 className="text-2xl font-extrabold text-neutral-800 dark:text-white sm:text-3xl">{title}</h2>
        <div className="flex flex-wrap gap-3 sm:flex-col sm:items-end">
          <button type="button" onClick={() => window.alert("Full chart view is not wired yet.")} className="text-base font-bold text-[#4c6ef5] hover:underline">View Full Chart</button>
          <button type="button" onClick={exportCsv} className="h-10 rounded-full bg-neutral-200 px-6 text-[14px] font-bold text-[#4c6ef5] hover:bg-neutral-300 dark:bg-white/15">Export as CSV</button>
        </div>
      </div>
      <SelectField value={sel} onChange={setSel} options={options} className="mb-2 w-full max-w-md" />
      <div className="divide-y divide-neutral-200 dark:divide-white/10">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-4 py-5">
            <span className="text-lg font-bold text-neutral-800 dark:text-neutral-100 sm:text-xl">{k}</span>
            <span className="text-lg font-semibold text-neutral-400 sm:text-xl">{vary(v, seed).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </PageCard>
  );
}

export default function Reports() {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-8">
      <Report title="Month Report" options={monthOptions} initial="AUGUST" rows={[["Total Requests", 4238], ["Completed", 1005], ["Canceled", 91], ["Entered Manually", 15]]} />
      <Report title="Year Report" options={years} initial="2026" rows={[["Total Requests", 12152], ["Completed", 5252], ["Canceled", 1414], ["Entered Manually", 350]]} />
    </div>
  );
}
