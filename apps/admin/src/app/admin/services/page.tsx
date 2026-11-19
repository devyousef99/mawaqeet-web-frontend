"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { DataTable, Cell } from "@mawaqeet/ui/DataTable";
import { ServiceIcon } from "@mawaqeet/ui/ServiceIcon";
import { useStore } from "@mawaqeet/ui/store";
import { services as seed, serviceTypeOptions, providerOptions, branchOptions, type Service } from "@mawaqeet/data";

export default function Services() {
  const router = useRouter();
  const store = useStore<Service>("services", seed);
  const [type, setType] = useState("");
  const [provider, setProvider] = useState("");
  const [branch, setBranch] = useState("");

  const rows = store.items.filter(s => !type || s.type.toUpperCase() === type);

  return (
    <DataTable
      title="Services"
      ready={store.ready}
      rows={rows}
      rowKey={s => s.id}
      searchText={s => `${s.name} ${s.desc} ${s.type} ${s.price}`}
      actions={{ label: "Create Service", onClick: () => router.push("/admin/services/new") }}
      onReset={() => { if (window.confirm("Restore the seed services?")) store.reset(); }}
      filters={[
        { key: "provider", label: "Provider", options: providerOptions, value: provider, onChange: setProvider },
        { key: "branch", label: "Branch", options: branchOptions, value: branch, onChange: setBranch },
        { key: "type", label: "Type of service", options: serviceTypeOptions, value: type, onChange: setType },
      ]}
      subtitle={(provider || branch) ? "Provider / branch filters are placeholders — seed services have no provider field yet." : undefined}
      columns={[
        {
          key: "name", header: "Service", primary: true, sort: s => s.name, width: "32%",
          render: s => (
            <Link href={`/admin/services/${s.id}`} className="flex items-center gap-4">
              <ServiceIcon kind={s.icon} dot={s.dot} size={48} />
              <span className="min-w-0">
                <span className="block truncate text-[16px] font-bold text-neutral-800 hover:text-brand dark:text-neutral-100">{s.name}</span>
                <span className="line-clamp-2 text-xs font-semibold leading-relaxed text-neutral-400">{s.desc}</span>
              </span>
            </Link>
          ),
        },
        { key: "type", header: "Type of service", sort: s => s.type, render: s => Cell.text(s.type) },
        { key: "employees", header: "Employees", align: "center", sort: s => s.employees, render: s => Cell.strong(s.employees) },
        { key: "slot", header: "Time Slot", sort: s => `${s.slotUnit}${s.slot}`, render: s => <>{Cell.strong(s.slot)} <span className="ms-2 text-xs font-bold text-neutral-500">{s.slotUnit}</span></> },
        { key: "hours", header: "Working Hours", render: s => Cell.stacked(s.hours, "current time : 4:00 PM") },
        { key: "price", header: "Price", sort: s => parseFloat(s.price) || 0, render: s => Cell.strong(s.price) },
      ]}
      rowActions={s => [
        { label: "View", icon: <Eye className="size-4" />, onClick: () => router.push(`/admin/services/${s.id}`) },
        { label: "Edit", icon: <Pencil className="size-4" />, onClick: () => router.push(`/admin/services/${s.id}`) },
        { label: "Delete", tone: "danger", icon: <Trash2 className="size-4" />, onClick: () => { if (window.confirm(`Delete "${s.name}"?`)) store.remove(s.id); } },
      ]}
    />
  );
}
