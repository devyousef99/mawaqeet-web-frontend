"use client";
import { useState } from "react";
import { ChevronDown, MoreVertical } from "lucide-react";
import type { Status } from "@mawaqeet/data";

/* ---------- status dot ---------- */
const dotColor: Record<Status, string> = { green: "bg-emerald-400", yellow: "bg-amber-300", red: "bg-red-400" };
export const Dot = ({ s, className = "" }: { s: Status; className?: string }) => (
  <span className={`inline-block size-2.5 rounded-full ${dotColor[s]} ${className}`} aria-hidden />
);

/* ---------- avatar with initials ---------- */
const palette = ["#6c5ce7", "#1fb9a9", "#f4726a", "#f6c863", "#3b82f6", "#8e6cf0"];
export function Avatar({ name, size = 44, dot }: { name: string; size?: number; dot?: Status }) {
  const initials = name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const bg = palette[(name.charCodeAt(0) + name.length) % palette.length];
  return (
    <span className="relative inline-block shrink-0">
      <span
        className="flex items-center justify-center rounded-full font-bold text-white"
        style={{ width: size, height: size, background: bg, fontSize: size * 0.36 }}
      >
        {initials}
      </span>
      {dot && <Dot s={dot} className="absolute bottom-0 left-0 ring-2 ring-white dark:ring-night-2" />}
    </span>
  );
}

/* ---------- pill select / input (the gray rounded controls) ---------- */
export function PillSelect({ label, className = "", tone = "gray" }: { label: string; className?: string; tone?: "gray" | "mint" }) {
  const tones = tone === "mint"
    ? "bg-mint/70 text-emerald-900 dark:bg-mint/20 dark:text-mint"
    : "bg-fog text-neutral-600 dark:bg-white/10 dark:text-neutral-300";
  return (
    <button type="button" className={`flex h-11 items-center justify-center gap-3 rounded-lg px-5 text-[13px] font-bold tracking-wide transition-transform active:scale-[0.98] ${tones} ${className}`}>
      <span className="truncate">{label}</span>
      <ChevronDown className="size-4 opacity-70" />
    </button>
  );
}

export function PillInput({ placeholder, className = "", center = true }: { placeholder: string; className?: string; center?: boolean }) {
  return (
    <input
      placeholder={placeholder}
      className={`h-12 rounded-full bg-fog px-6 text-sm font-semibold text-neutral-700 outline-none placeholder:uppercase placeholder:tracking-wide placeholder:text-neutral-400 focus:ring-2 focus:ring-brand/50 dark:bg-white/10 dark:text-neutral-200 ${center ? "text-center placeholder:text-center" : ""} ${className}`}
    />
  );
}

/* ---------- ON / OFF day chip ---------- */
export function DayChip({ initial = true, wide = false }: { initial?: boolean; wide?: boolean }) {
  const [on, setOn] = useState(initial);
  return (
    <button
      type="button"
      onClick={() => setOn(o => !o)}
      className={`flex h-10 items-center justify-between rounded-lg px-4 text-sm font-extrabold tracking-wide transition-colors ${wide ? "w-56" : "w-28"} ${
        on ? "bg-mint text-emerald-900" : "bg-coral text-rose-900"
      }`}
      aria-pressed={on}
    >
      <span className="mx-auto">{on ? "ON" : "OFF"}</span>
      <ChevronDown className="size-4 opacity-60" />
    </button>
  );
}

/* ---------- toggle switch (status OFF pill) ---------- */
export function Toggle({ initial = false }: { initial?: boolean }) {
  const [on, setOn] = useState(initial);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setOn(o => !o)}
      className={`relative flex h-9 w-[86px] items-center rounded-full px-3 text-xs font-extrabold text-white transition-colors ${on ? "bg-emerald-400" : "bg-coral-deep/80"}`}
    >
      <span className="absolute left-4">{on ? "ON" : "OFF"}</span>
      <span className="absolute right-1 size-7 rounded-full bg-white shadow" />
    </button>
  );
}

/* ---------- checkbox (dark teal filled) ---------- */
export function Check({ initial = false, size = 22 }: { initial?: boolean; size?: number }) {
  const [c, setC] = useState(initial);
  return (
    <button
      type="button"
      aria-checked={c}
      role="checkbox"
      onClick={() => setC(v => !v)}
      className={`flex items-center justify-center rounded-[5px] border-2 transition-colors ${c ? "border-slate-800 bg-slate-800 text-white dark:border-teal-500 dark:bg-teal-600" : "border-slate-400 bg-white dark:bg-transparent"}`}
      style={{ width: size, height: size }}
    >
      {c && (
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12.5 9.5 18 20 6.5" />
        </svg>
      )}
    </button>
  );
}

/* ---------- cancel / save action bar ---------- */
export function ActionBar({ remove, removeLabel = "REMOVE" }: { remove?: boolean; removeLabel?: string }) {
  return (
    <div className="mt-12 flex items-center gap-8">
      <button className="h-12 w-56 rounded-lg bg-coral text-base font-extrabold tracking-wider text-white shadow transition-transform hover:brightness-105 active:scale-[0.98]">
        CANCEL
      </button>
      <button className="h-12 w-56 rounded-lg bg-mint-deep text-base font-extrabold tracking-wider text-white shadow transition-transform hover:brightness-105 active:scale-[0.98]">
        SAVE
      </button>
      {remove && (
        <button className="ml-auto flex h-12 items-center gap-2 rounded-lg bg-coral-deep px-6 text-base font-extrabold tracking-wider text-white shadow transition-transform hover:brightness-105 active:scale-[0.98]">
          {removeLabel}
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14" /></svg>
        </button>
      )}
    </div>
  );
}

export const Kebab = () => (
  <button className="rounded p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/10" aria-label="Row actions">
    <MoreVertical className="size-5" />
  </button>
);

/* ---------- upload dashed box ---------- */
export function UploadBox({ label }: { label: string }) {
  return (
    <button className="flex h-24 w-72 items-center justify-center gap-4 rounded-md border-2 border-dashed border-neutral-400 text-sm font-extrabold tracking-wide text-neutral-800 transition-colors hover:border-grape hover:text-grape dark:border-neutral-500 dark:text-neutral-200">
      <svg viewBox="0 0 24 24" className="size-9 text-grape" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="4" y="3" width="16" height="18" rx="2" /><path d="M12 15V8m0 0-3 3m3-3 3 3" />
      </svg>
      <span className="max-w-40 text-left leading-snug">{label}</span>
    </button>
  );
}
