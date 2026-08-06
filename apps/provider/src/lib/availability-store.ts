"use client";
import type { IAvailabilityConfig } from "./availability";

/**
 * Local stand-in for the availability API (getAvailabilityConfigByUser /
 * upsertAvailabilityConfig / updateAvailabilityConfig).
 *
 * Everything is persisted to localStorage so the page is fully usable for
 * testing without a backend. The async signatures mirror the real service, so
 * swapping these three functions for HTTP calls is the only change needed when
 * the API is wired up.
 */

const KEY = "mw-availability-config";

export function loadConfig(): IAvailabilityConfig | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as IAvailabilityConfig) : null;
  } catch {
    return null;
  }
}

export function saveConfig(config: IAvailabilityConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(config));
  } catch {
    /* quota or private mode — non-fatal for a local test store */
  }
}

/** Merge a partial update into the stored config, mirroring updateAvailabilityConfig. */
export function patchConfig(
  base: IAvailabilityConfig,
  patch: Partial<IAvailabilityConfig>,
): IAvailabilityConfig {
  const next = { ...base, ...patch };
  saveConfig(next);
  return next;
}

export function clearConfig(): void {
  if (typeof window === "undefined") return;
  try { localStorage.removeItem(KEY); } catch {}
}
