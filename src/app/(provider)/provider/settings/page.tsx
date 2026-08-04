import { PageCard } from "@/components/TableShell";

const tiles = ["Cancel All Appointments", "Block Users", "Languages", "Technical Support", "Branch Certificates", "Notifications", "Integrations", "Advertisements", "Create Users"];

export default function Settings() {
  return (
    <PageCard className="min-h-[80vh]">
      <h2 className="text-[26px] font-extrabold tracking-wide text-neutral-800 dark:text-white">Settings</h2>
      <p className="mt-10 text-center text-3xl font-bold text-neutral-800 dark:text-neutral-100">Modify your favorite settings for optimal usage</p>
      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-x-16 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map(t => (
          <button key={t}
            className="flex h-56 items-center justify-center rounded-xl border border-emerald-300/80 bg-white text-lg font-semibold text-neutral-800 shadow-[0_6px_16px_rgba(16,185,129,0.12)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(16,185,129,0.2)] dark:bg-night-2 dark:text-neutral-100">
            {t}
          </button>
        ))}
      </div>
    </PageCard>
  );
}
