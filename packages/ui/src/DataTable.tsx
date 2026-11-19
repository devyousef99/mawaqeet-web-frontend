"use client";
import { useMemo, useState, type ReactNode } from "react";
import { ArrowDownWideNarrow, ArrowUpWideNarrow, ChevronLeft, ChevronRight, Filter, RotateCcw, Search, X } from "lucide-react";
import { PageCard } from "./TableShell";
import { SelectField } from "./form";
import { RowMenu, type RowAction } from "./ui";

/* ------------------------------------------------------------------ */
/*  DataTable — responsive list with working search / filter / sort /  */
/*  pagination / row actions.                                          */
/*                                                                     */
/*  ≥ md : a real <table> inside an overflow-x-auto scroller           */
/*  < md : one card per row (primary column as the card header)        */
/* ------------------------------------------------------------------ */

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  /** Value used for sorting; column is unsortable if omitted. */
  sort?: (row: T) => string | number;
  align?: "start" | "center" | "end";
  /** Shown as the card title on mobile (first primary column wins). */
  primary?: boolean;
  /** Skip in the mobile card. */
  hideOnMobile?: boolean;
  className?: string;
  width?: string;
};

export type FilterDef = {
  key: string;
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
};

export type HeaderAction = { label: string; onClick?: () => void; primary?: boolean };

