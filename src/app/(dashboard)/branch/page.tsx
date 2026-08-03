"use client";
import { PageCard } from "@/components/TableShell";
import { monthlyProgress, weekSales } from "@/lib/data";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowUp } from "lucide-react";

const statCards = [
  { label: "PENDING TODAY", value: "452", note: "10% increase than last week", border: "border-sun" },
  { label: "CANCELED TODAY", value: "125", note: "5% increased than last week", border: "border-red-500" },
  { label: "COMPLETED TODAY", value: "2,001", note: "20% increased than last week", border: "border-emerald-500" },
];

function WelcomeIllustration() {
  return (
    <svg viewBox="0 0 320 220" className="w-full max-w-sm">
      <rect x="70" y="40" width="180" height="110" rx="8" fill="none" stroke="#2ee6c6" strokeWidth="4" />
      <rect x="150" y="150" width="20" height="26" fill="#6c5ce7" />
      <rect x="120" y="176" width="80" height="8" rx="4" fill="#6c5ce7" />
      <rect x="90" y="60" width="52" height="34" rx="4" fill="none" stroke="#8fe3c0" strokeWidth="3" />
      <path d="M96 88 108 72l10 10 12-16" stroke="#6c5ce7" strokeWidth="3" fill="none" />
      <circle cx="182" cy="76" r="18" fill="none" stroke="#8fe3c0" strokeWidth="4" />
      <path d="M182 58a18 18 0 0 1 18 18h-18Z" fill="#6c5ce7" />
      <rect x="212" y="60" width="30" height="34" rx="4" fill="none" stroke="#8fe3c0" strokeWidth="3" />
      <path d="M40 120c8-30 20-44 30-44s16 10 16 22-8 22-16 44l-4 60h-20Z" fill="#e9e7f8" stroke="#6c5ce7" strokeWidth="3" />
      <circle cx="66" cy="58" r="12" fill="#f5cba7" stroke="#6c5ce7" strokeWidth="3" />
      <path d="M258 122c-8-28-18-40-28-40s-16 10-14 22 10 20 16 42l6 56h18Z" fill="#fff" stroke="#2ee6c6" strokeWidth="3" />
      <circle cx="232" cy="64" r="12" fill="#f5cba7" stroke="#2ee6c6" strokeWidth="3" />
    </svg>
  );
}

export default function BranchHome() {
  const donut = [
    { name: "Completed", value: 300, color: "#2ee6c6" },
    { name: "Canceled", value: 100, color: "#f4726a" },
    { name: "Pending", value: 200, color: "#f6c863" },
  ];
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.6fr_1fr]">
        <PageCard className="flex items-center gap-8">
          <div className="flex-1">
            <h2 className="text-3xl font-extrabold text-neutral-800 dark:text-white">Welcome to your dashboard!</h2>
            <p className="mt-5 max-w-md text-[17px] font-semibold leading-relaxed text-neutral-500 dark:text-neutral-300">
              This is a branch dashboard that reflect the status of the daily , weekly , monthly and yearly statistics while
              managing the services, employees and promotions.
            </p>
          </div>
          <div className="hidden w-96 md:block"><WelcomeIllustration /></div>
        </PageCard>

        <PageCard>
          <h3 className="mb-6 text-2xl font-extrabold text-neutral-800 dark:text-white">Sales amount per week</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekSales} barSize={44}>
                <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#9ca3af", fontWeight: 700 }} />
                <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} contentStyle={{ borderRadius: 12, fontWeight: 600 }} />
                <Bar dataKey="v" radius={[4, 4, 0, 0]} fill="#f58a80" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PageCard>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map(c => (
          <div key={c.label} className={`rounded-xl border-2 bg-white p-7 dark:bg-night-2 ${c.border}`}>
            <div className="text-[17px] font-bold tracking-wide text-neutral-500 dark:text-neutral-300">{c.label}</div>
            <div className="mt-1 text-4xl font-extrabold text-neutral-800 dark:text-white">{c.value}</div>
            <div className="mt-6 flex items-center gap-3 text-[16px] font-semibold text-neutral-600 dark:text-neutral-300">
              <ArrowUp className="size-5 text-emerald-500" /> {c.note}
            </div>
          </div>
        ))}
        <div className="flex items-center gap-4 rounded-xl border-2 border-sky-500 bg-white p-7 dark:bg-night-2">
          <div>
            <div className="text-[17px] font-bold tracking-wide text-neutral-500 dark:text-neutral-300">TOTAL TODAY</div>
            <div className="mt-1 text-4xl font-extrabold text-neutral-800 dark:text-white">2,643</div>
            <div className="mt-6 flex items-center gap-3 text-[16px] font-semibold text-neutral-600 dark:text-neutral-300">
              <ArrowUp className="size-5 text-emerald-500" /> 12% increased than yesterday
            </div>
          </div>
          <svg viewBox="0 0 120 70" className="w-32 shrink-0"><path d="M4 58 C 22 30, 34 22, 44 34 S 58 62 70 50 84 8 96 16 108 46 116 52" fill="none" stroke="#12b8a2" strokeWidth="3.5" strokeLinecap="round" /></svg>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.6fr_1fr]">
        <PageCard>
          <h3 className="mb-6 text-2xl font-extrabold text-neutral-800 dark:text-white">Monthly Progress</h3>
          <div className="h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyProgress} barSize={40} barGap={2}>
                <CartesianGrid vertical={false} strokeDasharray="6 6" stroke="#d1d5db" strokeOpacity={0.6} />
                <XAxis dataKey="m" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#6b7280", fontWeight: 700 }} interval={0} />
                <YAxis hide />
                <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} contentStyle={{ borderRadius: 12, fontWeight: 600 }} />
                <Bar dataKey="a" stackId="s" fill="#6c5ce7" />
                <Bar dataKey="b" stackId="s" fill={"#f58a80"} radius={[2, 2, 0, 0]}>
                  {monthlyProgress.map((m, i) => <Cell key={i} fill={i % 4 === 1 || i % 4 === 3 ? "#f58a80" : "#2ee6c6"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PageCard>

        <PageCard>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-2xl font-extrabold text-neutral-800 dark:text-white">Daily Progress</h3>
            <span className="flex items-center gap-2 text-[15px] font-bold text-neutral-500 dark:text-neutral-300">
              <ArrowUp className="size-4 text-emerald-500" /> 110% Since yesterday
            </span>
          </div>
          <div className="relative h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donut} dataKey="value" innerRadius={80} outerRadius={115} paddingAngle={1} startAngle={90} endAngle={-270}
                  label={({ value }) => `${value}`}>
                  {donut.map(d => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, fontWeight: 600 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex justify-center gap-8 text-[15px] font-bold">
            {donut.map(d => <span key={d.name} style={{ color: d.color }}>{d.name}</span>)}
          </div>
        </PageCard>
      </div>
    </div>
  );
}
