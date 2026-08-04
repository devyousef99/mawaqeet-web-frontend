"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Ctx = { dark: boolean; toggle: () => void };
const ThemeCtx = createContext<Ctx>({ dark: false, toggle: () => {} });

/** Read the stored theme during the first client render instead of in an effect,
 *  which avoids a cascading re-render (and the react-hooks/set-state-in-effect lint error). */
function readStoredTheme() {
  if (typeof window === "undefined") return false;
  try { return localStorage.getItem("mw-theme") === "dark"; } catch { return false; }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(readStoredTheme);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem("mw-theme", dark ? "dark" : "light"); } catch {}
  }, [dark]);
  return (
    <ThemeCtx.Provider value={{ dark, toggle: () => setDark(d => !d) }}>
      {children}
    </ThemeCtx.Provider>
  );
}
export const useTheme = () => useContext(ThemeCtx);
