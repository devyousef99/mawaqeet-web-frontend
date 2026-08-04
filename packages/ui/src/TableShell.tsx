"use client";
import { ArrowDownWideNarrow, ChevronDown, ChevronLeft, ChevronRight, Filter, Search } from "lucide-react";
import { PillSelect } from "./ui";

export function PageCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl bg-white p-8 shadow-[0_1px_4px_rgba(15,23,42,0.06)] dark:bg-night-2 ${className}`}>
      {children}
    </div>
  );
}

export function TableHeader({
  title, selects = [], search = true, action, sortFilter = true,
}: {
  title: string;
  selects?: string[];
  search?: boolean;
  action?: { label: string; onClick?: () => void } | { label: string; onClick?: () => void }[];
  sortFilter?: boolean;
}) {
  const actions = action ? (Array.isArray(action) ? action : [action]) : [];
  return (
    <div className="mb-8 flex flex-wrap items-center gap-5">
      <h2 className="text-[26px] font-extrabold tracking-wide text-neutral-800 dark:text-white">{title}</h2>
      {selects.map(s => <PillSelect key={s} label={s} className="w-52" />)}
      {search && (
        <label className="flex h-11 w-72 items-center gap-3 rounded-full bg-fog px-5 text-neutral-400 dark:bg-white/10">
          <Search className="size-4" />
          <input placeholder="Search" className="w-full bg-transparent text-sm font-semibold outline-none dark:text-neutral-200" />
        </label>
      )}
      {actions.map(a => (
        <button key={a.label} onClick={a.onClick}
          className="h-11 rounded-full bg-neutral-200 px-6 text-[15px] font-bold text-neutral-800 shadow-sm transition-colors hover:bg-neutral-300 dark:bg-white/15 dark:text-white dark:hover:bg-white/25">
          {a.label}
        </button>
      ))}
      {sortFilter && (
        <div className="ml-auto flex items-center gap-8 text-neutral-500 dark:text-neutral-300">
          <button className="flex items-center gap-2 text-lg font-semibold hover:text-neutral-800 dark:hover:text-white">
            <ArrowDownWideNarrow className="size-5" /> Sort
          </button>
          <button className="flex items-center gap-2 text-lg font-semibold hover:text-neutral-800 dark:hover:text-white">
            <Filter className="size-5" /> Filter
          </button>
        </div>
      )}
    </div>
  );
}

export function Table({ cols, children }: { cols: string[]; children: React.ReactNode }) {
  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr>
          {cols.map(c => (
            <th key={c} className="pb-4 text-[15px] font-bold text-neutral-400 dark:text-neutral-500">{c}</th>
          ))}
          <th className="pb-4" />
        </tr>
      </thead>
      <tbody className="divide-y divide-neutral-100 dark:divide-white/5">{children}</tbody>
    </table>
  );
}

export function TableFooter({ total = "1-7 of 1240" }: { total?: string }) {
  return (
    <div className="mt-6 flex items-center justify-end gap-10 border-t border-neutral-100 pt-5 text-[15px] font-semibold text-neutral-400 dark:border-white/5">
      <span className="flex items-center gap-2">
        Rows per page: <span className="flex items-center gap-1 text-neutral-600 dark:text-neutral-200">7 <ChevronDown className="size-4" /></span>
      </span>
      <span>{total}</span>
      <span className="flex items-center gap-6">
        <button className="hover:text-neutral-700 dark:hover:text-white" aria-label="Previous page"><ChevronLeft className="size-5" /></button>
        <button className="hover:text-neutral-700 dark:hover:text-white" aria-label="Next page"><ChevronRight className="size-5" /></button>
      </span>
    </div>
  );
}
