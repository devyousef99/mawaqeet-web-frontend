"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ban, Trash2 } from "lucide-react";
import { DataTable, Cell } from "@mawaqeet/ui/DataTable";
import { Dot } from "@mawaqeet/ui/ui";
import { ServiceIcon } from "@mawaqeet/ui/ServiceIcon";
import { useStore } from "@mawaqeet/ui/store";
import { branchOptions, providerOptions, userTypeOptions } from "@mawaqeet/data";
import { seedUsers, type UserRecord } from "./data";

export default function UsersManagement() {
  const router = useRouter();
  const store = useStore<UserRecord>("users", seedUsers);
  const [branch, setBranch] = useState("");
  const [provider, setProvider] = useState("");
  const [type, setType] = useState("");

  const rows = store.items.filter(u => (!branch || u.branch.toUpperCase() === branch) && (!type || u.type === type));

  return (
    <DataTable
      title="User Management"
      ready={store.ready}
      rows={rows}
      rowKey={u => u.id}
      searchText={u => `${u.id} ${u.name} ${u.number} ${u.type} ${u.branch} ${u.service ?? ""}`}
      actions={{ label: "Create User", onClick: () => router.push("/admin/users/new") }}
      onReset={() => { if (window.confirm("Restore the seed users?")) store.reset(); }}
      filters={[
        { key: "provider", label: "Provider", options: providerOptions, value: provider, onChange: setProvider },
        { key: "branch", label: "Branch", options: branchOptions, value: branch, onChange: setBranch },
        { key: "type", label: "User type", options: userTypeOptions, value: type, onChange: setType },
      ]}
      columns={[
        { key: "id", header: "User ID", sort: u => u.id, render: u => Cell.muted(u.id) },
        {
          key: "name", header: "User", primary: true, sort: u => u.name,
          render: u => (
            <span className="inline-flex items-center gap-2">
              <Dot s={u.blocked ? "red" : u.dot} />
              <span>
                <span className={`block text-[15px] font-extrabold ${u.blocked ? "text-neutral-400 line-through" : "text-neutral-800 dark:text-neutral-100"}`}>{u.name}</span>
                <span className="block text-xs font-semibold text-neutral-400">{u.type}{u.blocked ? " · BLOCKED" : ""}</span>
              </span>
            </span>
          ),
        },
        { key: "number", header: "Number", render: u => Cell.text(u.number) },
        { key: "bookings", header: "Total bookings", align: "center", sort: u => u.bookings ?? 0, render: u => Cell.strong(u.bookings ?? 0) },
        {
          key: "service", header: "Most booked Service",
          render: u => u.service ? (
            <span className="flex items-center gap-3">
              <ServiceIcon kind={u.icon ?? "massage"} dot={u.dot} size={44} />
              <span className="text-[15px] font-semibold text-neutral-700 dark:text-neutral-200">{u.service}</span>
            </span>
          ) : Cell.muted("—"),
        },
        { key: "category", header: "Category", render: u => Cell.strong(u.category ?? "—") },
        { key: "branch", header: "Branch", sort: u => u.branch, render: u => Cell.text(u.branch) },
        { key: "last", header: "Last Booking", render: u => Cell.strong(u.last ?? "—") },
        { key: "rating", header: "Latest Rating", align: "center", sort: u => u.rating ?? 0, render: u => Cell.strong(u.rating ?? "—") },
      ]}
      rowActions={u => [
        { label: u.blocked ? "Unblock" : "Block", icon: <Ban className="size-4" />, onClick: () => store.update(u.id, { blocked: !u.blocked }) },
        { label: "Delete", tone: "danger", icon: <Trash2 className="size-4" />, onClick: () => { if (window.confirm(`Delete ${u.name}?`)) store.remove(u.id); } },
      ]}
    />
  );
}
