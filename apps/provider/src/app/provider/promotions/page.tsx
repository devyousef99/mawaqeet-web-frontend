"use client";
import Link from "next/link";
import { PageCard, Table, TableFooter, TableHeader } from "@mawaqeet/ui/TableShell";
import { Dot, Kebab, Toggle } from "@mawaqeet/ui/ui";
import { ServiceIcon } from "@mawaqeet/ui/ServiceIcon";
import { promotions } from "@mawaqeet/data";
import { useRouter } from "next/navigation";

export default function Promotions() {
  const router = useRouter();
  return (
    <PageCard>
      <TableHeader title="Promotions" selects={["SELECT PROVIDER", "SELECT BRANCH"]}
        action={{ label: "Create Promotion", onClick: () => router.push("/provider/promotions/new") }} />
      <Table cols={["Promotion Name", "Srart Date", "End Date", "Service", "Category", "Branch", "Capacity", "Available", "Status"]}>
        {promotions.map((p, i) => (
          <tr key={p.name} className={i === 0 ? "bg-indigo-50/60 dark:bg-white/5" : ""}>
            <td className="py-8">
              <Link href={`/provider/promotions/${encodeURIComponent(p.name)}`}
                className="relative inline-block text-[15px] font-extrabold text-neutral-600 hover:text-brand dark:text-neutral-300">
                {p.name}
                <Dot s={p.dot} className="absolute -bottom-4 start-0" />
              </Link>
            </td>
            <td className="py-8 text-[15px] font-bold text-neutral-700 dark:text-neutral-200">{p.start}</td>
            <td className="py-8 text-[15px] font-bold text-neutral-500">{p.end}</td>
            <td className="py-8">
              <span className="flex items-center gap-4">
                <ServiceIcon kind={p.icon} dot={p.dot} size={48} />
                <span className="text-[15px] font-semibold text-neutral-700 dark:text-neutral-200">{p.service}</span>
              </span>
            </td>
            <td className="py-8 text-[15px] font-bold text-neutral-700 dark:text-neutral-200">{p.category}</td>
            <td className="py-8 text-[15px] font-semibold text-neutral-700 dark:text-neutral-200">{p.branch}</td>
            <td className="py-8 text-center text-[15px] font-bold text-neutral-700 dark:text-neutral-200">{p.capacity}</td>
            <td className="py-8 text-center text-[15px] font-bold text-neutral-700 dark:text-neutral-200">{p.available}</td>
            <td className="py-8"><Toggle initial={p.on} /></td>
            <td className="py-8 text-end"><Kebab /></td>
          </tr>
        ))}
      </Table>
      <TableFooter />
    </PageCard>
  );
}
