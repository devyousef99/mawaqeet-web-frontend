"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageCard, Table, TableFooter, TableHeader } from "@mawaqeet/ui/TableShell";
import { Kebab } from "@mawaqeet/ui/ui";
import { ServiceIcon } from "@mawaqeet/ui/ServiceIcon";
import { appointments } from "@mawaqeet/data";

export default function Appointments() {
  const router = useRouter();
  return (
    <PageCard>
      <TableHeader
        title="Appointments"
        selects={["SELECT PROVIDER", "SELECT BRANCH"]}
        action={[{ label: "Create Appointments", onClick: () => router.push("/admin/appointments/new") }, { label: "Upload Appointments" }]}
      />
      <Table cols={["booking ID", "Customer Name", "Customer Number", "Service Booked", "Type of service", "Branch name", "Slot", "Appointment time", "Price"]}>
        {appointments.map((a, i) => (
          <tr key={a.id} className={i === 0 ? "bg-indigo-50/60 dark:bg-white/5" : ""}>
            <td className="py-6 text-[15px] font-bold text-neutral-600 dark:text-neutral-300">
              <Link href={`/admin/appointments/${a.id.slice(1)}`} className="hover:text-brand hover:underline">{a.id}</Link>
            </td>
            <td className="py-6 pe-4 text-[15px] font-bold text-neutral-800 dark:text-neutral-100">{a.customer}</td>
            <td className="py-6 text-[15px] font-semibold text-neutral-500">{a.number}</td>
            <td className="py-6">
              <span className="flex items-center gap-4">
                <ServiceIcon kind={a.icon} dot={a.dot} size={48} />
                <span className="max-w-36 text-[15px] font-semibold text-neutral-700 dark:text-neutral-200">{a.service}</span>
              </span>
            </td>
            <td className="py-6 text-[15px] font-bold text-neutral-700 dark:text-neutral-200">{a.type}</td>
            <td className="py-6 text-[15px] font-semibold text-neutral-700 dark:text-neutral-200">{a.branch}</td>
            <td className="py-6 text-[15px] font-bold text-neutral-600 dark:text-neutral-300">{a.slot}</td>
            <td className="py-6">
              <div className="text-[15px] font-bold text-neutral-700 dark:text-neutral-200">{a.time}</div>
              <div className="text-sm font-semibold text-neutral-400">current time : 4:00 PM</div>
            </td>
            <td className="py-6 text-[15px] font-bold text-neutral-700 dark:text-neutral-200">{a.price}</td>
            <td className="py-6 text-end"><Kebab /></td>
          </tr>
        ))}
      </Table>
      <TableFooter />
    </PageCard>
  );
}
