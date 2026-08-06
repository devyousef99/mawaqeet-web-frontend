"use client";
import Link from "next/link";
import { PageCard, Table, TableFooter, TableHeader } from "@mawaqeet/ui/TableShell";
import { Avatar, Kebab } from "@mawaqeet/ui/ui";
import { employees } from "@mawaqeet/data";
import { useRouter } from "next/navigation";

const slots = ["2-3 PM", "7-8 PM", "11-12 PM", "7-8 AM", "9-10 PM", "8-9 AM", "11-12 AM", "9-10 AM"];
const statusColor: Record<string, string> = { Available: "text-teal-400", Vacation: "text-neutral-400", Working: "text-coral-deep", Booked: "text-amber-400" };

function SlotChips({ muted, seed }: { muted?: boolean; seed: number }) {
  return (
    <div className="grid w-fit grid-cols-4 gap-2">
      {slots.map((s, i) => (
        <span key={s}
          className={`flex h-9 w-16 items-center justify-center rounded-full text-center text-[11px] font-extrabold leading-tight text-white ${
            muted ? "bg-neutral-200 text-transparent dark:bg-white/10" : (i + seed) % 3 === 0 ? "bg-sun" : "bg-teal-600"
          }`}>
          {muted ? "" : s.replace(" ", "\u00A0")}
        </span>
      ))}
    </div>
  );
}

export default function Employees() {
  const router = useRouter();
  return (
    <PageCard>
      <TableHeader title="Employees" selects={["SELECT PROVIDER", "SELECT BRANCH"]}
        action={{ label: "Add Employee", onClick: () => router.push("/admin/employees/new") }} />
      <Table cols={["Employee", "Job Description", "Booked Today", "Working Hours", "Rating"]}>
        {employees.map((e, i) => (
          <tr key={e.id} className={i === 0 ? "bg-indigo-50/60 dark:bg-white/5" : ""}>
            <td className="py-5">
              <Link href={`/admin/employees/${e.id}`} className="flex items-center gap-4">
                <Avatar name={e.name} size={56} dot={e.dot} />
                <span>
                  <span className="block text-[16px] font-bold text-neutral-800 hover:text-brand dark:text-neutral-100">{e.name}</span>
                  <span className={`text-sm font-bold ${statusColor[e.status]}`}>{e.status}</span>
                </span>
              </Link>
            </td>
            <td className="py-5 text-[16px] font-semibold text-neutral-700 dark:text-neutral-200">{e.job}</td>
            <td className="py-5"><SlotChips muted={e.status === "Vacation"} seed={i} /></td>
            <td className="py-5">
              <div className="text-[16px] font-bold text-neutral-800 dark:text-neutral-100">10 AM - 10 PM</div>
              <div className="text-sm font-semibold text-neutral-400">current time : 4:00 PM</div>
            </td>
            <td className="py-5">
              <span className="flex h-9 w-20 items-center justify-center rounded-full text-[15px] font-extrabold text-white" style={{ background: e.ratingColor }}>
                {e.rating}
              </span>
            </td>
            <td className="py-5 text-end"><Kebab /></td>
          </tr>
        ))}
      </Table>
      <TableFooter />
    </PageCard>
  );
}
