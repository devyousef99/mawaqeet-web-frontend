"use client";
import { PageCard } from "./TableShell";
import { ActionBar, PillSelect, Toggle } from "./ui";
import { ServicePicker } from "./EmployeePicker";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-3 text-[15px] font-bold uppercase tracking-wide text-neutral-700 dark:text-neutral-300">{children}</div>
);

function MiniCalendar() {
  const weeks = [
    ["31", "1", "2", "3", "4", "5", "6"],
    ["7", "8", "9", "10", "11", "12", "13"],
    ["14", "15", "15", "17", "18", "19", "20"],
    ["21", "22", "23", "24", "25", "26", "27"],
  ];
  return (
    <div className="w-80">
      <div className="mb-4 flex items-center justify-between px-2">
        <button className="flex size-9 items-center justify-center rounded-full bg-teal-50 text-teal-500 dark:bg-white/10" aria-label="Previous month"><ChevronLeft className="size-5" /></button>
        <span className="text-lg font-extrabold text-neutral-800 dark:text-neutral-100">JANUARY&nbsp; 2023</span>
        <button className="flex size-9 items-center justify-center rounded-full bg-teal-50 text-teal-500 dark:bg-white/10" aria-label="Next month"><ChevronRight className="size-5" /></button>
      </div>
      <div className="grid grid-cols-7 gap-y-4 text-center text-[15px] font-extrabold text-neutral-800 dark:text-neutral-100">
        {["MO", "TU", "WE", "TH", "FR", "SA", "SU"].map(d => <span key={d}>{d}</span>)}
        {weeks.flat().map((d, i) => (
          <span key={i} className={`mx-auto flex size-9 items-center justify-center rounded-lg font-bold ${
            i === 0 ? "text-neutral-300" : d === "9" && i === 9 ? "border-2 border-teal-400 text-teal-500" : "text-neutral-700 dark:text-neutral-200"}`}>
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}

/* blank = "create" mode (empty inputs) */
export function PromoForm({ blank }: { blank?: boolean }) {
  return (
    <PageCard>
      <div className="grid grid-cols-1 gap-14 xl:grid-cols-[340px_1fr]">
        <div>
          <Label>PROMOCODE NAME</Label>
          <input defaultValue={blank ? undefined : "RAMADAN-2023"} placeholder="ENTER PROMOCODE NAME"
            className="mb-8 h-14 w-full rounded-full bg-fog text-center text-[15px] font-extrabold text-neutral-700 outline-none dark:bg-white/10 dark:text-neutral-200" />
          <Label>SELECT CATEGORY</Label>
          <PillSelect label={blank ? "SELECT" : "MASSAGE"} className="mb-8 w-full" />
          <Label>CAPACITY</Label>
          <input defaultValue={blank ? undefined : "69"} placeholder="0"
            className="mb-8 h-14 w-full rounded-full bg-fog text-center text-[15px] font-extrabold text-neutral-700 outline-none dark:bg-white/10 dark:text-neutral-200" />
          <Label>STATUS</Label>
          <Toggle />
        </div>
        <div>
          <h3 className="mb-5 text-2xl font-bold text-neutral-400">Select The Defined Service</h3>
          <ServicePicker />
          <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-3 text-center text-sm font-extrabold tracking-wider text-neutral-400">START DATE</div>
              <input defaultValue={blank ? undefined : "09/1/2023"} placeholder="DD/MM/YYYY"
                className="mx-auto mb-6 block h-11 w-40 rounded border border-neutral-300 text-center font-bold text-neutral-500 outline-none dark:border-white/20 dark:bg-transparent" />
              <div className="mx-auto w-fit"><MiniCalendar /></div>
            </div>
            <div>
              <div className="mb-3 text-center text-sm font-extrabold tracking-wider text-neutral-400">END DATE</div>
              <input defaultValue={blank ? undefined : "09/1/2024"} placeholder="DD/MM/YYYY"
                className="mx-auto mb-6 block h-11 w-44 rounded border-2 border-teal-400 text-center text-lg font-extrabold text-neutral-800 outline-none dark:bg-transparent dark:text-neutral-100" />
              <div className="mx-auto w-fit"><MiniCalendar /></div>
            </div>
          </div>
        </div>
      </div>
      <ActionBar remove={!blank} removeLabel="REMOVE PROMOTION" />
    </PageCard>
  );
}
