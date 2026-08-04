"use client";
import Link from "next/link";
import { Lock, UserRound } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { Check } from "@/components/ui";

function Waves() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-40" preserveAspectRatio="none" viewBox="0 0 1440 900" fill="none">
      {Array.from({ length: 14 }, (_, i) => (
        <path key={i} d={`M-50 ${180 + i * 6} C 360 ${60 + i * 8}, 720 ${420 - i * 6}, 1490 ${170 + i * 7}`} stroke="white" strokeOpacity="0.35" strokeWidth="1" />
      ))}
      {[
        [140, 120, 70, -12], [320, 60, 40, 8], [520, 190, 90, -6], [760, 90, 60, 14], [980, 200, 100, -10],
        [1180, 80, 56, 6], [1320, 190, 84, -14], [90, 320, 44, 10], [420, 340, 66, -8], [1240, 330, 70, 12],
      ].map(([x, y, s, r], i) => (
        <rect key={"r" + i} x={x} y={y} width={s} height={s} rx={s * 0.22} transform={`rotate(${r} ${x} ${y})`} stroke="white" strokeOpacity="0.35" strokeWidth="1.5" />
      ))}
    </svg>
  );
}

function KeyNote() {
  return (
    <svg viewBox="0 0 220 220" className="w-56 drop-shadow-xl">
      <g transform="rotate(-4 110 110)">
        <rect x="30" y="46" width="150" height="140" rx="10" fill="white" stroke="#2b2d33" strokeWidth="6" className="dark:stroke-black" />
        <rect x="94" y="24" width="30" height="40" rx="4" fill="white" stroke="#2b2d33" strokeWidth="6" />
        <g stroke="#6c5ce7" strokeWidth="7" fill="none" strokeLinecap="round" className="opacity-90">
          <circle cx="122" cy="96" r="16" />
          <path d="M110 108 78 144m0 0 10 10m-10-10-8-8m30-4 8 8" />
        </g>
      </g>
    </svg>
  );
}

export default function Login() {
  const { dark, toggle } = useTheme();
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#4f7fe0] via-[#2fa6c9] to-[#35d0a5] dark:from-[#3a3b3e] dark:via-[#4a4b4f] dark:to-[#5a5b60]">
      <Waves />

      <div className="relative z-10 grid w-[min(92vw,1000px)] grid-cols-1 items-center gap-10 rounded-2xl bg-white/75 p-12 backdrop-blur-sm md:grid-cols-2 dark:bg-grape/90">
        <form className="space-y-6" onSubmit={e => e.preventDefault()}>
          <label className="flex h-12 items-center gap-3 rounded-md border border-neutral-300 bg-white px-4 text-neutral-500">
            <UserRound className="size-4 text-grape" />
            <input placeholder="Username" className="w-full bg-transparent text-[15px] outline-none" />
          </label>
          <label className="flex h-12 items-center gap-3 rounded-md border border-neutral-300 bg-white px-4 text-neutral-500">
            <Lock className="size-4 text-grape" />
            <input type="password" placeholder="Password" className="w-full bg-transparent text-[15px] outline-none" />
          </label>

          <div className="flex items-center gap-3 text-[17px]">
            <Check initial size={24} />
            <span className="font-semibold text-neutral-800 dark:text-white">Remember me</span>
            <button type="button" className="ml-2 font-semibold text-grape hover:underline dark:text-white/90">Forgot password</button>
          </div>

          <div>
            <Link href="/admin"
              className="flex h-12 w-full items-center justify-center rounded-md bg-grape text-lg font-semibold text-white transition-colors hover:brightness-110 dark:bg-neutral-900">
              Log in as Admin
            </Link>
            <Link href="/provider"
              className="mt-3 flex h-12 w-full items-center justify-center rounded-md border-2 border-grape text-lg font-semibold text-grape transition-colors hover:bg-grape/10 dark:border-white/70 dark:text-white">
              Log in as Provider
            </Link>
            <p className="mt-2 text-[17px] text-neutral-800 dark:text-white">
              Or <button type="button" className="font-semibold text-grape hover:underline dark:text-white">register now!</button>
            </p>
          </div>
        </form>
        <div className="hidden justify-center md:flex"><KeyNote /></div>
      </div>

      <button onClick={toggle}
        className="absolute bottom-10 left-10 z-10 h-14 w-44 rounded-md border border-white/80 text-lg font-semibold text-white transition-colors hover:bg-white/10">
        {dark ? "Light Mode" : "Dark Mode"}
      </button>

      <div className="absolute bottom-8 right-10 z-10 text-white">
        <svg viewBox="0 0 48 48" className="mx-auto size-24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <circle cx="24" cy="22" r="15" /><path d="M24 13v9l6 5" /><path d="M34 33l8 9" />
        </svg>
        <div className="mt-1 text-center text-xl tracking-[0.35em]">مواقيت</div>
      </div>
    </div>
  );
}
