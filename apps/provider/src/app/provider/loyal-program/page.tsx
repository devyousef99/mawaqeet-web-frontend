"use client";
import { PageCard, Table, TableFooter, TableHeader } from "@mawaqeet/ui/TableShell";
import { Dot, Kebab } from "@mawaqeet/ui/ui";
import { ServiceIcon } from "@mawaqeet/ui/ServiceIcon";
import { loyalCustomers } from "@mawaqeet/data";
import { useRouter } from "next/navigation";

export default function LoyalProgram() {
  const router = useRouter();
  return (
    <PageCard>
      <TableHeader title="Loyalty Program" selects={["SELECT PROVIDER", "SELECT BRANCH"]}
        action={{ label: "Modify Settings", onClick: () => router.push("/provider/loyal-program/settings") }} />
      <Table cols={["Rank", "Loyal Customer", "Customer Number", "Total bookings", "Most booked Service", "Category", "Branch", "Last Booking", "Latest Rating"]}>
        {loyalCustomers.map((c, i) => (
          <tr key={c.rank} className={i === 0 ? "bg-indigo-50/60 dark:bg-white/5" : ""}>
            <td className="py-8 text-[16px] font-bold text-neutral-600 dark:text-neutral-300">{c.rank}</td>
            <td className="py-8">
              <span className="relative inline-block text-center text-[14px] font-extrabold uppercase leading-snug text-neutral-700 dark:text-neutral-200">
                {c.name.split(" ").slice(0, 2).join(" ")}<br />{c.name.split(" ").slice(2).join(" ")}
                <Dot s={c.dot} className="absolute -bottom-4 left-1" />
              </span>
            </td>
            <td className="py-8 text-[15px] font-semibold text-neutral-600 dark:text-neutral-300">{c.number}</td>
            <td className="py-8 text-center text-[15px] font-bold text-neutral-700 dark:text-neutral-200">{c.bookings}</td>
            <td className="py-8">
              <span className="flex items-center gap-4">
                <ServiceIcon kind={c.icon} dot={c.dot} size={48} />
                <span className="text-[15px] font-semibold text-neutral-700 dark:text-neutral-200">{c.service}</span>
              </span>
            </td>
            <td className="py-8 text-[15px] font-bold text-neutral-700 dark:text-neutral-200">{c.category}</td>
            <td className="py-8 text-[15px] font-semibold text-neutral-700 dark:text-neutral-200">{c.branch}</td>
            <td className="py-8 text-[15px] font-bold text-neutral-700 dark:text-neutral-200">{c.last}</td>
            <td className="py-8 text-center text-[15px] font-bold text-neutral-700 dark:text-neutral-200">{c.rating}</td>
            <td className="py-8 text-right"><Kebab /></td>
          </tr>
        ))}
      </Table>
      <TableFooter />
    </PageCard>
  );
}
