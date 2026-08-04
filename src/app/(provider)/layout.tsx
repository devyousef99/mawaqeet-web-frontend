import { DashboardShell } from "@/components/DashboardShell";
import { providerBrand, providerNav } from "./nav";

/** Chrome for every /provider/* page. Independent of the admin layout. */
export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell nav={providerNav} brand={providerBrand} title="Branch">
      {children}
    </DashboardShell>
  );
}
