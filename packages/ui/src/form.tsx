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
  label, value, onChange, options, className = "",
}: {
  label?: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  className?: string;
}) {
  const isNumeric = typeof value === "number";
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <span className="text-xs font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          {label}
        </span>
      )}
      <span className="relative">
        <select
          value={value}
          onChange={e => onChange((isNumeric ? Number(e.target.value) : e.target.value) as T)}
          className="h-11 w-full appearance-none rounded-lg bg-fog ps-4 pe-10 text-[14px] font-bold text-neutral-700 outline-none transition-shadow focus:ring-2 focus:ring-brand/50 dark:bg-white/10 dark:text-neutral-200"
        >
          {options.map(o => (
            <option key={String(o.value)} value={o.value} className="bg-white dark:bg-night-2">
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
      </span>
    </label>
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
