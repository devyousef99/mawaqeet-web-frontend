"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { DataTable, Cell } from "@mawaqeet/ui/DataTable";
import { Dot } from "@mawaqeet/ui/ui";
import { SwitchField } from "@mawaqeet/ui/form";
import { ServiceIcon } from "@mawaqeet/ui/ServiceIcon";
import { useStore } from "@mawaqeet/ui/store";
import { seedPromotionRecords, type PromotionRecord } from "@mawaqeet/ui/PromoForm";
import { branchOptions, providerOptions, categoryOptions } from "@mawaqeet/data";

export default function Promotions() {
  const router = useRouter();
  const store = useStore<PromotionRecord>("promotions", seedPromotionRecords);
  const [branch, setBranch] = useState("");
  const [provider, setProvider] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const rows = store.items.filter(p =>
    (!branch || p.branch.toUpperCase() === branch) &&
    (!category || p.category.toUpperCase() === category) &&
    (!status || (status === "ON") === p.on));

  return (
    <DataTable
      title="Promotions"
      ready={store.ready}
      rows={rows}
      rowKey={p => p.id}
      searchText={p => `${p.name} ${p.service} ${p.category} ${p.branch}`}
      actions={{ label: "Create Promotion", onClick: () => router.push("/admin/promotions/new") }}
      onReset={() => { if (window.confirm("Restore the seed promotions?")) store.reset(); }}
      filters={[
        { key: "provider", label: "Provider", options: providerOptions, value: provider, onChange: setProvider },
        { key: "branch", label: "Branch", options: branchOptions, value: branch, onChange: setBranch },
        { key: "category", label: "Category", options: categoryOptions, value: category, onChange: setCategory },
        { key: "status", label: "Status", options: [{ value: "ON", label: "ON" }, { value: "OFF", label: "OFF" }], value: status, onChange: setStatus },
      ]}
      columns={[
        {
          key: "name", header: "Promotion Name", primary: true, sort: p => p.name,
          render: p => (
            <Link href={`/admin/promotions/${encodeURIComponent(p.id)}`} className="inline-flex items-center gap-2 text-[15px] font-extrabold text-neutral-600 hover:text-brand dark:text-neutral-300">
              <Dot s={p.dot} />{p.name}
            </Link>
          ),
        },
        { key: "start", header: "Start Date", sort: p => p.start.split("/").reverse().join(""), render: p => Cell.strong(p.start) },
        { key: "end", header: "End Date", sort: p => p.end.split("/").reverse().join(""), render: p => Cell.muted(p.end) },
        {
          key: "service", header: "Service", sort: p => p.service,
          render: p => (
            <span className="flex items-center gap-3">
              <ServiceIcon kind={p.icon} dot={p.dot} size={44} />
              <span className="text-[15px] font-semibold text-neutral-700 dark:text-neutral-200">{p.service}</span>
            </span>
          ),
        },
        { key: "category", header: "Category", sort: p => p.category, render: p => Cell.strong(p.category) },
        { key: "branch", header: "Branch", sort: p => p.branch, render: p => Cell.text(p.branch) },
        { key: "capacity", header: "Capacity", align: "center", sort: p => p.capacity, render: p => Cell.strong(p.capacity) },
        { key: "available", header: "Available", align: "center", sort: p => p.available, render: p => Cell.strong(p.available) },
        {
          key: "status", header: "Status", sort: p => (p.on ? 1 : 0),
          render: p => <SwitchField checked={p.on} onChange={on => store.update(p.id, { on, dot: on ? "green" : "red" })} label={p.on ? "ON" : "OFF"} />,
        },
      ]}
      rowActions={p => [
        { label: "Edit", icon: <Pencil className="size-4" />, onClick: () => router.push(`/admin/promotions/${encodeURIComponent(p.id)}`) },
        { label: "Delete", tone: "danger", icon: <Trash2 className="size-4" />, onClick: () => { if (window.confirm(`Delete ${p.name}?`)) store.remove(p.id); } },
      ]}
    />
  );
}
