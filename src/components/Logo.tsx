export function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg viewBox="0 0 48 48" className="size-10" fill="none" stroke={light ? "#fff" : "#1fb9a9"} strokeWidth="2.4" strokeLinecap="round">
        <circle cx="24" cy="22" r="14" />
        <path d="M24 14v8l6 5" />
        <path d="M33 32l7 8" />
      </svg>
      <div className="leading-tight">
        <div className={`text-lg font-bold ${light ? "text-white" : "text-brand"}`}>Mawaqeet</div>
        <div className={`text-[10px] tracking-[0.3em] ${light ? "text-white/70" : "text-neutral-400"}`}>مواقيت</div>
      </div>
    </div>
  );
}
