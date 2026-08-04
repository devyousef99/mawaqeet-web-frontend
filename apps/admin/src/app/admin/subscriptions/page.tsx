"use client";
import { Pause, RefreshCw } from "lucide-react";
import { PageCard, Table, TableFooter, TableHeader } from "@mawaqeet/ui/TableShell";
import { Dot, Kebab, Toggle } from "@mawaqeet/ui/ui";
import { subscribers } from "@mawaqeet/data";

export default function Subscriptions() {
  return (
    <PageCard>
      <TableHeader title="SUBSCRIBERS" selects={["SUBSCRIBTION TYPE"]} action={{ label: "Create Subscribtion" }} />
      <Table cols={["Subscribtion #", "NAME", "Number", "Type", "Paid", "Status", "Renewal", "Days left", "", "", ""]}>
        {subscribers.map((s, i) => (
          <tr key={s.id} className={i === 0 ? "bg-indigo-50/60 dark:bg-white/5" : ""}>
            <td className="py-8 text-[15px] font-bold text-neutral-600 dark:text-neutral-300">{s.id}</td>
            <td className="py-8">
              <span className="relative inline-block text-center text-[14px] font-extrabold uppercase leading-snug text-neutral-700 dark:text-neutral-200">
                {s.name.split(" ").slice(0, 2).join(" ")}<br />{s.name.split(" ").slice(2).join(" ")}
                <Dot s={s.dot} className="absolute -bottom-4 left-1" />
              </span>
            </td>
            <td className="py-8 text-[15px] font-semibold text-neutral-600 dark:text-neutral-300">{s.number}</td>
            <td className="py-8 text-[15px] font-bold text-neutral-700 dark:text-neutral-200">{s.type}</td>
            <td className="py-8 text-[15px] font-bold text-neutral-700 dark:text-neutral-200">{s.paid}</td>
            <td className="py-8 text-[14px] font-extrabold text-neutral-700 dark:text-neutral-200">{s.status}</td>
            <td className="py-8 text-center text-[15px] font-bold text-neutral-700 dark:text-neutral-200">{s.renewal}</td>
            <td className="py-8 text-center text-[15px] font-bold text-neutral-700 dark:text-neutral-200">{s.daysLeft}</td>
            <td className="py-8">
              <button className="flex flex-col items-center gap-1 text-neutral-500 hover:text-neutral-800 dark:hover:text-white">
                <span className="flex size-9 items-center justify-center rounded-full bg-neutral-400 text-white"><Pause className="size-4" /></span>
                <span className="text-xs font-extrabold">HOLD</span>
              </button>
            </td>
            <td className="py-8">
              <button className="flex flex-col items-center gap-1 text-emerald-600 hover:brightness-110">
                <RefreshCw className="size-7" />
                <span className="text-xs font-extrabold text-neutral-700 dark:text-neutral-200">RENEW</span>
              </button>
            </td>
            <td className="py-8"><Toggle /></td>
            <td className="py-8 text-right"><Kebab /></td>
          </tr>
        ))}
      </Table>
      <TableFooter />
    </PageCard>
  );
}
