"use client";
import { Bell, Languages, Menu, Moon, Search, Sun } from "lucide-react";
import { Avatar } from "./ui";
import { useTheme } from "./theme";

/** Shared styling for the round icon buttons on the trailing side of the header. */
const iconBtn =
  "flex size-10 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white";

export function Topbar({ title, user = "Martin Garrix" }: { title: string; user?: string }) {
  const { dark, toggle, dir, toggleDir, toggleCollapsed } = useTheme();

  return (
    <header className="sticky top-0 z-20 flex h-[72px] items-center gap-4 border-b border-neutral-200/70 bg-white px-6 dark:border-white/5 dark:bg-night-1">
      <button
        onClick={toggleCollapsed}
        className={iconBtn}
        aria-label="Toggle sidebar"
      >
        <Menu className="size-6" />
      </button>

      <label className="flex h-11 w-80 items-center gap-3 rounded-full bg-fog px-5 text-neutral-400 dark:bg-white/10">
        <Search className="size-4 shrink-0" />
        <input placeholder="Search" className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-neutral-400 dark:text-neutral-200" />
      </label>

      <h1 className="flex-1 text-center text-2xl font-extrabold tracking-wide text-neutral-800 dark:text-white">{title}</h1>

      <button
        onClick={toggle}
        className={iconBtn}
        aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        title={dark ? "Light mode" : "Dark mode"}
      >
        {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
      </button>

      <button
        onClick={toggleDir}
        className={`${iconBtn} relative`}
        aria-label={`Switch to ${dir === "ltr" ? "right-to-left" : "left-to-right"} layout`}
        title={dir === "ltr" ? "Switch to RTL" : "Switch to LTR"}
      >
        <Languages className="size-5" />
        <span className="absolute -bottom-0.5 text-[9px] font-extrabold tracking-tight">
          {dir.toUpperCase()}
        </span>
      </button>

      <button className={`${iconBtn} relative`} aria-label="Notifications">
        <Bell className="size-5" />
        <span className="absolute end-2 top-2 size-2.5 rounded-full bg-red-500" />
      </button>

      <span className="h-8 w-px bg-neutral-200 dark:bg-white/10" />

      <div className="flex items-center gap-3">
        <span className="hidden text-base font-bold text-neutral-800 sm:block dark:text-white">{user}</span>
        <Avatar name={user} size={44} />
      </div>
    </header>
  );
}
