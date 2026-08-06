export function GradientCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg ${className}`}
      style={{ background: "linear-gradient(140deg,#7de2ad 0%,#6fd6b4 35%,#8b8bee 100%)" }}>
      <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-white/15" />
      <div className="pointer-events-none absolute -bottom-24 -left-10 size-72 rounded-full bg-grape/25" />
      <div className="relative">{children}</div>
    </div>
  );
}
