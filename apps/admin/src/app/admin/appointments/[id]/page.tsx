"use client";
import { PageCard } from "@mawaqeet/ui/TableShell";
import { ActionBar, Avatar, PillSelect } from "@mawaqeet/ui/ui";
import { GradientCard } from "@mawaqeet/ui/GradientCard";
import { EmployeePicker } from "@mawaqeet/ui/EmployeePicker";
import { CalendarCheck, ClipboardCheck, PlusCircle, AlarmClockCheck, ArrowRight } from "lucide-react";

const steps = [
  { Icon: PlusCircle, top: "1/1/2023\n09:00 AM", label: "Appointment Created", bottom: "" },
  { Icon: AlarmClockCheck, top: "1/1/2023\n09:00 AM", label: "Reminder Was sent", bottom: "12-01-2023\n11:34 PM" },
  { Icon: CalendarCheck, top: "1/1/2023\n09:00 AM", label: "Customer Verified Today", bottom: "13-01-2023\n11:34 PM" },
  { Icon: ClipboardCheck, top: "", label: "Appointment Closed", bottom: "13-01-2023\n11:34 PM", active: true },
];

export default function AppointmentDetail() {
  return (
    <PageCard>
      <div className="grid grid-cols-1 gap-14 xl:grid-cols-[380px_1fr]">
        <div>
          <GradientCard className="mb-10 w-full max-w-sm">
            <div className="mb-3 flex justify-end gap-1 text-[11px] font-extrabold">
              <span className="rounded-l bg-[#e858a8] px-2 py-1">MASSAGE</span>
              <span className="rounded-r bg-[#e858a8]/80 px-2 py-1">RIYADH</span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <div className="rounded border border-white/70 p-2 text-xs font-bold">
                #0123432
                <div className="mt-1 max-w-28 border border-white/60 p-1 text-[9px] font-semibold leading-tight">Branch : King fahad, abdulrahman ibn saad al hosainy</div>
              </div>
              <div className="text-right">
                <div className="border-b border-white/70 pb-1 text-xl font-bold">Abdullah Ali Al-Raddadi</div>
                <div className="mt-2 text-lg font-bold">0563318055</div>
              </div>
            </div>
            <div className="mt-6 flex items-end justify-between gap-3">
              <div className="rounded border border-white/70 p-2 text-[12px] font-extrabold leading-relaxed">1 HOUR FULL BODY HOT<br />STONE&nbsp; MASSAGE</div>
              <div className="flex gap-2 text-[13px] font-bold">
                <span className="rounded border border-white/70 px-2 py-1">10 PM - 11 PM</span>
                <span className="rounded border border-white/70 px-2 py-1">160 S.R</span>
              </div>
            </div>
          </GradientCard>

          <div className="mb-3 text-[15px] font-bold uppercase tracking-wide text-neutral-700 dark:text-neutral-300">SERVICE NAME</div>
          <input defaultValue="1 H FULL BODY MASSAGE" className="mb-8 h-14 w-full rounded-full bg-fog px-7 text-[15px] font-bold uppercase text-neutral-500 outline-none dark:bg-white/10 dark:text-neutral-300" />
          <div className="mb-3 text-[15px] font-bold uppercase tracking-wide text-neutral-700 dark:text-neutral-300">SERVICE DESCRIPTION</div>
          <textarea defaultValue="1 HOUR FULL BODY MASSAGING INCLUDES FEET, HAND AN NICK WITH A THAILAND WAY THERAPY"
            className="mb-8 h-36 w-full resize-none rounded-3xl bg-fog p-7 text-[15px] font-bold uppercase leading-relaxed text-neutral-500 outline-none dark:bg-white/10 dark:text-neutral-300" />
          <div className="mb-4 text-xl font-bold text-neutral-400">Price</div>
          <div className="mb-8 flex items-center gap-4">
            <input defaultValue="160" className="h-12 w-44 rounded border border-neutral-300 text-center text-lg font-bold shadow-inner outline-none dark:border-white/20 dark:bg-transparent dark:text-neutral-200" />
            <PillSelect label="SR" className="w-24" />
          </div>
          <div className="mb-4 text-xl font-bold text-neutral-400">Discount Price</div>
          <div className="flex items-center gap-4">
            <input className="h-12 w-44 rounded border border-neutral-300 text-center shadow-inner outline-none dark:border-white/20 dark:bg-transparent" />
            <PillSelect label="SR" className="w-24" />
          </div>
        </div>

        <div>
          {/* timeline */}
          <div className="mb-4 grid grid-cols-5 gap-2">
            {steps.map(({ Icon, top, label, active }) => (
              <div key={label} className="flex flex-col items-center gap-2 text-center">
                <span className={`flex size-20 items-center justify-center rounded-full ${active ? "bg-[#67b7c4] text-white" : "bg-[#f5f0dc] text-teal-900 dark:bg-white/10 dark:text-teal-300"}`}>
                  <Icon className="size-9" strokeWidth={1.6} />
                </span>
                <span className="whitespace-pre-line text-xs font-semibold text-neutral-400">{top}</span>
              </div>
            ))}
            <div />
          </div>
          <div className="relative mx-4 mb-4 h-1 rounded bg-neutral-500/70">
            <ArrowRight className="absolute -right-6 -top-2.5 size-6 text-neutral-500" />
            {[8, 28, 48, 68, 88].map((p, i) => (
              <span key={p} className={`absolute -top-2 size-5 rounded-full ${i === 3 ? "bg-[#67b7c4]" : i === 4 ? "border-2 border-neutral-400 bg-white" : "bg-neutral-500"}`} style={{ left: `${p}%` }} />
            ))}
          </div>
          <div className="grid grid-cols-5 gap-2 text-center">
            {[...steps.map(s => s), { label: "Rating", bottom: "" } as (typeof steps)[number]].map((s, i) => (
              <div key={i}>
                <div className="text-sm font-bold text-neutral-700 dark:text-neutral-200">{s.label}</div>
                <div className="mt-2 whitespace-pre-line text-xs font-semibold text-neutral-500">{s.bottom}</div>
              </div>
            ))}
          </div>

          <div className="mt-14 grid grid-cols-1 items-center gap-10 lg:grid-cols-[240px_1fr]">
            <div className="text-center">
              <div className="mb-4 text-2xl font-bold text-neutral-400">Assigned Employee :</div>
              <div className="flex flex-col items-center gap-2">
                <Avatar name="Martin Garrix" size={84} dot="green" />
                <span className="text-sm font-bold text-neutral-700 dark:text-neutral-200">Martin Garrix</span>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-6">
                <span className="text-2xl font-bold text-neutral-400">Timer till appointment :</span>
                <span className="rounded-lg border border-neutral-200 px-8 py-3 text-2xl font-extrabold shadow-sm dark:border-white/15">09:2<span className="text-emerald-400">1</span> AM</span>
              </div>
              <div className="flex items-center justify-between gap-6">
                <span className="text-2xl font-bold text-neutral-400">Current Time :</span>
                <span className="rounded-lg border border-neutral-200 px-8 py-3 text-2xl font-extrabold shadow-sm dark:border-white/15">11:20 PM</span>
              </div>
            </div>
          </div>

          <div className="mt-14">
            <h3 className="mb-4 text-2xl font-bold text-neutral-400">Re-Assign Employee</h3>
            <EmployeePicker />
          </div>
        </div>
      </div>
      <ActionBar remove removeLabel="CANCEL APPOITMENT" />
    </PageCard>
  );
}
