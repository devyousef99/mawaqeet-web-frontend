"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, Check } from "@/components/ui";
import { employees } from "@/lib/data";

export function EmployeePicker({ title }: { title?: string }) {
  const list = employees.slice(0, 6);
  return (
    <div>
      {title && <h3 className="mb-4 text-xl font-bold text-neutral-400">{title}</h3>}
      <div className="flex items-center gap-4 rounded-md border border-grape/40 p-5">
        <button className="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-white/10 dark:text-white" aria-label="Previous employees">
          <ChevronLeft className="size-5" />
        </button>
        <div className="no-scrollbar flex flex-1 items-start justify-between gap-4 overflow-x-auto">
          {list.map((e, i) => (
            <div key={i} className="flex w-24 shrink-0 flex-col items-center gap-2">
              <Avatar name={e.name} size={62} dot={e.dot} />
              <span className="truncate text-xs font-bold text-neutral-700 dark:text-neutral-200">{e.name}</span>
              <Check initial={i % 3 === 0} />
            </div>
          ))}
        </div>
        <button className="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-white/10 dark:text-white" aria-label="Next employees">
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}

export function ServicePicker() {
  const svcs = [
    { n: "Beard Shave", c: true }, { n: "Nail Treatment", c: false }, { n: "1 H Hot Stone", c: false },
    { n: "Moroccan bath", c: true }, { n: "Face Cleaning", c: false }, { n: "Monicare", c: true },
  ];
  return (
    <div className="flex items-center gap-4 rounded-md border border-grape/40 p-5">
      <button className="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-white/10 dark:text-white" aria-label="Previous services">
        <ChevronLeft className="size-5" />
      </button>
      <div className="no-scrollbar flex flex-1 items-start justify-between gap-4 overflow-x-auto">
        {svcs.map((s, i) => (
          <div key={i} className="flex w-24 shrink-0 flex-col items-center gap-2">
            <span className={`flex size-14 items-center justify-center rounded-full ${["bg-[#c9b49a]", "bg-[#f0813c]", "bg-teal-50", "bg-neutral-100", "bg-[#c9b49a]", "bg-[#f0813c]"][i]}`}>
              <svg viewBox="0 0 24 24" className="size-6 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="8" r="3" /><path d="M5 21c1-4 4-6 7-6s6 2 7 6" /></svg>
            </span>
            <span className="truncate text-[11px] font-bold text-neutral-700 dark:text-neutral-200">{s.n}</span>
            <Check initial={s.c} />
          </div>
        ))}
      </div>
      <button className="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-white/10 dark:text-white" aria-label="Next services">
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}
