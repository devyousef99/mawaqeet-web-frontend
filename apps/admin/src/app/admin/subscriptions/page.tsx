"use client";
import { useState } from "react";
import { Pause, Play, RefreshCw, Trash2 } from "lucide-react";
import { DataTable, Cell } from "@mawaqeet/ui/DataTable";
import { Dot } from "@mawaqeet/ui/ui";
import { Modal, Btn, SelectField, TextField, SwitchField } from "@mawaqeet/ui/form";
import { useStore, nextNumericId } from "@mawaqeet/ui/store";
import { subscribers, subscriptionTypeOptions, type Subscriber, type Status } from "@mawaqeet/data";

type Sub = Subscriber & { autoRenew?: boolean };
const statusMeta: Record<string, { dot: Status; cls: string }> = {
  ACTIVE: { dot: "green", cls: "bg-mint/60 text-emerald-900 dark:bg-mint/20 dark:text-mint" },
  HOLD: { dot: "yellow", cls: "bg-sun/50 text-amber-900 dark:bg-sun/20 dark:text-sun" },
  EXPIRED: { dot: "red", cls: "bg-coral/50 text-rose-900 dark:bg-coral-deep/20 dark:text-coral" },
};

export default function Subscriptions() {
  const store = useStore<Sub>("subscribers", subscribers);
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ name: "", number: "", type: "BASIC", paid: true });

  const rows = store.items.filter(s => (!type || s.type.toUpperCase() === type) && (!status || s.status === status));

  const setSt = (s: Sub, st: string, extra: Partial<Sub> = {}) => store.update(s.id, { status: st, dot: statusMeta[st].dot, ...extra });
  const create = () => {
    if (!draft.name.trim()) return;
    store.add({ id: nextNumericId(store.items), name: draft.name.trim(), number: draft.number, type: draft.type, paid: draft.paid ? "YES" : "NO", status: draft.paid ? "ACTIVE" : "HOLD", renewal: 0, daysLeft: draft.paid ? 30 : 0, dot: draft.paid ? "green" : "yellow" });
    setOpen(false);
    setDraft({ name: "", number: "", type: "BASIC", paid: true });
  };

  return (
    <>
      <DataTable
        title="Subscribers"
        ready={store.ready}
        rows={rows}
        rowKey={s => s.id}
        searchText={s => `${s.id} ${s.name} ${s.number} ${s.type} ${s.status}`}
        actions={{ label: "Create Subscription", onClick: () => setOpen(true) }}
        onReset={() => { if (window.confirm("Restore the seed subscribers?")) store.reset(); }}
        filters={[
          { key: "type", label: "Subscription type", options: subscriptionTypeOptions, value: type, onChange: setType },
          { key: "status", label: "Status", options: Object.keys(statusMeta).map(s => ({ value: s, label: s })), value: status, onChange: setStatus },
        ]}
        columns={[
          { key: "id", header: "Subscription #", sort: s => s.id, render: s => Cell.muted(s.id) },
          {
            key: "name", header: "Name", primary: true, sort: s => s.name,
            render: s => (
              <span className="inline-flex items-center gap-2">
                <Dot s={s.dot} />
                <span>
                  <span className="block text-[15px] font-extrabold text-neutral-800 dark:text-neutral-100">{s.name}</span>
                  <span className="block text-xs font-semibold text-neutral-400">{s.number}</span>
                </span>
              </span>
            ),
          },
          { key: "type", header: "Type", sort: s => s.type, render: s => Cell.strong(s.type.toUpperCase()) },
          { key: "paid", header: "Paid", align: "center", render: s => <span className={`text-sm font-extrabold ${s.paid === "YES" ? "text-emerald-500" : "text-coral-deep"}`}>{s.paid}</span> },
          { key: "status", header: "Status", sort: s => s.status, render: s => <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${statusMeta[s.status]?.cls ?? ""}`}>{s.status}</span> },
          { key: "renewal", header: "Renewal", align: "center", sort: s => s.renewal, render: s => Cell.strong(s.renewal) },
          { key: "daysLeft", header: "Days left", align: "center", sort: s => s.daysLeft, render: s => Cell.strong(s.daysLeft) },
          {
            key: "quick", header: "", hideOnMobile: true,
            render: s => (
              <span className="flex items-center gap-2">
                {s.status === "HOLD" ? (
                  <button type="button" onClick={() => setSt(s, "ACTIVE")} className="flex flex-col items-center text-emerald-600 hover:brightness-110" title="Resume">
                    <span className="flex size-8 items-center justify-center rounded-full bg-emerald-500 text-white"><Play className="size-3.5" /></span>
                    <span className="text-[10px] font-extrabold">RESUME</span>
                  </button>
                ) : (
                  <button type="button" onClick={() => setSt(s, "HOLD")} className="flex flex-col items-center text-neutral-500 hover:text-neutral-800 dark:hover:text-white" title="Hold">
                    <span className="flex size-8 items-center justify-center rounded-full bg-neutral-400 text-white"><Pause className="size-3.5" /></span>
                    <span className="text-[10px] font-extrabold">HOLD</span>
                  </button>
                )}
                <button type="button" onClick={() => setSt(s, "ACTIVE", { paid: "YES", renewal: s.renewal + 1, daysLeft: 30 })} className="flex flex-col items-center text-emerald-600 hover:brightness-110" title="Renew">
                  <RefreshCw className="size-6" />
                  <span className="text-[10px] font-extrabold text-neutral-700 dark:text-neutral-200">RENEW</span>
                </button>
              </span>
            ),
          },
          { key: "auto", header: "Auto-renew", render: s => <SwitchField checked={!!s.autoRenew} onChange={v => store.update(s.id, { autoRenew: v })} /> },
        ]}
        rowActions={s => [
          { label: "Renew (+30 days)", icon: <RefreshCw className="size-4" />, onClick: () => setSt(s, "ACTIVE", { paid: "YES", renewal: s.renewal + 1, daysLeft: 30 }) },
          s.status === "HOLD"
            ? { label: "Resume", icon: <Play className="size-4" />, onClick: () => setSt(s, "ACTIVE") }
            : { label: "Put on hold", icon: <Pause className="size-4" />, onClick: () => setSt(s, "HOLD") },
          { label: "Expire now", onClick: () => setSt(s, "EXPIRED", { daysLeft: 0 }) },
          { label: "Delete", tone: "danger", icon: <Trash2 className="size-4" />, onClick: () => { if (window.confirm(`Delete subscription #${s.id}?`)) store.remove(s.id); } },
        ]}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create Subscription"
        footer={<><Btn variant="ghost" tone="coral" onClick={() => setOpen(false)}>CANCEL</Btn><Btn tone="mint" onClick={create} disabled={!draft.name.trim()}>SAVE</Btn></>}
      >
        <div className="space-y-4">
          <TextField label="Name" value={draft.name} onChange={v => setDraft(d => ({ ...d, name: v }))} placeholder="SUBSCRIBER NAME" />
          <TextField label="Number" type="tel" value={draft.number} onChange={v => setDraft(d => ({ ...d, number: v }))} placeholder="05XXXXXXXX" />
          <SelectField label="Type" value={draft.type} onChange={v => setDraft(d => ({ ...d, type: v }))} options={subscriptionTypeOptions} />
          <SwitchField checked={draft.paid} onChange={v => setDraft(d => ({ ...d, paid: v }))} label="Paid" />
        </div>
      </Modal>
    </>
  );
}
