import { PageCard } from "@/components/TableShell";

export default function Notifications() {
  return (
    <PageCard className="min-h-[80vh]">
      <h2 className="text-[26px] font-extrabold tracking-wide text-neutral-800 dark:text-white">Notifications</h2>
      <div className="mt-24 flex flex-col items-center gap-3 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-brand-soft text-brand dark:bg-white/10">
          <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Zm4 9a2 2 0 0 0 4 0" /></svg>
        </span>
        <p className="text-lg font-bold text-neutral-700 dark:text-neutral-200">You&rsquo;re all caught up</p>
        <p className="max-w-sm text-sm font-semibold text-neutral-400">New provider subscriptions, complaints and system alerts will appear here.</p>
      </div>
    </PageCard>
  );
}
