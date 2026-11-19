"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Direction = "ltr" | "rtl";

type Ctx = {
  dark: boolean;
  toggle: () => void;
  dir: Direction;
  toggleDir: () => void;
  /** sidebar collapsed to an icon-only rail (desktop, persisted) */
  collapsed: boolean;
  toggleCollapsed: () => void;
  /** off-canvas drawer open (below the lg breakpoint, not persisted) */
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
};

const ThemeCtx = createContext<Ctx>({
  dark: false, toggle: () => {},
  dir: "ltr", toggleDir: () => {},
  collapsed: false, toggleCollapsed: () => {},
  mobileOpen: false, setMobileOpen: () => {},
});

/** Read persisted prefs during the first client render rather than in an effect,
 *  which avoids a cascading re-render (and react-hooks/set-state-in-effect). */
function readStored<T>(key: string, parse: (raw: string) => T, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : parse(raw);
  } catch {
    return fallback;
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(() => readStored("mw-theme", v => v === "dark", false));
  const [dir, setDir] = useState<Direction>(() =>
    readStored<Direction>("mw-dir", v => (v === "rtl" ? "rtl" : "ltr"), "ltr"));
  const [collapsed, setCollapsed] = useState(() => readStored("mw-collapsed", v => v === "1", false));
  const [mobileOpen, setMobileOpen] = useState(false);

  /**
   * The server always renders the defaults, but the client's lazy initialisers
   * above read localStorage — so any component rendering text from these values
   * (e.g. a "Dark Mode" / "Light Mode" label) would hydrate with a mismatch.
   * Exposing the defaults until after mount keeps the first client render
   * identical to the server's. There is no flash: PrefsScript has already
   * applied the real theme/dir to <html> before first paint.
   */
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem("mw-theme", dark ? "dark" : "light"); } catch {}
  }, [dark]);

  // `dir` on <html> is what makes Tailwind's logical properties (ms-/me-/ps-/pe-/
  // start-/end-) and rtl:/ltr: variants flip. Setting it here keeps every zone
  // consistent without a server round-trip.
  useEffect(() => {
    document.documentElement.setAttribute("dir", dir);
    try { localStorage.setItem("mw-dir", dir); } catch {}
  }, [dir]);

  useEffect(() => {
    try { localStorage.setItem("mw-collapsed", collapsed ? "1" : "0"); } catch {}
  }, [collapsed]);

  const value = useMemo<Ctx>(() => ({
    dark: mounted ? dark : false,
    toggle: () => setDark(d => !d),
    dir: mounted ? dir : "ltr",
    toggleDir: () => setDir(d => (d === "ltr" ? "rtl" : "ltr")),
    collapsed: mounted ? collapsed : false,
    toggleCollapsed: () => setCollapsed(c => !c),
    mobileOpen,
    setMobileOpen,
  }), [mounted, dark, dir, collapsed, mobileOpen]);

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);

/** Convenience hook for components that only care about direction. */
export function useDirection() {
  const { dir } = useContext(ThemeCtx);
  return { dir, isRtl: dir === "rtl" };
}
