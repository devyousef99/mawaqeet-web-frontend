"use client";
import { useState } from "react";
import { CheckCircle2, Trash2, Paperclip } from "lucide-react";
import { DataTable, Cell } from "@mawaqeet/ui/DataTable";
import { Dot } from "@mawaqeet/ui/ui";
import { useStore } from "@mawaqeet/ui/store";
import { complains, userTypeOptions, cityOptions, type Complain } from "@mawaqeet/data";

type ComplainRecord = Complain & { id: number; resolved?: boolean };
const seed: ComplainRecord[] = complains.map(c => ({ ...c, id: c.n }));

export default function Complains() {
  const store = useStore<ComplainRecord>("complains", seed);
  const [type, setType] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const rows = store.items.filter(c =>
    (!type || c.type === type) && (!city || c.city.toUpperCase() === city) &&
    (!state || (state === "RESOLVED") === !!c.resolved));

  return (
    <DataTable
      title="Complains"
      ready={store.ready}
      rows={rows}
      rowKey={c => c.id}
      searchText={c => `${c.name} ${c.number} ${c.type} ${c.msg} ${c.city} ${c.ref}`}
      onReset={() => { if (window.confirm("Restore the seed complains?")) store.reset(); }}
      filters={[
        { key: "type", label: "User type", options: userTypeOptions, value: type, onChange: setType },
        { key: "city", label: "City", options: cityOptions, value: city, onChange: setCity },
        { key: "state", label: "State", options: [{ value: "OPEN", label: "OPEN" }, { value: "RESOLVED", label: "RESOLVED" }], value: state, onChange: setState },
      ]}
      columns={[
        { key: "n", header: "#", sort: c => c.id, width: "48px", render: c => Cell.muted(c.id) },
        {
          key: "name", header: "Name", primary: true, sort: c => c.name,
          render: c => (
            <span className="inline-flex items-center gap-2">
              <Dot s={c.resolved ? "green" : "red"} />
              <span>
                <span className="block text-[15px] font-extrabold text-neutral-800 dark:text-neutral-100">{c.name}</span>
                <span className="block text-xs font-semibold text-neutral-400">{c.number}</span>
              </span>
            </span>
          ),
        },
        { key: "type", header: "Type of User", sort: c => c.type, render: c => <span className="rounded-full bg-fog px-3 py-1 text-xs font-extrabold text-neutral-700 dark:bg-white/10 dark:text-neutral-200">{c.type}</span> },
        { key: "msg", header: "Complain Message", render: c => <span className="line-clamp-2 max-w-xs text-[14px] font-semibold text-neutral-700 dark:text-neutral-200">{c.msg}</span> },
        { key: "attach", header: "Attachments", align: "center", render: c => c.attach === "Yes" ? <Paperclip className="mx-auto size-4 text-brand" /> : Cell.muted("—") },
        { key: "city", header: "City", sort: c => c.city, render: c => Cell.text(c.city) },
        { key: "ref", header: "Booking / Subscription #", render: c => Cell.muted(c.ref) },
        { key: "state", header: "State", render: c => <span className={`text-xs font-extrabold ${c.resolved ? "text-emerald-500" : "text-coral-deep"}`}>{c.resolved ? "RESOLVED" : "OPEN"}</span> },
      ]}
      rowActions={c => [
        { label: c.resolved ? "Reopen" : "Mark resolved", icon: <CheckCircle2 className="size-4" />, onClick: () => store.update(c.id, { resolved: !c.resolved }) },
        { label: "Delete", tone: "danger", icon: <Trash2 className="size-4" />, onClick: () => { if (window.confirm("Delete this complain?")) store.remove(c.id); } },
      ]}
    />
  );
}
