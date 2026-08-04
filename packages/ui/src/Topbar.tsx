"use client";
import { Bell, Search } from "lucide-react";
import { Avatar } from "./ui";

export function Topbar({ title, user = "Martin Garrix" }: { title: string; user?: string }) {
  return (
    <header className="sticky top-0 z-20 flex h-[72px] items-center gap-6 border-b border-neutral-200/70 bg-white px-8 dark:border-white/5 dark:bg-night">
      <label className="flex h-11 w-96 items-center gap-3 rounded-full bg-fog px-5 text-neutral-400 dark:bg-white/10">
        <Search className="size-4" />
        <input placeholder="Search" className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-neutral-400 dark:text-neutral-200" />
      </label>
      <h1 className="flex-1 text-center text-2xl font-extrabold tracking-wide text-neutral-800 dark:text-white">{title}</h1>
      <button className="relative text-neutral-500 hover:text-neutral-800 dark:text-neutral-300" aria-label="Notifications">
        <Bell className="size-6" />
        <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-red-500" />
      </button>
      <span className="h-8 w-px bg-neutral-200 dark:bg-white/10" />
      <div className="flex items-center gap-3">
        <span className="text-base font-bold text-neutral-800 dark:text-white">{user}</span>
        <Avatar name={user} size={44} />
      </div>
    </header>
  );
}
