"use client";
import { PageCard } from "@mawaqeet/ui/TableShell";
import { ActionBar, Check, PillSelect } from "@mawaqeet/ui/ui";

const slots = ["10 AM", "11 AM", "12 PM", "01 PM", "02 PM", "03 PM", "04 PM", "05 PM", "07 PM", "08 PM", "09 PM", "10 PM"];
const SoftLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-5 text-2xl font-bold text-neutral-400">{children}</div>
);

export default function CreateAppointments() {
  return (
    <PageCard>
      <div className="grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-[minmax(260px,340px)_1fr]">
        <div>
          <SoftLabel>Select From Static Category</SoftLabel>
          <PillSelect label="MASSAGE" tone="mint" className="w-64" />
        </div>
        <div className="flex flex-wrap items-start gap-16">
          <div className="min-w-[420px] flex-1">
            <SoftLabel>Select The Defined Service</SoftLabel>
            <PillSelect label="1 HOUR HOT STONE" tone="mint" className="w-full max-w-xl" />
          </div>
          <div>
            <SoftLabel>Select Defined Number of Employees</SoftLabel>
            <PillSelect label="11" tone="mint" className="w-24" />
          </div>
        </div>

        <div className="space-y-14">
          <div>
            <SoftLabel>Select The Day</SoftLabel>
            <PillSelect label="SUNDAY" tone="mint" className="w-64" />
          </div>
          <div>
            <SoftLabel>Approval Requirement</SoftLabel>
            <PillSelect label="FULL PAYMENT" tone="mint" className="w-64" />
          </div>
        </div>

        <div>
          <SoftLabel>Select the Appointments by Defined Working Hours</SoftLabel>
          <div className="rounded-md border border-grape/40 p-8">
            <div className="grid grid-cols-4 gap-x-8 gap-y-10 sm:grid-cols-7">
              {slots.map(s => (
                <div key={s} className="flex flex-col items-center gap-4">
                  <span className="flex size-24 items-center justify-center rounded-full text-xl font-bold text-white shadow-lg"
                    style={{ background: "linear-gradient(180deg,#5a54d1 0%,#4aa08a 100%)" }}>
                    {s}
                  </span>
                  <Check initial />
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-10">
              <span className="flex items-center gap-3 text-xl font-bold text-neutral-800 dark:text-neutral-100">Select All <Check initial /></span>
              <span className="flex items-center gap-3 text-xl font-bold text-neutral-800 dark:text-neutral-100">Deselect All <Check /></span>
              <button className="ml-auto h-14 rounded-lg bg-mint-deep px-10 text-lg font-extrabold tracking-wider text-white shadow hover:brightness-105">SAVE THE DAY</button>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-16">
            {["Repeat for the week", "Repeat for the month", "Repeat for the year"].map(r => (
              <span key={r} className="flex items-center gap-3 text-xl font-bold text-neutral-800 dark:text-neutral-100"><Check /> {r}</span>
            ))}
          </div>
        </div>
      </div>
      <ActionBar />
    </PageCard>
  );
}
