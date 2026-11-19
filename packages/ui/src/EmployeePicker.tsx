"use client";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, Check } from "./ui";
import { CheckField } from "./form";
import { employees as seedEmployees, type Employee } from "@mawaqeet/data";

/**
 * Horizontal employee carousel.
 * Controlled when `value`/`onChange` are given (ids of the selected employees);
 * otherwise falls back to self-contained demo state.
 */
export function EmployeePicker({
  title, value, onChange, list = seedEmployees, max,
}: {
  title?: string;
  value?: number[];
  onChange?: (ids: number[]) => void;
  list?: Employee[];
  /** Optional cap on how many can be selected. */
  max?: number;
}) {
  const [inner, setInner] = useState<number[]>(() => list.filter((_, i) => i % 3 === 0).map(e => e.id));
  const selected = value ?? inner;
  const set = onChange ?? setInner;
  const scroller = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => scroller.current?.scrollBy({ left: dir * 240, behavior: "smooth" });

  const toggle = (id: number, on: boolean) => {
    if (on) {
      if (max && selected.length >= max) return;
      set([...selected, id]);
    } else set(selected.filter(x => x !== id));
  };

  return (
    <div>
      {title && <h3 className="mb-4 text-xl font-bold text-neutral-400">{title}</h3>}
      <div className="flex items-center gap-2 rounded-md border border-grape/40 p-3 sm:gap-4 sm:p-5">
        <button type="button" onClick={() => scroll(-1)} className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-white/10 dark:text-white sm:size-10" aria-label="Previous employees">
          <ChevronLeft className="size-5" />
        </button>
        <div ref={scroller} className="no-scrollbar flex min-w-0 flex-1 items-start gap-3 overflow-x-auto scroll-smooth sm:gap-5">
          {list.map(e => {
            const on = selected.includes(e.id);
            return (
              <div key={e.id} className="flex w-20 shrink-0 flex-col items-center gap-2 sm:w-24">
                <button type="button" onClick={() => toggle(e.id, !on)} className={`rounded-full transition-shadow ${on ? "ring-4 ring-brand/40" : ""}`} aria-label={`Toggle ${e.name}`}>
                  <Avatar name={e.name} size={56} dot={e.dot} />
                </button>
                <span className="w-full truncate text-center text-xs font-bold text-neutral-700 dark:text-neutral-200" title={e.name}>{e.name}</span>
                <span className="text-[10px] font-semibold uppercase text-neutral-400">{e.job}</span>
                <CheckField checked={on} onChange={v => toggle(e.id, v)} />
              </div>
            );
          })}
        </div>
        <button type="button" onClick={() => scroll(1)} className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-white/10 dark:text-white sm:size-10" aria-label="Next employees">
          <ChevronRight className="size-5" />
        </button>
      </div>
      <div className="mt-2 text-xs font-semibold text-neutral-400">
        {selected.length} selected{max ? ` / ${max}` : ""}
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
