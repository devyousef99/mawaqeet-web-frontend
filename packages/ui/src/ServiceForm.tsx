"use client";
import { PageCard } from "./TableShell";
import { ActionBar, DayChip, PillSelect, UploadBox } from "./ui";
import { GradientCard } from "./GradientCard";
import { EmployeePicker } from "./EmployeePicker";

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-3 text-[15px] font-bold uppercase tracking-wide text-neutral-700 dark:text-neutral-300">{children}</div>
);
const SoftLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4 text-xl font-bold text-neutral-400">{children}</div>
);

/* blank = "create" mode (empty inputs, no preview card, no remove button) */
export function ServiceForm({ blank }: { blank?: boolean }) {
  return (
    <PageCard>
      <div className="grid grid-cols-1 gap-14 xl:grid-cols-[380px_1fr]">
        {/* left column */}
        <div>
          {!blank && (
            <GradientCard className="mb-10 w-full max-w-sm">
              <div className="flex items-start gap-4">
                <svg viewBox="0 0 24 24" className="size-12 shrink-0 text-white" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="12" cy="5" r="2.4" /><path d="M8 10c2 2 6 2 8 0M5 19h14M7 15c2 1.5 8 1.5 10 0" /></svg>
                <div>
                  <div className="border-b border-white/60 pb-2 text-xl font-bold">45 Full body Massage</div>
                  <p className="mt-3 text-[13px] font-semibold leading-relaxed text-white/90">
                    45 Minutes full body massaging includes feet, hand an nick with a Thailand way therapy
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-lg font-bold tracking-widest">MASSAGE</span>
                <span className="rounded-lg border-2 border-white/80 px-4 py-1 text-lg font-bold">180 S.R</span>
              </div>
            </GradientCard>
          )}

          <Label>SERVICE NAME</Label>
          <input defaultValue={blank ? undefined : "45 FULL BODY MASSAGE"} placeholder="ENTER SERVICE NAME"
            className="mb-8 h-14 w-full rounded-full bg-fog px-7 text-[15px] font-bold uppercase text-neutral-700 outline-none focus:ring-2 focus:ring-brand/50 dark:bg-white/10 dark:text-neutral-200" />

          <Label>SERVICE DESCRIPTION</Label>
          <textarea defaultValue={blank ? undefined : "45 MINUTES FULL BODY MASSAGING INCLUDES FEET, HAND AN NICK WITH A THAILAND WAY THERAPY"} placeholder="ENTER A DESCRIPTION OF SERVICE"
            className="mb-8 h-40 w-full resize-none rounded-3xl bg-fog p-7 text-[15px] font-bold uppercase leading-relaxed text-neutral-700 outline-none focus:ring-2 focus:ring-brand/50 dark:bg-white/10 dark:text-neutral-200" />

          <SoftLabel>Price</SoftLabel>
          <div className="mb-8 flex items-center gap-4">
            <input defaultValue={blank ? undefined : "180"} className="h-12 w-44 rounded border border-neutral-300 text-center text-lg font-bold text-neutral-700 shadow-inner outline-none dark:border-white/20 dark:bg-transparent dark:text-neutral-200" />
            <PillSelect label="SR" tone="mint" className="w-24" />
          </div>
          <SoftLabel>Discount Price</SoftLabel>
          <div className="flex items-center gap-4">
            <input className="h-12 w-44 rounded border border-neutral-300 text-center text-lg font-bold shadow-inner outline-none dark:border-white/20 dark:bg-transparent" />
            <PillSelect label="SR" tone="mint" className="w-24" />
          </div>
        </div>

        {/* right column */}
        <div>
          <div className="mb-10 flex justify-end"><UploadBox label="UPLOAD SERVICE LOGO" /></div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
            <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
              {["SUNDAY", "TUESEDAY", "THURSDAY", "SATURDAY", "MONDAY", "WEDNESDAY", "FRIDAY"].map((d, i) => (
                <div key={d}>
                  <div className="mb-2 text-sm font-bold text-neutral-600 dark:text-neutral-300">{d}</div>
                  <DayChip initial={blank || ![1, 5].includes(i)} />
                </div>
              ))}
            </div>
            <div>
              <h3 className="mb-5 text-2xl font-bold text-neutral-400">Working Hours</h3>
              <div className="space-y-4">
                {["From", "To"].map((w, i) => (
                  <div key={w} className="flex items-center gap-4">
                    <span className="w-12 text-lg font-semibold text-neutral-400">{w}</span>
                    <PillSelect label={blank ? "1" : i === 0 ? "10" : "11"} tone="mint" className="w-24" />
                    <PillSelect label={i === 0 ? "AM" : "PM"} tone="mint" className="w-24" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div>
              <SoftLabel>Type of service</SoftLabel>
              <PillSelect label={blank ? "SELECT" : "MASSAGE"} tone="mint" className="w-full" />
            </div>
            <div>
              <SoftLabel>Time Slot</SoftLabel>
              <div className="flex gap-3">
                <PillSelect label={blank ? "1" : "45"} tone="mint" className="w-24" />
                <PillSelect label="MINUTES" tone="mint" className="flex-1" />
              </div>
            </div>
            <div>
              <SoftLabel>Employees Num</SoftLabel>
              <PillSelect label={blank ? "1" : "11"} tone="mint" className="w-28" />
            </div>
          </div>

          <div className="mt-12">
            <SoftLabel>Select Employees</SoftLabel>
            <EmployeePicker />
          </div>
        </div>
      </div>
      <ActionBar remove={!blank} removeLabel="REMOVE SERVICE" />
    </PageCard>
  );
}
