import { DashboardShell } from "@mawaqeet/ui/DashboardShell";
import { providerBrand, providerNav } from "../nav";

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell nav={providerNav} brand={providerBrand} title="Branch">
      {children}
    </DashboardShell>
  );
}
