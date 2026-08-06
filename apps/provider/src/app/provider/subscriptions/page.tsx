import { PageCard } from "@mawaqeet/ui/TableShell";
import { GradientCard } from "@mawaqeet/ui/GradientCard";

const packages = [
  {
    name: "Basic Package",
    tagline: "Basic Features Package",
    duration: "1",
    unit: "Month",
    price: "109",
    intro: "All Basics Features includes :",
    features: ["150 Appointment", "Branch Access", "Add Services and Employees", "Setup Appointments", "Chart Reports"],
  },
  {
    name: "Pro Package",
    tagline: "Professional Small Companies Package",
    duration: "3",
    unit: "Months",
    price: "189",
    intro: "All Pro Features includes :",
    features: ["350 Appointment", "Branch User", "Add Services and Employees", "Setup Appointments", "Chart Reports", "Customer Care Users", "2 Promotions code"],
  },
  {
    name: "Full Package",
    tagline: "Advanced Package suitable for large scale companies.",
    duration: "6",
    unit: "Months",
    price: "279",
    intro: "All Full Package Features includes :",
    features: [
      "Unlimited Appointment", "Branch User", "Add Services and Employees", "Setup Appointments", "Chart Reports",
      "Customer Care Users", "Unlimited Promotions code", "Loyalty Program", "Export charts as Excel",
      "Import Appointments by Excel", "Free Technical Support",
    ],
  },
];

export default function BranchSubscriptions() {
  return (
    <PageCard className="min-h-[80vh]">
      <div className="flex flex-wrap items-center gap-10">
        <h2 className="text-[26px] font-extrabold tracking-wide text-neutral-800 dark:text-white">Subscriptions</h2>
        <div className="relative flex flex-1 flex-wrap items-center justify-center gap-4 rounded-xl border border-neutral-200 bg-gradient-to-r from-amber-50/70 to-white px-10 py-6 shadow-sm dark:border-white/10 dark:from-white/5 dark:to-transparent">
          <span className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Your Current Package is :</span>
          <span className="bg-gradient-to-r from-neutral-400 to-neutral-300 bg-clip-text text-5xl font-extrabold tracking-widest text-transparent">PRO</span>
          <span className="ms-4 text-2xl font-bold text-emerald-400"><span className="underline decoration-2 underline-offset-4">72</span> Days Left</span>
          <button className="absolute right-4 top-3 rounded-full border border-emerald-400 px-4 py-1 text-sm font-bold text-neutral-700 transition-colors hover:bg-emerald-50 dark:text-neutral-200 dark:hover:bg-white/10">
            Renew
          </button>
        </div>
      </div>

      <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-x-16 gap-y-14 md:grid-cols-3">
        {packages.map(p => (
          <div key={p.name} className="flex flex-col">
            <GradientCard className="flex min-h-[520px] flex-col text-center">
              <div className="pt-4 text-3xl font-extrabold">{p.name}</div>
              <p className="mx-auto mt-4 max-w-56 border-b border-white/50 pb-6 text-sm font-bold leading-relaxed text-white/90">{p.tagline}</p>
              <div className="mt-10 text-[110px] font-extrabold leading-none">{p.duration}</div>
              <div className="text-5xl font-extrabold">{p.unit}</div>
              <div className="mx-auto mt-auto mb-4 flex items-end gap-1 rounded-lg border-2 border-white/80 px-6 py-2">
                <span className="text-3xl font-extrabold">{p.price}</span>
                <span className="text-lg font-bold">SR</span>
              </div>
            </GradientCard>

            <div className="mt-8 flex-1">
              <div className="text-lg font-extrabold text-neutral-800 dark:text-neutral-100">{p.intro}</div>
              <ul className="mt-3 list-disc space-y-1.5 ps-6 text-[16px] font-extrabold text-neutral-800 dark:text-neutral-100">
                {p.features.map(f => <li key={f}>{f}</li>)}
              </ul>
            </div>

            <button className="mx-auto mt-10 h-12 w-44 rounded-lg bg-mint-deep text-base font-extrabold tracking-wider text-white shadow transition-transform hover:brightness-105 active:scale-[0.98]">
              Purchase
            </button>
          </div>
        ))}
      </div>
    </PageCard>
  );
}
