import { DashboardShell } from "@/components/DashboardShell";
import { adminBrand, adminNav } from "./nav";

/** Chrome for every /admin/* page. Independent of the provider layout. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell nav={adminNav} brand={adminBrand} title="ADMIN">
      {children}
    </DashboardShell>
  );
}
