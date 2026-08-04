"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { Logo } from "./Logo";
import { useTheme } from "./theme";

export type NavItem = {
  href: string;
  label: string;
  Icon: LucideIcon;
  /** exact-match instead of prefix-match (use for a zone's index route) */
  exact?: boolean;
  /**
   * Item lives in a different zone (another Next.js app). Multi-zone links must
   * use a plain <a>: <Link> prefetches + soft-navigates, which breaks across zones.
   */
  external?: boolean;
};

export type SidebarBrand = {
  /** small heading under the logo, e.g. "SYS ADMIN USERNAME" or "Branch Name" */
  title: string;
  /** optional second line, e.g. subscription countdown */
  subtitle?: React.ReactNode;
  /** show the cube glyph + status dot next to the title */
  showBadge?: boolean;
};

export function Sidebar({ nav, brand }: { nav: NavItem[]; brand: SidebarBrand }) {
  const path = usePathname();
  const { dark, toggle } = useTheme();

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-neutral-200/70 bg-white dark:border-white/5 dark:bg-night">
      <div className="px-5 py-5"><Logo /></div>

      <div className="flex items-center gap-3 px-5 pb-5">
        {brand.showBadge && (
          <div className="relative">
            <span className="flex size-11 items-center justify-center rounded-lg border border-neutral-300 dark:border-neutral-600">
              <svg viewBox="0 0 24 24" className="size-7 text-neutral-700 dark:text-neutral-300" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 0v20M3 7l9 5 9-5" /></svg>
            </span>
            <span className="absolute -bottom-1 -left-1 size-3 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-night" />
          </div>
        )}
        <div className="text-[11px] font-bold uppercase tracking-wide text-neutral-700 dark:text-neutral-200">
          {brand.title}
          {brand.subtitle && <div className="mt-0.5 font-semibold text-neutral-400">{brand.subtitle}</div>}
        </div>
      </div>

      <nav className="no-scrollbar flex-1 space-y-1 overflow-y-auto pb-4">
        {nav.map(({ href, label, Icon, exact, external }) => {
          const active = external ? false : exact ? path === href : path.startsWith(href);
          const cls = `relative flex items-center gap-4 px-6 py-3 text-[15px] font-semibold transition-colors ${
            active
              ? "bg-brand-soft text-neutral-800 dark:bg-white/10 dark:text-white"
              : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-white/5 dark:hover:text-white"
          }`;
          const inner = (
            <>
              {active && <span className="absolute inset-y-0 left-0 w-1 rounded-r bg-brand" />}
              <Icon className={`size-5 ${active ? "text-brand" : "text-neutral-400"}`} />
              <span className="leading-tight">{label}</span>
            </>
          );
          return external ? (
            <a key={href + label} href={href} className={cls}>{inner}</a>
          ) : (
            <Link key={href + label} href={href} className={cls}>{inner}</Link>
          );
        })}
      </nav>

      <div className="p-5">
        <button
          onClick={toggle}
          className="h-12 w-full rounded-lg border border-neutral-800 text-base font-bold text-neutral-800 transition-colors hover:bg-neutral-100 dark:border-neutral-300 dark:text-neutral-100 dark:hover:bg-white/10"
        >
          {dark ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </aside>
  );
}
