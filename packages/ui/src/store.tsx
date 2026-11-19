"use client";
import { useCallback, useMemo, useSyncExternalStore } from "react";

/* ------------------------------------------------------------------ */
/*  localStorage-backed list store (demo / testing only)               */
/*                                                                     */
/*  useStore("services", services) → the seed list on first load, then */
/*  whatever the user created/edited/deleted, persisted under          */
/*  `mw:services`. Open DevTools → Application → Local Storage to      */
/*  inspect. `reset()` restores the seed.                              */
/*                                                                     */
/*  Built on useSyncExternalStore: the server (and the hydration pass) */
/*  see the seed, the client sees localStorage, and any write — even   */
/*  from another tab — re-renders every subscriber. No effects.        */
/* ------------------------------------------------------------------ */

const PREFIX = "mw:";
const EVENT = "mw-store";

/* Snapshot cache keyed by the raw string so snapshots stay referentially
   stable between renders (a useSyncExternalStore requirement). */
const cache = new Map<string, { raw: string | null; items: unknown[] }>();

function readRaw(key: string): string | null {
  try { return localStorage.getItem(PREFIX + key); } catch { return null; }
}
function snapshot<T>(key: string, seed: T[]): T[] {
  const raw = readRaw(key);
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.items as T[];
  let items: T[] = seed;
  if (raw) { try { items = JSON.parse(raw) as T[]; } catch { items = seed; } }
  cache.set(key, { raw, items });
  return items;
}
function write<T>(key: string, items: T[]) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(items));
  } catch { /* quota / private mode — keep going in memory */ }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: key }));
}
function subscribe(key: string, cb: () => void) {
  const onChange = (e: Event) => { const k = (e as CustomEvent).detail; if (k === key || k === "*") cb(); };
  const onStorage = (e: StorageEvent) => { if (e.key === PREFIX + key || e.key === null) cb(); };
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => { window.removeEventListener(EVENT, onChange); window.removeEventListener("storage", onStorage); };
}

/** false on the server and during hydration, true once the client has taken over. */
export function useHydrated() {
  return useSyncExternalStore(() => () => {}, () => true, () => false);
}

export function useStore<T extends { id: string | number }>(key: string, seed: T[]) {
  const items = useSyncExternalStore(
    useCallback((cb: () => void) => subscribe(key, cb), [key]),
    () => snapshot(key, seed),
    () => seed,
  );
  const ready = useHydrated();

  const api = useMemo(() => {
    const current = () => snapshot(key, seed);
    const commit = (next: T[]) => write(key, next);
    return {
      add: (item: T) => commit([item, ...current()]),
      update: (id: T["id"], patch: Partial<T>) => commit(current().map(i => (i.id === id ? { ...i, ...patch } : i))),
      upsert: (item: T) => {
        const cur = current();
        commit(cur.some(i => i.id === item.id) ? cur.map(i => (i.id === item.id ? item : i)) : [item, ...cur]);
      },
      remove: (id: T["id"]) => commit(current().filter(i => i.id !== id)),
      reset: () => commit(seed),
    };
    // seed is treated as a constant per key
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const get = useCallback((id: T["id"] | string) => items.find(i => String(i.id) === String(id)), [items]);

  return { items, ready, get, ...api };
}

/** Next numeric id for a list whose ids are numbers. */
export function nextNumericId(items: { id: string | number }[]) {
  return items.reduce((m, i) => Math.max(m, Number(i.id) || 0), 0) + 1;
}

/** Wipe every `mw:*` key (theme prefs use a different prefix and are kept). */
export function resetAllStores() {
  try {
    Object.keys(localStorage).filter(k => k.startsWith(PREFIX)).forEach(k => localStorage.removeItem(k));
  } catch { /* ignore */ }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: "*" }));
}
