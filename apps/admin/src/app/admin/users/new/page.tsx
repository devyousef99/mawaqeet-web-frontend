"use client";
import { PageCard } from "@mawaqeet/ui/TableShell";
import { ActionBar } from "@mawaqeet/ui/ui";
import { ChevronDown } from "lucide-react";

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-3 text-[15px] font-bold uppercase tracking-wide text-neutral-700 dark:text-neutral-300">{children}</div>
);

export default function CreateUser() {
  return (
    <PageCard className="min-h-[80vh]">
      <div className="max-w-md">
        <Label>USER NAME</Label>
        <input placeholder="ENTER USER NAME" className="mb-8 h-14 w-full rounded-full bg-fog text-center text-[15px] font-bold text-neutral-500 outline-none placeholder:uppercase dark:bg-white/10 dark:text-neutral-300" />
        <Label>PASSWORD</Label>
        <input type="password" placeholder="PASSOWRD MUST BE" className="mb-14 h-14 w-full rounded-full bg-fog text-center text-[15px] font-bold text-neutral-500 outline-none placeholder:uppercase dark:bg-white/10 dark:text-neutral-300" />
        <button className="flex h-16 w-full items-center gap-6 rounded-2xl bg-white px-8 text-2xl font-extrabold tracking-wide text-neutral-600 shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-transform hover:-translate-y-0.5 dark:bg-white/10 dark:text-neutral-200">
          <ChevronDown className="size-6" /> USER TYPE
        </button>
      </div>
      <ActionBar />
    </PageCard>
  );
}
