"use client";
import { Sidebar, type NavItem, type SidebarBrand } from "./Sidebar";
import { Topbar } from "./Topbar";

/**
 * The shell chrome every zone renders around its own pages.
 * Each zone passes its own nav + branding, so admin and provider can diverge
 * without touching each other.
 */
export function DashboardShell({
  nav, brand, title, children,
}: {
  nav: NavItem[];
  brand: SidebarBrand;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar nav={nav} brand={brand} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} />
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
