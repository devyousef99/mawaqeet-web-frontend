"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Trophy } from "lucide-react";
import { DataTable, Cell } from "@mawaqeet/ui/DataTable";
import { Dot } from "@mawaqeet/ui/ui";
import { ServiceIcon } from "@mawaqeet/ui/ServiceIcon";
import { useStore } from "@mawaqeet/ui/store";
import { loyalCustomers, branchOptions, providerOptions, type LoyalCustomer } from "@mawaqeet/data";

type LoyalRecord = LoyalCustomer & { id: number };
const seed: LoyalRecord[] = loyalCustomers.map(c => ({ ...c, id: c.rank }));

export default function LoyalProgram() {
  const router = useRouter();
  const store = useStore<LoyalRecord>("loyal", seed);
  const [branch, setBranch] = useState("");
  const [provider, setProvider] = useState("");

  const rows = store.items.filter(c => !branch || c.branch.toUpperCase() === branch);

  return (
    <DataTable
      title="Loyalty Program"
      ready={store.ready}
      rows={rows}
      rowKey={c => c.id}
      searchText={c => `${c.name} ${c.number} ${c.service} ${c.category} ${c.branch}`}
      actions={{ label: "Modify Settings", onClick: () => router.push("/admin/loyal-program/settings") }}
      onReset={() => { if (window.confirm("Restore the seed loyalty list?")) store.reset(); }}
      filters={[
        { key: "provider", label: "Provider", options: providerOptions, value: provider, onChange: setProvider },
        { key: "branch", label: "Branch", options: branchOptions, value: branch, onChange: setBranch },
      ]}
      columns={[
        { key: "rank", header: "Rank", width: "64px", sort: c => c.rank, render: c => <span className="inline-flex items-center gap-1 text-[15px] font-extrabold text-neutral-600 dark:text-neutral-300">{c.rank === 1 && <Trophy className="size-4 text-sun" />}{c.rank}</span> },
        {
          key: "name", header: "Loyal Customer", primary: true, sort: c => c.name,
          render: c => (
            <span className="inline-flex items-center gap-2">
              <Dot s={c.dot} />
              <span>
                <span className="block text-[15px] font-extrabold text-neutral-800 dark:text-neutral-100">{c.name}</span>
                <span className="block text-xs font-semibold text-neutral-400">{c.number}</span>
              </span>
            </span>
          ),
        },
        { key: "bookings", header: "Total bookings", align: "center", sort: c => c.bookings, render: c => Cell.strong(c.bookings) },
        {
          key: "service", header: "Most booked Service", sort: c => c.service,
          render: c => (
            <span className="flex items-center gap-3">
              <ServiceIcon kind={c.icon} dot={c.dot} size={44} />
              <span className="text-[15px] font-semibold text-neutral-700 dark:text-neutral-200">{c.service}</span>
            </span>
          ),
        },
        { key: "category", header: "Category", render: c => Cell.strong(c.category) },
        { key: "branch", header: "Branch", sort: c => c.branch, render: c => Cell.text(c.branch) },
        { key: "last", header: "Last Booking", sort: c => c.last.split("/").reverse().join(""), render: c => Cell.strong(c.last) },
        { key: "rating", header: "Latest Rating", align: "center", sort: c => c.rating, render: c => Cell.strong(c.rating) },
      ]}
      rowActions={c => [
        { label: "Remove from program", tone: "danger", icon: <Trash2 className="size-4" />, onClick: () => { if (window.confirm(`Remove ${c.name} from the program?`)) store.remove(c.id); } },
      ]}
    />
  );
}
