"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2, UserCheck, Palmtree } from "lucide-react";
import { DataTable, Cell } from "@mawaqeet/ui/DataTable";
import { Avatar } from "@mawaqeet/ui/ui";
import { useStore } from "@mawaqeet/ui/store";
import { employees as seed, workingStatusOptions, jobOptions, branchOptions, type Employee, type Status } from "@mawaqeet/data";

const slots = ["2-3 PM", "7-8 PM", "11-12 PM", "7-8 AM", "9-10 PM", "8-9 AM", "11-12 AM", "9-10 AM"];
const statusColor: Record<string, string> = { Available: "text-teal-400", Vacation: "text-neutral-400", Working: "text-coral-deep", Booked: "text-amber-400" };
const statusDot: Record<string, Status> = { Available: "green", Vacation: "yellow", Working: "red", Booked: "yellow" };

function SlotChips({ muted, seed }: { muted?: boolean; seed: number }) {
  return (
    <div className="grid w-fit grid-cols-4 gap-1.5">
      {slots.map((s, i) => (
        <span key={s}
          className={`flex h-8 w-[60px] items-center justify-center rounded-full text-center text-[10px] font-extrabold leading-tight text-white ${
            muted ? "bg-neutral-200 text-transparent dark:bg-white/10" : (i + seed) % 3 === 0 ? "bg-sun" : "bg-teal-600"
          }`}>
          {muted ? "" : s.replace(" ", " ")}
        </span>
      ))}
    </div>
  );
}

export default function Employees() {
  const router = useRouter();
  const store = useStore<Employee>("employees", seed);
  const [status, setStatus] = useState("");
  const [job, setJob] = useState("");
  const [branch, setBranch] = useState("");

  const rows = store.items.filter(e => (!status || e.status.toUpperCase() === status) && (!job || e.job.toUpperCase() === job));
  const setEmpStatus = (e: Employee, s: string) => store.update(e.id, { status: s, dot: statusDot[s] });

  return (
    <DataTable
      title="Employees"
      ready={store.ready}
      rows={rows}
      rowKey={e => e.id}
      searchText={e => `${e.name} ${e.job} ${e.status}`}
      actions={{ label: "Add Employee", onClick: () => router.push("/admin/employees/new") }}
      onReset={() => { if (window.confirm("Restore the seed employees?")) store.reset(); }}
      filters={[
        { key: "branch", label: "Branch", options: branchOptions, value: branch, onChange: setBranch },
        { key: "status", label: "Working status", options: workingStatusOptions, value: status, onChange: setStatus },
        { key: "job", label: "Job", options: jobOptions, value: job, onChange: setJob },
      ]}
      columns={[
        {
          key: "name", header: "Employee", primary: true, sort: e => e.name,
          render: e => (
            <Link href={`/admin/employees/${e.id}`} className="flex items-center gap-3">
              <Avatar name={e.name} size={52} dot={e.dot} />
              <span className="min-w-0">
                <span className="block truncate text-[16px] font-bold text-neutral-800 hover:text-brand dark:text-neutral-100">{e.name}</span>
                <span className={`text-sm font-bold ${statusColor[e.status] ?? "text-neutral-400"}`}>{e.status}</span>
              </span>
            </Link>
          ),
        },
        { key: "job", header: "Job Description", sort: e => e.job, render: e => Cell.text(e.job) },
        { key: "booked", header: "Booked Today", hideOnMobile: true, render: e => <SlotChips muted={e.status === "Vacation"} seed={e.id} /> },
        { key: "hours", header: "Working Hours", render: () => Cell.stacked("10 AM - 10 PM", "current time : 4:00 PM") },
        {
          key: "rating", header: "Rating", align: "center", sort: e => e.rating,
          render: e => <span className="inline-flex h-9 w-20 items-center justify-center rounded-full text-[15px] font-extrabold text-white" style={{ background: e.ratingColor }}>{e.rating}</span>,
        },
      ]}
      rowActions={e => [
        { label: "View", icon: <Eye className="size-4" />, onClick: () => router.push(`/admin/employees/${e.id}`) },
        { label: "Edit", icon: <Pencil className="size-4" />, onClick: () => router.push(`/admin/employees/${e.id}`) },
        e.status === "Vacation"
          ? { label: "Mark available", icon: <UserCheck className="size-4" />, onClick: () => setEmpStatus(e, "Available") }
          : { label: "Set on vacation", icon: <Palmtree className="size-4" />, onClick: () => setEmpStatus(e, "Vacation") },
        { label: "Remove", tone: "danger", icon: <Trash2 className="size-4" />, onClick: () => { if (window.confirm(`Remove ${e.name}?`)) store.remove(e.id); } },
      ]}
    />
  );
}
