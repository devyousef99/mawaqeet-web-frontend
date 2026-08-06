import { DashboardShell } from "@mawaqeet/ui/DashboardShell";
import { adminBrand, adminNav } from "../nav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell nav={adminNav} brand={adminBrand} title="ADMIN">
      {children}
    </DashboardShell>
  );
}