export function DataTable<T>({
  title, rows, columns, rowKey, searchText, filters = [], actions = [], rowActions, pageSizes = [5, 7, 10, 25],
  defaultPageSize = 7, emptyText = "Nothing here yet.", onReset, subtitle, ready = true,
}: {
  title: string;
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string | number;
  /** Text to match the search box against (space-joined fields). */
  searchText?: (row: T) => string;
  filters?: FilterDef[];
  actions?: HeaderAction | HeaderAction[];
  rowActions?: (row: T) => RowAction[];
  pageSizes?: number[];
  defaultPageSize?: number;
  emptyText?: string;
  /** Shown as a "Reset demo data" button when provided. */
  onReset?: () => void;
  subtitle?: ReactNode;
  ready?: boolean;
}) {
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [dir, setDir] = useState<"asc" | "desc">("asc");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const acts = Array.isArray(actions) ? actions : [actions];
  const activeFilters = filters.filter(f => f.value);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let out = rows;
    if (needle && searchText) out = out.filter(r => searchText(r).toLowerCase().includes(needle));
    if (sortKey) {
      const col = columns.find(c => c.key === sortKey);
      if (col?.sort) {
        const s = col.sort;
        out = [...out].sort((a, b) => {
          const x = s(a), y = s(b);
          const c = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y), undefined, { numeric: true });
          return dir === "asc" ? c : -c;
        });
      }
    }
    return out;
  }, [rows, q, searchText, sortKey, dir, columns]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const cur = Math.min(page, pages);
  const slice = filtered.slice((cur - 1) * pageSize, cur * pageSize);
  const from = filtered.length ? (cur - 1) * pageSize + 1 : 0;
  const to = Math.min(cur * pageSize, filtered.length);

  const toggleSort = (key: string) => {
    if (sortKey === key) setDir(d => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setDir("asc"); }
  };

  const primary = columns.find(c => c.primary) ?? columns[0];
  const alignCls = (a?: Column<T>["align"]) => (a === "center" ? "text-center" : a === "end" ? "text-end" : "text-start");

  return (
    <PageCard className="overflow-hidden">
      {/* ---------- header ---------- */}
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <h2 className="me-auto text-2xl font-extrabold tracking-wide text-neutral-800 dark:text-white sm:text-[26px]">
            {title}
            <span className="ms-3 align-middle text-sm font-bold text-neutral-400">{filtered.length}</span>
          </h2>
          {acts.map(a => (
            <button
              key={a.label}
              type="button"
              onClick={a.onClick}
              className={`h-11 rounded-full px-5 text-[14px] font-bold shadow-sm transition-colors ${
                a.primary === false
                  ? "bg-neutral-200 text-neutral-800 hover:bg-neutral-300 dark:bg-white/15 dark:text-white dark:hover:bg-white/25"
                  : "bg-brand text-white hover:brightness-110"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
        {subtitle && <div className="text-sm font-semibold text-neutral-400">{subtitle}</div>}

        <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
          {searchText && (
            <label className="flex h-11 w-full items-center gap-3 rounded-full bg-fog px-5 text-neutral-400 dark:bg-white/10 md:w-72">
              <Search className="size-4 shrink-0" />
              <input
                value={q}
                onChange={e => { setQ(e.target.value); setPage(1); }}
                placeholder="Search"
                className="w-full bg-transparent text-sm font-semibold outline-none dark:text-neutral-200"
              />
              {q && <button type="button" onClick={() => setQ("")} aria-label="Clear search"><X className="size-4" /></button>}
            </label>
          )}
          <div className="flex flex-wrap items-center gap-2 md:ms-auto">
            {columns.some(c => c.sort) && (
              <div className="flex items-center gap-1">
                <SelectField
                  value={sortKey ?? ""}
                  onChange={v => { setSortKey(v || null); setPage(1); }}
                  placeholder="SORT BY"
                  options={columns.filter(c => c.sort).map(c => ({ value: c.key, label: c.header.toUpperCase() }))}
                  className="w-44"
                />
                <button
                  type="button"
                  onClick={() => setDir(d => (d === "asc" ? "desc" : "asc"))}
                  disabled={!sortKey}
                  aria-label="Toggle sort direction"
                  className="flex size-11 items-center justify-center rounded-lg bg-fog text-neutral-600 disabled:opacity-40 dark:bg-white/10 dark:text-neutral-300"
                >
                  {dir === "asc" ? <ArrowDownWideNarrow className="size-5" /> : <ArrowUpWideNarrow className="size-5" />}
                </button>
              </div>
            )}
            {filters.length > 0 && (
              <button
                type="button"
                onClick={() => setShowFilters(s => !s)}
                className={`flex h-11 items-center gap-2 rounded-lg px-4 text-sm font-bold ${
                  showFilters || activeFilters.length ? "bg-brand-soft text-emerald-900 dark:bg-brand/20 dark:text-brand" : "bg-fog text-neutral-600 dark:bg-white/10 dark:text-neutral-300"
                }`}
              >
                <Filter className="size-4" /> Filter{activeFilters.length ? ` (${activeFilters.length})` : ""}
              </button>
            )}
            {onReset && (
              <button
                type="button"
                onClick={onReset}
                title="Restore the seed demo data (clears localStorage for this list)"
                className="flex h-11 items-center gap-2 rounded-lg bg-fog px-4 text-sm font-bold text-neutral-500 hover:text-coral-deep dark:bg-white/10"
              >
                <RotateCcw className="size-4" /> Reset
              </button>
            )}
          </div>
        </div>

        {showFilters && filters.length > 0 && (
          <div className="grid grid-cols-1 gap-3 rounded-lg bg-paper p-4 sm:grid-cols-2 lg:grid-cols-4 dark:bg-white/5">
            {filters.map(f => (
              <SelectField
                key={f.key}
                label={f.label}
                value={f.value}
                onChange={v => { f.onChange(v); setPage(1); }}
                placeholder="ALL"
                options={[{ value: "", label: "ALL" }, ...f.options]}
              />
            ))}
          </div>
        )}
      </div>

      {/* ---------- desktop table ---------- */}
      <div className="-mx-5 hidden overflow-x-auto sm:-mx-8 md:block">
        <table className="w-full min-w-[820px] border-collapse">
          <thead>
            <tr className="border-b border-neutral-100 dark:border-white/5">
              {columns.map(c => (
                <th
                  key={c.key}
                  style={{ width: c.width }}
                  className={`px-4 pb-4 pt-1 text-[14px] font-bold text-neutral-400 first:ps-8 dark:text-neutral-500 ${alignCls(c.align)} ${c.className ?? ""}`}
                >
                  {c.sort ? (
                    <button type="button" onClick={() => toggleSort(c.key)} className={`inline-flex items-center gap-1 hover:text-neutral-700 dark:hover:text-neutral-200 ${sortKey === c.key ? "text-brand" : ""}`}>
                      {c.header}
                      {sortKey === c.key && (dir === "asc" ? <ArrowDownWideNarrow className="size-3.5" /> : <ArrowUpWideNarrow className="size-3.5" />)}
                    </button>
                  ) : c.header}
                </th>
              ))}
              {rowActions && <th className="w-12 pe-8" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
            {slice.map(r => (
              <tr key={rowKey(r)} className="transition-colors hover:bg-indigo-50/60 dark:hover:bg-white/5">
                {columns.map(c => (
                  <td key={c.key} className={`px-4 py-5 align-middle first:ps-8 ${alignCls(c.align)} ${c.className ?? ""}`}>
                    {c.render(r)}
                  </td>
                ))}
                {rowActions && <td className="pe-8 text-end"><RowMenu actions={rowActions(r)} /></td>}
              </tr>
            ))}
            {!slice.length && (
              <tr><td colSpan={columns.length + 1} className="py-16 text-center text-sm font-semibold text-neutral-400">{ready ? emptyText : "Loading…"}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---------- mobile cards ---------- */}
      <div className="space-y-3 md:hidden">
        {slice.map(r => (
          <div key={rowKey(r)} className="rounded-xl border border-neutral-100 p-4 dark:border-white/10">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">{primary.render(r)}</div>
              {rowActions && <RowMenu actions={rowActions(r)} />}
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
              {columns.filter(c => c !== primary && !c.hideOnMobile).map(c => (
                <div key={c.key} className="min-w-0">
                  <dt className="text-[11px] font-bold uppercase tracking-wide text-neutral-400">{c.header}</dt>
                  <dd className="mt-0.5 min-w-0 text-sm">{c.render(r)}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
        {!slice.length && <div className="py-12 text-center text-sm font-semibold text-neutral-400">{ready ? emptyText : "Loading…"}</div>}
      </div>

      {/* ---------- footer / pagination ---------- */}
      <div className="mt-6 flex flex-col items-center gap-4 border-t border-neutral-100 pt-5 text-[14px] font-semibold text-neutral-400 sm:flex-row sm:justify-end sm:gap-8 dark:border-white/5">
        <label className="flex items-center gap-2">
          Rows per page:
          <select
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="rounded bg-fog px-2 py-1 font-bold text-neutral-700 outline-none dark:bg-white/10 dark:text-neutral-200"
          >
            {pageSizes.map(n => <option key={n} value={n} className="bg-white dark:bg-night-2">{n}</option>)}
          </select>
        </label>
        <span>{from}-{to} of {filtered.length}</span>
        <span className="flex items-center gap-4">
          <button type="button" disabled={cur <= 1} onClick={() => setPage(p => p - 1)} className="rounded p-1 hover:text-neutral-700 disabled:opacity-30 dark:hover:text-white" aria-label="Previous page"><ChevronLeft className="size-5" /></button>
          <span className="text-neutral-600 dark:text-neutral-200">{cur} / {pages}</span>
          <button type="button" disabled={cur >= pages} onClick={() => setPage(p => p + 1)} className="rounded p-1 hover:text-neutral-700 disabled:opacity-30 dark:hover:text-white" aria-label="Next page"><ChevronRight className="size-5" /></button>
        </span>
      </div>
    </PageCard>
  );
}

/* Small cell helpers so pages stay terse */
export const Cell = {
  strong: (v: ReactNode) => <span className="text-[15px] font-bold text-neutral-800 dark:text-neutral-100">{v}</span>,
  text: (v: ReactNode) => <span className="text-[15px] font-semibold text-neutral-700 dark:text-neutral-200">{v}</span>,
  muted: (v: ReactNode) => <span className="text-[14px] font-semibold text-neutral-500">{v}</span>,
  stacked: (top: ReactNode, bottom: ReactNode) => (
    <span className="block">
      <span className="block text-[15px] font-bold text-neutral-800 dark:text-neutral-100">{top}</span>
      <span className="block text-xs font-semibold text-neutral-400">{bottom}</span>
    </span>
  ),
};
