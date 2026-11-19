"use client";
import { useEffect, useRef, useState } from "react";
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
      {dot && <Dot s={dot} className="absolute bottom-0 start-0 ring-2 ring-white dark:ring-night-2" />}
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
      <span className="absolute start-4">{on ? "ON" : "OFF"}</span>
      <span className="absolute end-1 size-7 rounded-full bg-white shadow" />
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
export function ActionBar({
  remove, removeLabel = "REMOVE", onCancel, onSave, onRemove, saveLabel = "SAVE", cancelLabel = "CANCEL", disabled,
}: {
  remove?: boolean;
  removeLabel?: string;
  onCancel?: () => void;
  onSave?: () => void;
  onRemove?: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  disabled?: boolean;
}) {
  const base = "flex h-12 items-center justify-center gap-2 rounded-lg text-base font-extrabold tracking-wider text-white shadow transition-transform hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";
  return (
    <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
      <button type="button" onClick={onCancel} className={`${base} bg-coral sm:w-48 lg:w-56`}>
        {cancelLabel}
      </button>
      <button type={onSave ? "button" : "submit"} onClick={onSave} disabled={disabled} className={`${base} bg-mint-deep sm:w-48 lg:w-56`}>
        {saveLabel}
      </button>
      {remove && (
        <button type="button" onClick={onRemove} className={`${base} bg-coral-deep px-6 sm:ms-auto`}>
          {removeLabel}
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14" /></svg>
        </button>
      )}
    </div>
  );
}

export const Kebab = ({ onClick }: { onClick?: () => void }) => (
  <button type="button" onClick={onClick} className="rounded p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/10" aria-label="Row actions">
    <MoreVertical className="size-5" />
  </button>
);

/* ---------- row actions menu (working kebab) ---------- */
export type RowAction = { label: string; onClick: () => void; tone?: "default" | "danger"; icon?: React.ReactNode };

export function RowMenu({ actions, align = "end" }: { actions: RowAction[]; align?: "start" | "end" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);
  if (!actions.length) return null;
  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Row actions"
        className={`rounded p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/10 ${open ? "bg-neutral-100 dark:bg-white/10" : ""}`}
      >
        <MoreVertical className="size-5" />
      </button>
      {open && (
        <div
          role="menu"
          className={`absolute top-full z-30 mt-1 min-w-40 overflow-hidden rounded-lg border border-neutral-200 bg-white py-1 text-start shadow-xl dark:border-white/10 dark:bg-night-2 ${align === "end" ? "end-0" : "start-0"}`}
        >
          {actions.map(a => (
            <button
              key={a.label}
              role="menuitem"
              type="button"
              onClick={() => { setOpen(false); a.onClick(); }}
              className={`flex w-full items-center gap-2 px-4 py-2 text-sm font-bold transition-colors hover:bg-neutral-100 dark:hover:bg-white/10 ${
                a.tone === "danger" ? "text-coral-deep" : "text-neutral-700 dark:text-neutral-200"
              }`}
            >
              {a.icon}{a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- upload dashed box ---------- */
export function UploadBox({ label, value, onChange, className = "" }: { label: string; value?: string; onChange?: (dataUrl: string) => void; className?: string }) {
  const input = useRef<HTMLInputElement>(null);
  const pick = (file?: File) => {
    if (!file || !onChange) return;
    const r = new FileReader();
    r.onload = () => onChange(String(r.result));
    r.readAsDataURL(file);
  };
  return (
    <>
      <button
        type="button"
        onClick={() => input.current?.click()}
        className={`flex h-24 w-full max-w-72 items-center justify-center gap-4 overflow-hidden rounded-md border-2 border-dashed border-neutral-400 px-4 text-sm font-extrabold tracking-wide text-neutral-800 transition-colors hover:border-grape hover:text-grape dark:border-neutral-500 dark:text-neutral-200 ${className}`}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="size-16 shrink-0 rounded-md object-cover" />
        ) : (
          <svg viewBox="0 0 24 24" className="size-9 shrink-0 text-grape" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="4" y="3" width="16" height="18" rx="2" /><path d="M12 15V8m0 0-3 3m3-3 3 3" />
          </svg>
        )}
        <span className="max-w-40 text-start leading-snug">{value ? "CHANGE IMAGE" : label}</span>
      </button>
      {onChange && <input ref={input} type="file" accept="image/*" className="hidden" onChange={e => pick(e.target.files?.[0])} />}
    </>
  );
}
