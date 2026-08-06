"use client";
import Link from "next/link";
import { PageCard, Table, TableFooter, TableHeader } from "@mawaqeet/ui/TableShell";
import { Kebab } from "@mawaqeet/ui/ui";
import { ServiceIcon } from "@mawaqeet/ui/ServiceIcon";
import { services } from "@mawaqeet/data";
import { useRouter } from "next/navigation";

export default function Services() {
  const router = useRouter();
  return (
    <PageCard>
      <TableHeader title="Services" selects={["SELECT PROVIDER", "SELECT BRANCH"]}
        action={{ label: "Create  Service", onClick: () => router.push("/admin/services/new") }} />
      <Table cols={["Service", "Type of service", "Number of Employees", "Time Slot", "Working Hours", "Price"]}>
        {services.map((s, i) => (
          <tr key={s.id} className={i === 0 ? "bg-indigo-50/60 dark:bg-white/5" : ""}>
            <td className="max-w-md py-5">
              <Link href={`/admin/services/${s.id}`} className="flex items-center gap-5">
                <ServiceIcon kind={s.icon} dot={s.dot} />
                <span>
                  <span className="block text-[16px] font-bold text-neutral-800 hover:text-brand dark:text-neutral-100">{s.name}</span>
                  <span className="block max-w-64 text-xs font-semibold leading-relaxed text-neutral-400">{s.desc}</span>
                </span>
              </Link>
            </td>
            <td className="py-5 text-[16px] font-semibold text-neutral-700 dark:text-neutral-200">{s.type}</td>
            <td className="py-5 text-center text-[16px] font-bold text-neutral-700 dark:text-neutral-200">{s.employees}</td>
            <td className="py-5">
              <span className="text-[16px] font-bold text-neutral-700 dark:text-neutral-200">{s.slot}</span>
              <span className="ms-4 text-sm font-bold text-neutral-500">{s.slotUnit}</span>
            </td>
            <td className="py-5">
              <div className="text-[16px] font-bold text-neutral-800 dark:text-neutral-100">{s.hours}</div>
              <div className="text-sm font-semibold text-neutral-400">current time : 4:00 PM</div>
            </td>
            <td className="py-5 text-[16px] font-bold text-neutral-700 dark:text-neutral-200">{s.price}</td>
            <td className="py-5 text-end"><Kebab /></td>
          </tr>
        ))}
      </Table>
      <TableFooter />
    </PageCard>
  );
}
