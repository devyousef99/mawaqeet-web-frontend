"use client";
import { PageCard } from "@/components/TableShell";
import { adminStats, todayPerf } from "@/lib/data";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const rightStats = [
  { label: "Total Appointments Today", value: "149" },
  { label: "Completed Appointments Today", value: "38" },
  { label: "Canceled Appointments Today", value: "25" },
  { label: "Pending Appointments Today", value: "112" },
];

export default function AdminHome() {
  return (
    <div className="space-y-8">
      <PageCard className="!p-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px]">
          <div className="p-8">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-neutral-800 dark:text-white">Today&rsquo;s Performance</h2>
                <p className="text-sm font-semibold text-neutral-400">as of 25 JAN 2023, 09:41 PM</p>
              </div>
              <div className="flex items-center gap-6 text-sm font-semibold text-neutral-500">
                <span className="flex items-center gap-2"><span className="h-0.5 w-8 rounded bg-[#4c6ef5]" /> Today</span>
                <span className="flex items-center gap-2"><span className="h-0.5 w-8 rounded bg-neutral-300" /> Yesterday</span>
              </div>
            </div>
            <div className="h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={todayPerf} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="today" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4c6ef5" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#4c6ef5" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#e5e7eb" strokeOpacity={0.4} />
                  <XAxis dataKey="h" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} orientation="right" />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontWeight: 600 }} />
                  <Area type="monotone" dataKey="yesterday" stroke="#d1d5db" strokeWidth={2} fill="transparent" />
                  <Area type="monotone" dataKey="today" stroke="#4c6ef5" strokeWidth={3} fill="url(#today)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex flex-col divide-y divide-neutral-100 border-l border-neutral-100 dark:divide-white/5 dark:border-white/5">
            <div className="p-4 text-right"><button className="text-[15px] font-bold text-[#4c6ef5] hover:underline">Export as</button></div>
            {rightStats.map(s => (
              <div key={s.label} className="flex flex-1 flex-col justify-center px-8 py-5">
                <div className="text-lg font-semibold text-neutral-400">{s.label}</div>
                <div className="mt-1 text-3xl font-extrabold text-neutral-800 dark:text-white">{s.value}</div>
              </div>
            ))}
            <div className="px-8 py-6">
              <div className="text-lg font-semibold text-neutral-400">Performance Increase than Yesterday</div>
              <div className="mt-1 flex items-center gap-1 text-3xl font-extrabold text-emerald-500">↑44%</div>
            </div>
          </div>
        </div>
      </PageCard>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-6">
        {adminStats.map(s => (
          <div key={s.label}
            className="flex min-h-36 flex-col items-center justify-center gap-3 rounded-xl border border-[#4c9df5] bg-white p-4 text-center shadow-sm dark:border-[#4c9df5]/60 dark:bg-night-2">
            <div className="text-[15px] font-bold leading-snug text-[#4c9df5]">{s.label}</div>
            <div className="text-2xl font-extrabold text-neutral-800 dark:text-white">{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
