"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Trash2, Copy } from "lucide-react";
import { DataTable, Cell } from "@mawaqeet/ui/DataTable";
import { ServiceIcon } from "@mawaqeet/ui/ServiceIcon";
import { useStore } from "@mawaqeet/ui/store";
import { appointments as seed, branchOptions, providerOptions, categoryOptions, type Appointment } from "@mawaqeet/data";

export default function Appointments() {
  const router = useRouter();
  const store = useStore<Appointment>("appointments", seed);
  const [branch, setBranch] = useState("");
  const [provider, setProvider] = useState("");
  const [type, setType] = useState("");

  const rows = store.items.filter(a => (!branch || a.branch.toUpperCase() === branch) && (!type || a.type.toUpperCase() === type));

  const duplicate = (a: Appointment) => {
    const n = Math.max(...store.items.map(x => Number(x.id.slice(1)) || 0)) + 1;
    store.add({ ...a, id: `#${String(n).padStart(7, "0")}` });
  };

  return (
    <DataTable
      title="Appointments"
      ready={store.ready}
      rows={rows}
      rowKey={a => a.id}
      searchText={a => `${a.id} ${a.customer} ${a.number} ${a.service} ${a.type} ${a.branch}`}
      actions={[
        { label: "Create Appointments", onClick: () => router.push("/admin/appointments/new") },
        { label: "Upload Appointments", primary: false, onClick: () => window.alert("Upload is not wired yet (needs a backend).") },
      ]}
      onReset={() => { if (window.confirm("Restore the seed appointments?")) store.reset(); }}
      filters={[
        { key: "provider", label: "Provider", options: providerOptions, value: provider, onChange: setProvider },
        { key: "branch", label: "Branch", options: branchOptions, value: branch, onChange: setBranch },
        { key: "type", label: "Type of service", options: categoryOptions, value: type, onChange: setType },
      ]}
      columns={[
        { key: "id", header: "Booking ID", sort: a => a.id, render: a => <Link href={`/admin/appointments/${a.id.slice(1)}`} className="text-[15px] font-bold text-neutral-600 hover:text-brand hover:underline dark:text-neutral-300">{a.id}</Link> },
        { key: "customer", header: "Customer", primary: true, sort: a => a.customer, render: a => Cell.stacked(a.customer, a.number) },
        {
          key: "service", header: "Service Booked", sort: a => a.service,
          render: a => (
            <span className="flex items-center gap-3">
              <ServiceIcon kind={a.icon} dot={a.dot} size={44} />
              <span className="min-w-0 text-[15px] font-semibold text-neutral-700 dark:text-neutral-200">{a.service}</span>
            </span>
          ),
        },
        { key: "type", header: "Type", sort: a => a.type, render: a => Cell.strong(a.type) },
        { key: "branch", header: "Branch", sort: a => a.branch, render: a => Cell.text(a.branch) },
        { key: "slot", header: "Slot", render: a => Cell.text(a.slot) },
        { key: "time", header: "Appointment time", render: a => Cell.stacked(a.time, "current time : 4:00 PM") },
        { key: "price", header: "Price", sort: a => parseFloat(a.price) || 0, render: a => Cell.strong(a.price) },
      ]}
      rowActions={a => [
        { label: "View", icon: <Eye className="size-4" />, onClick: () => router.push(`/admin/appointments/${a.id.slice(1)}`) },
        { label: "Duplicate", icon: <Copy className="size-4" />, onClick: () => duplicate(a) },
        { label: "Cancel booking", tone: "danger", icon: <Trash2 className="size-4" />, onClick: () => { if (window.confirm(`Cancel booking ${a.id}?`)) store.remove(a.id); } },
      ]}
    />
  );
}
