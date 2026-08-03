"use client";
import { PageCard } from "@/components/TableShell";
import { ActionBar, PillSelect, Toggle } from "@/components/ui";
import { ServicePicker } from "@/components/EmployeePicker";

export default function LoyaltySettings() {
  return (
    <PageCard>
      <div className="grid grid-cols-1 gap-14 xl:grid-cols-[340px_1fr]">
        <div className="space-y-12">
          <div>
            <div className="mb-4 text-center text-[16px] font-bold uppercase leading-relaxed tracking-wide text-neutral-700 dark:text-neutral-300">
              ADD TO PROGRAM IF<br />CUSTOMER REACH
            </div>
            <PillSelect label="10 BOOKINGS" className="w-full !justify-between !px-8 font-extrabold !text-neutral-800 dark:!text-neutral-100" />
          </div>
          <div>
            <div className="mb-4 text-center text-[16px] font-bold uppercase leading-relaxed tracking-wide text-neutral-700 dark:text-neutral-300">
              ADD TO PROGRAM IF<br />CUSTOMER REACH
            </div>
            <PillSelect label="5 RATINGS" className="w-full !justify-between !px-8 font-extrabold !text-neutral-800 dark:!text-neutral-100" />
          </div>
          <div>
            <div className="mb-4 text-[16px] font-bold uppercase tracking-wide text-neutral-700 dark:text-neutral-300">STATUS</div>
            <Toggle />
          </div>
        </div>
        <div>
          <h3 className="mb-8 text-center text-3xl font-bold text-neutral-400">Select The Defined Services to the Program</h3>
          <ServicePicker />
        </div>
      </div>
      <ActionBar />
    </PageCard>
  );
}
