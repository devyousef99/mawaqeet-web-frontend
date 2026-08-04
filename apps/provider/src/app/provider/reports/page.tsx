import { PageCard } from "@mawaqeet/ui/TableShell";
import { PillSelect } from "@mawaqeet/ui/ui";

function Report({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <PageCard>
      <div className="mb-6 flex items-start justify-between">
        <h2 className="text-3xl font-extrabold text-neutral-800 dark:text-white">{title}</h2>
        <div className="flex flex-col items-end gap-3">
          <button className="text-lg font-bold text-[#4c6ef5] hover:underline">View Full Chart</button>
          <button className="h-10 rounded-full bg-neutral-200 px-6 text-[15px] font-bold text-[#4c6ef5] hover:bg-neutral-300 dark:bg-white/15">Export as</button>
        </div>
      </div>
      <div className="mb-2 w-full max-w-md rounded-full border-2 border-neutral-300 dark:border-neutral-600">
        <PillSelect label="SELECT MONTH" className="w-full !bg-transparent" />
      </div>
      <div className="divide-y divide-neutral-200 dark:divide-white/10">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between py-6">
            <span className="text-xl font-bold text-neutral-800 dark:text-neutral-100">{k}</span>
            <span className="text-xl font-semibold text-neutral-400">{v}</span>
          </div>
        ))}
      </div>
    </PageCard>
  );
}

export default function Reports() {
  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
      <Report title="Month Report" rows={[["Total Requests", "4238"], ["Completed", "1005"], ["Canceled", "91"], ["Entered Manually", "15"]]} />
      <Report title="Year Report" rows={[["Total Requests", "12152"], ["Completed", "5252"], ["Canceled", "1414"], ["Entered Manually", "350"]]} />
    </div>
  );
}
