"use client";
import { PageCard } from "@mawaqeet/ui/TableShell";
import { PillSelect, UploadBox } from "@mawaqeet/ui/ui";
import { MapPin } from "lucide-react";

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-3 text-[15px] font-bold uppercase tracking-wide text-neutral-700 dark:text-neutral-300">{children}</div>
);
const Input = ({ ph }: { ph: string }) => (
  <input placeholder={ph} className="mb-8 h-14 w-full rounded-full bg-fog px-8 text-[15px] font-bold text-neutral-500 outline-none placeholder:uppercase dark:bg-white/10 dark:text-neutral-300" />
);

export default function CreateBranch() {
  return (
    <PageCard>
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[360px_1fr]">
        <div>
          <Label>SELECT CITY</Label>
          <PillSelect label="JEDDAH" className="mb-8 w-full" />
          <Label>BRANCH NAME</Label>
          <Input ph="ENTER BRANCH NAME" />
          <Label>DISCRIPTION</Label>
          <Input ph="ENTER  DISCRIPTION" />
          <Label>SELECT PROVIDER</Label>
          <PillSelect label="PROVIDER" className="mb-8 w-full" />
          <Label>LOCATION DISCRIPTION</Label>
          <Input ph="ENTER  DISCRIPTION" />
        </div>
        <div>
          <div className="mb-8 flex justify-end"><UploadBox label="UPLOAD USER LOGO" /></div>
          <div className="relative h-[480px] overflow-hidden rounded-lg bg-[#eceae4] dark:bg-white/10">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 480" fill="none">
              <path d="M0 200 C150 160 300 260 600 210" stroke="#f2a94d" strokeWidth="6" />
              <path d="M40 0 C120 200 90 320 220 480" stroke="#f6c863" strokeWidth="5" />
              <path d="M0 330 C200 300 420 380 600 330" stroke="#fff" strokeWidth="8" />
              <path d="M300 0 C310 160 280 320 340 480" stroke="#fff" strokeWidth="6" />
              {Array.from({ length: 40 }, (_, i) => (
                <rect key={i} x={(i * 97) % 560 + 10} y={(i * 53) % 440 + 10} width="26" height="18" fill="#fff" opacity="0.7" />
              ))}
              <ellipse cx="470" cy="300" rx="70" ry="45" stroke="#f6c863" strokeWidth="4" />
            </svg>
            <MapPin className="absolute left-[45%] top-[38%] size-8 fill-red-500 text-red-600" />
          </div>
          <div className="mt-8 flex justify-end gap-6">
            <button className="h-14 w-40 rounded-lg bg-coral text-lg font-extrabold tracking-wider text-white shadow hover:brightness-105">CANCEL</button>
            <button className="h-14 w-40 rounded-lg bg-mint-deep text-lg font-extrabold tracking-wider text-white shadow hover:brightness-105">SAVE</button>
          </div>
        </div>
      </div>
    </PageCard>
  );
}
