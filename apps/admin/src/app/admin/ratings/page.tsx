"use client";
import { useState } from "react";
import { Star, Trash2 } from "lucide-react";
import { DataTable, Cell } from "@mawaqeet/ui/DataTable";
import { Dot } from "@mawaqeet/ui/ui";
import { ServiceIcon } from "@mawaqeet/ui/ServiceIcon";
import { useStore } from "@mawaqeet/ui/store";
import { loyalCustomers, branchOptions, providerOptions, categoryOptions, type LoyalCustomer } from "@mawaqeet/data";

type RatingRecord = LoyalCustomer & { id: number };
const seed: RatingRecord[] = loyalCustomers.map(c => ({ ...c, id: c.rank }));

const Stars = ({ v }: { v: number }) => (
  <span className="inline-flex items-center gap-1 text-[15px] font-bold text-neutral-700 dark:text-neutral-200">
    <Star className="size-4 fill-sun text-sun" /> {v}
  </span>
);

export default function Ratings() {
  const store = useStore<RatingRecord>("ratings", seed);
  const [branch, setBranch] = useState("");
  const [provider, setProvider] = useState("");
  const [category, setCategory] = useState("");

  const rows = store.items.filter(c => (!branch || c.branch.toUpperCase() === branch) && (!category || c.category.toUpperCase() === category));

  return (
    <DataTable
      title="Ratings"
      ready={store.ready}
      rows={rows}
      rowKey={c => c.id}
      searchText={c => `${c.name} ${c.number} ${c.service} ${c.category} ${c.branch} ${c.booking}`}
      onReset={() => { if (window.confirm("Restore the seed ratings?")) store.reset(); }}
      filters={[
        { key: "provider", label: "Provider", options: providerOptions, value: provider, onChange: setProvider },
        { key: "branch", label: "Branch", options: branchOptions, value: branch, onChange: setBranch },
        { key: "category", label: "Category", options: categoryOptions, value: category, onChange: setCategory },
      ]}
      columns={[
        { key: "n", header: "#", width: "48px", sort: c => c.id, render: c => Cell.muted(c.id) },
        {
          key: "name", header: "Customer", primary: true, sort: c => c.name,
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
          key: "service", header: "Booked Service", sort: c => c.service,
          render: c => (
            <span className="flex items-center gap-3">
              <ServiceIcon kind={c.icon} dot={c.dot} size={44} />
              <span className="text-[15px] font-semibold text-neutral-700 dark:text-neutral-200">{c.service}</span>
            </span>
          ),
        },
        { key: "category", header: "Category", sort: c => c.category, render: c => Cell.strong(c.category) },
        { key: "branch", header: "Branch", sort: c => c.branch, render: c => Cell.text(c.branch) },
        { key: "booking", header: "Booking", align: "center", render: c => Cell.muted(c.booking) },
        { key: "rating", header: "Rating", align: "center", sort: c => c.rating, render: c => <Stars v={c.rating} /> },
      ]}
      rowActions={c => [
        { label: "Delete", tone: "danger", icon: <Trash2 className="size-4" />, onClick: () => { if (window.confirm("Delete this rating?")) store.remove(c.id); } },
      ]}
    />
  );
}
