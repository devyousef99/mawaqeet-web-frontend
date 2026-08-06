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
  const { collapsed } = useTheme();

  return (
    <aside
      className={`sticky top-0 flex h-screen shrink-0 flex-col border-e border-neutral-200/70 bg-white transition-[width] duration-200 ease-out dark:border-white/5 dark:bg-night-1 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className={`py-5 ${collapsed ? "px-0" : "px-5"}`}>
        <Logo compact={collapsed} />
      </div>

      <div className={`flex items-center gap-3 pb-5 ${collapsed ? "justify-center px-0" : "px-5"}`}>
        {brand.showBadge && (
          <div className="relative">
            <span className="flex size-11 items-center justify-center rounded-lg border border-neutral-300 dark:border-neutral-600">
              <svg viewBox="0 0 24 24" className="size-7 text-neutral-700 dark:text-neutral-300" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 0v20M3 7l9 5 9-5" /></svg>
            </span>
            <span className="absolute -bottom-1 -start-1 size-3 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-night-1" />
          </div>
        )}
        {!collapsed && (
          <div className="text-[11px] font-bold uppercase tracking-wide text-neutral-700 dark:text-neutral-200">
            {brand.title}
            {brand.subtitle && <div className="mt-0.5 font-semibold text-neutral-400">{brand.subtitle}</div>}
          </div>
        )}
      </div>

      <nav className="no-scrollbar flex-1 space-y-1 overflow-y-auto overflow-x-hidden pb-4">
        {nav.map(({ href, label, Icon, exact, external }) => {
          const active = external ? false : exact ? path === href : path.startsWith(href);
          const cls = `group relative flex items-center py-3 text-[15px] font-semibold transition-colors ${
            collapsed ? "justify-center px-0" : "gap-4 px-6"
          } ${
            active
              ? "bg-brand-soft text-neutral-800 dark:bg-white/10 dark:text-white"
              : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-white/5 dark:hover:text-white"
          }`;
          const inner = (
            <>
              {active && <span className="absolute inset-y-0 start-0 w-1 rounded-e bg-brand" />}
              <Icon className={`size-5 shrink-0 ${active ? "text-brand" : "text-neutral-400"}`} />
              {collapsed ? (
                // Accessible name survives collapse, and a hover tooltip keeps the
                // rail usable without expanding it.
                <>
                  <span className="sr-only">{label}</span>
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute start-full z-30 ms-2 hidden whitespace-nowrap rounded-md bg-neutral-800 px-2.5 py-1.5 text-xs font-semibold text-white shadow-lg group-hover:block dark:bg-neutral-700"
                  >
                    {label}
                  </span>
                </>
              ) : (
                <span className="leading-tight">{label}</span>
              )}
            </>
          );
          return external ? (
            <a key={href + label} href={href} className={cls} title={collapsed ? label : undefined}>{inner}</a>
          ) : (
            <Link key={href + label} href={href} className={cls} title={collapsed ? label : undefined}>{inner}</Link>
          );
        })}
      </nav>
    </aside>
  );
}
