"use client";
import { PageCard } from "@/components/TableShell";
import { ActionBar, Avatar, DayChip, PillSelect, UploadBox } from "@/components/ui";
import { GradientCard } from "@/components/GradientCard";
import { days } from "@/lib/data";

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-3 text-[15px] font-bold uppercase tracking-wide text-neutral-700 dark:text-neutral-300">{children}</div>
);

function TimeBox({ value, active }: { value: string; active?: boolean }) {
  return (
    <input defaultValue={value}
      className={`h-12 w-40 rounded border text-center text-lg font-bold outline-none ${
        active
          ? "border-teal-400 bg-gradient-to-b from-teal-50 to-white text-neutral-700 dark:from-teal-900/30 dark:to-transparent dark:text-neutral-200"
          : "border-neutral-300 text-neutral-400 shadow-inner dark:border-white/15 dark:bg-transparent"
      }`} />
  );
}

/* blank = "create" mode (empty inputs, no preview card, no remove button) */
export function EmployeeForm({ blank }: { blank?: boolean }) {
  return (
    <PageCard>
      <div className="grid grid-cols-1 gap-14 xl:grid-cols-[360px_1fr]">
        <div>
          {!blank && (
            <GradientCard className="mb-12 w-full max-w-sm">
              <div className="flex items-center gap-4">
                <Avatar name="Martin Garrix" size={72} />
                <div>
                  <div className="border-b border-white/60 pb-1 text-2xl font-bold">Martin Garrix</div>
                  <div className="mt-2 flex items-center gap-2 text-sm font-bold tracking-wider"><span className="size-2.5 rounded-full bg-white/70" /> VACATION</div>
                </div>
              </div>
              <div className="mt-8 flex items-center justify-between">
                <span className="text-lg font-bold tracking-widest">MASSAGE</span>
                <span className="rounded-lg border-2 border-white/80 px-6 py-1 text-lg font-bold">5</span>
              </div>
            </GradientCard>
          )}

          <Label>NAME</Label>
          <input defaultValue={blank ? undefined : "MARTIN GARRIX"} placeholder="ENTER EMPLOYEE NAME"
            className="mb-8 h-14 w-full rounded-full bg-fog text-center text-[15px] font-bold uppercase text-neutral-500 outline-none focus:ring-2 focus:ring-brand/50 dark:bg-white/10 dark:text-neutral-300" />
          <Label>JOB DESCRIPTION</Label>
          <PillSelect label="MASSAGE" className="mb-8 w-full" />
          <Label>WORKING STATUS</Label>
          <PillSelect label="VACATION" className="mb-8 w-full" />
          <Label>EMPLOYEE NUMBER</Label>
          <input defaultValue={blank ? undefined : "69"} placeholder="0"
            className="h-14 w-full rounded-full bg-fog text-center text-[15px] font-bold text-neutral-500 outline-none focus:ring-2 focus:ring-brand/50 dark:bg-white/10 dark:text-neutral-300" />
        </div>

        <div>
          <div className="mb-10 flex justify-end"><UploadBox label="UPLOAD EMPLOYEE IMAGE" /></div>
          <div className="space-y-6">
            {days.map((d, i) => (
              <div key={d} className="grid grid-cols-1 items-end gap-6 lg:grid-cols-[220px_1fr]">
                <div>
                  <div className="mb-2 text-sm font-bold text-neutral-600 dark:text-neutral-300">{d}</div>
                  <DayChip initial={![2, 3].includes(i)} wide />
                </div>
                <div className="flex items-end gap-6">
                  <div>
                    <div className="mb-2 text-sm font-bold text-neutral-600 dark:text-neutral-300">FROM</div>
                    <TimeBox value="00:00" active={![1, 2].includes(i)} />
                  </div>
                  <span className="mb-5 h-0.5 w-10 bg-neutral-800 dark:bg-neutral-300" />
                  <div>
                    <div className="mb-2 text-sm font-bold text-neutral-600 dark:text-neutral-300">TO</div>
                    <TimeBox value="09:00" active={![1, 2].includes(i)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ActionBar remove={!blank} removeLabel="REMOVE EMPLOYEE" />
    </PageCard>
  );
}
