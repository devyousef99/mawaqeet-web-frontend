"use client";
import { useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Controlled form primitives.                                        */
/*                                                                     */
/*  ui.tsx's PillSelect / Toggle are presentational (uncontrolled) and  */
/*  used across the mock screens; these are their controlled siblings   */
/*  for screens that drive real state.                                  */
/* ------------------------------------------------------------------ */

/** Labelled <select> styled like the project's pill controls. */
export function SelectField<T extends string | number>({
  label, value, onChange, options, className = "", tone = "gray", placeholder, center = false, name,
}: {
  label?: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  className?: string;
  /** gray = filter pills, mint = the green form pills */
  tone?: "gray" | "mint";
  /** Rendered as a disabled first option when value is "" / 0. */
  placeholder?: string;
  center?: boolean;
  name?: string;
}) {
  const isNumeric = typeof value === "number";
  const tones = tone === "mint"
    ? "bg-mint/70 text-emerald-900 dark:bg-mint/20 dark:text-mint"
    : "bg-fog text-neutral-700 dark:bg-white/10 dark:text-neutral-200";
  return (
    <label className={`flex min-w-0 flex-col gap-1.5 ${className}`}>
      {label && (
        <span className="text-xs font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          {label}
        </span>
      )}
      <span className="relative block">
        <select
          name={name}
          value={value}
          onChange={e => onChange((isNumeric ? Number(e.target.value) : e.target.value) as T)}
          className={`h-11 w-full cursor-pointer appearance-none truncate rounded-lg ps-4 pe-10 text-[13px] font-bold tracking-wide outline-none transition-shadow focus:ring-2 focus:ring-brand/50 ${center ? "text-center" : ""} ${tones}`}
        >
          {placeholder && (
            <option value="" disabled className="bg-white text-neutral-500 dark:bg-night-2">{placeholder}</option>
          )}
          {options.map(o => (
            <option key={String(o.value)} value={o.value} className="bg-white text-neutral-800 dark:bg-night-2 dark:text-neutral-100">
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 opacity-70" />
      </span>
    </label>
  );
}

/** Controlled text / number input in the project's pill or boxed styling. */
export function TextField({
  label, value, onChange, placeholder, type = "text", className = "", variant = "pill", center = false, min, step, required,
}: {
  label?: string;
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: "text" | "number" | "password" | "tel" | "date";
  className?: string;
  variant?: "pill" | "box";
  center?: boolean;
  min?: number;
  step?: number;
  required?: boolean;
}) {
  const styles = variant === "pill"
    ? "h-12 rounded-full bg-fog px-6 text-[14px] font-bold uppercase text-neutral-700 placeholder:normal-case placeholder:uppercase placeholder:tracking-wide placeholder:text-neutral-400 dark:bg-white/10 dark:text-neutral-200"
    : "h-12 rounded border border-neutral-300 px-4 text-lg font-bold text-neutral-700 shadow-inner dark:border-white/20 dark:bg-transparent dark:text-neutral-200";
  return (
    <label className={`flex min-w-0 flex-col gap-1.5 ${className}`}>
      {label && (
        <span className="text-xs font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{label}</span>
      )}
      <input
        type={type}
        value={value}
        min={min}
        step={step}
        required={required}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className={`w-full outline-none transition-shadow focus:ring-2 focus:ring-brand/50 ${center ? "text-center" : ""} ${styles}`}
      />
    </label>
  );
}

/** Controlled checkbox — the project's `Check` owns its own state; this one doesn't. */
export function CheckField({
  checked, onChange, label, size = 22, className = "",
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  size?: number;
  className?: string;
}) {
  return (
    <label className={`inline-flex cursor-pointer select-none items-center gap-3 ${className}`}>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`flex shrink-0 items-center justify-center rounded-[5px] border-2 transition-colors ${
          checked ? "border-slate-800 bg-slate-800 text-white dark:border-teal-500 dark:bg-teal-600" : "border-slate-400 bg-white dark:bg-transparent"
        }`}
        style={{ width: size, height: size }}
      >
        {checked && (
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12.5 9.5 18 20 6.5" />
          </svg>
        )}
      </button>
      {label && <span className="text-[15px] font-bold text-neutral-800 dark:text-neutral-100">{label}</span>}
    </label>
  );
}

/** Controlled ON / OFF chip (the day toggles). */
export function DayToggle({
  on, onChange, className = "",
}: {
  on: boolean;
  onChange: (on: boolean) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => onChange(!on)}
      className={`flex h-11 w-full items-center justify-between rounded-lg px-4 text-sm font-extrabold tracking-wide transition-colors ${
        on ? "bg-mint text-emerald-900" : "bg-coral text-rose-900"
      } ${className}`}
    >
      <span className="mx-auto">{on ? "ON" : "OFF"}</span>
      <ChevronDown className="size-4 opacity-60" />
    </button>
  );
}

/** Small inline status message shown after save / validation. */
export function FormNotice({ kind, children }: { kind: "error" | "success"; children: React.ReactNode }) {
  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      className={`mt-6 rounded-lg px-4 py-3 text-sm font-bold ${
        kind === "error"
          ? "bg-coral/30 text-rose-900 dark:bg-coral-deep/20 dark:text-coral"
          : "bg-mint/40 text-emerald-900 dark:bg-mint/15 dark:text-mint"
      }`}
    >
      {children}
    </div>
  );
}

/** Controlled switch — the project's Toggle keeps its own state, this one doesn't. */
export function SwitchField({
  checked, onChange, label, id,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  id?: string;
}) {
  return (
    <label htmlFor={id} className="inline-flex cursor-pointer items-center gap-3">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
          checked ? "bg-brand" : "bg-neutral-300 dark:bg-white/20"
        }`}
      >
        <span
          className={`absolute top-1 size-5 rounded-full bg-white shadow transition-[inset-inline-start] ${
            checked ? "start-6" : "start-1"
          }`}
        />
      </button>
      {label && (
        <span className="text-[15px] font-bold text-neutral-700 dark:text-neutral-200">{label}</span>
      )}
    </label>
  );
}

/** Minimal modal. Closes on Escape and on backdrop click. */
export function Modal({
  open, onClose, title, children, footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative z-10 w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl dark:bg-night-2"
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-xl font-extrabold text-neutral-800 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>
        {children}
        {footer && <div className="mt-8 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}

/** Solid / outline / ghost buttons matching the project's action styling. */
export function Btn({
  children, onClick, variant = "solid", tone = "brand", disabled, className = "", type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "solid" | "outline" | "ghost";
  tone?: "brand" | "mint" | "coral";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}) {
  const tones = {
    brand: { solid: "bg-brand text-white hover:brightness-110", outline: "border-2 border-brand text-brand hover:bg-brand/10", ghost: "text-brand hover:bg-brand/10" },
    mint: { solid: "bg-mint-deep text-white hover:brightness-110", outline: "border-2 border-mint-deep text-mint-deep hover:bg-mint-deep/10", ghost: "text-mint-deep hover:bg-mint-deep/10" },
    coral: { solid: "bg-coral-deep text-white hover:brightness-110", outline: "border-2 border-coral-deep text-coral-deep hover:bg-coral-deep/10", ghost: "text-coral-deep hover:bg-coral-deep/10" },
  } as const;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-11 items-center justify-center gap-2 rounded-lg px-6 text-[14px] font-extrabold tracking-wide transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${tones[tone][variant]} ${className}`}
    >
      {children}
    </button>
  );
}
