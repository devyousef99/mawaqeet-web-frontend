"use client";
import { PageCard, Table, TableFooter, TableHeader } from "@mawaqeet/ui/TableShell";
import { Dot, Kebab } from "@mawaqeet/ui/ui";
import { complains } from "@mawaqeet/data";

export default function Complains() {
  return (
    <PageCard>
      <TableHeader title="Complains" selects={["USER TYPE"]} />
      <Table cols={["#", "Name", "Customer Number", "Type of User", "Complain Message", "Attachments", "City", "Booking ID / Subscribtion #"]}>
        {complains.map((c, i) => (
          <tr key={c.n} className={i === 0 ? "bg-indigo-50/60 dark:bg-white/5" : ""}>
            <td className="py-8 text-[16px] font-bold text-neutral-600 dark:text-neutral-300">{c.n}</td>
            <td className="py-8">
              <span className="relative inline-block text-center text-[14px] font-extrabold uppercase leading-snug text-neutral-700 dark:text-neutral-200">
                {c.name.split(" ").slice(0, 2).join(" ")}<br />{c.name.split(" ").slice(2).join(" ")}
                <Dot s="green" className="absolute -bottom-4 start-1" />
              </span>
            </td>
            <td className="py-8 text-[15px] font-semibold text-neutral-600 dark:text-neutral-300">{c.number}</td>
            <td className="py-8 text-center text-[14px] font-extrabold text-neutral-700 dark:text-neutral-200">{c.type}</td>
            <td className="py-8 text-[15px] font-semibold text-neutral-700 dark:text-neutral-200">{c.msg}</td>
            <td className="py-8 text-center text-[15px] font-bold text-neutral-700 dark:text-neutral-200">{c.attach}</td>
            <td className="py-8 text-[15px] font-semibold text-neutral-700 dark:text-neutral-200">{c.city}</td>
            <td className="py-8 text-center text-[15px] font-bold text-neutral-600 dark:text-neutral-300">{c.ref}</td>
            <td className="py-8 text-end"><Kebab /></td>
          </tr>
        ))}
      </Table>
      <TableFooter />
    </PageCard>
  );
}
