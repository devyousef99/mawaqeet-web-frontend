"use client";
import { useTheme } from "./theme";

/**
 * Recharts styles its tooltip with inline styles, so Tailwind's `dark:` variants
 * cannot reach it — a tooltip left at the default renders as a white box with
 * dark text on top of a dark dashboard. This hook returns theme-aware props for
 * the pieces of a chart that recharts controls inline.
 */
export function useChartTheme() {
  const { dark } = useTheme();
  return {
    /** spread onto <Tooltip contentStyle={...}> */
    tooltipContentStyle: {
      borderRadius: 12,
      fontWeight: 600,
      background: dark ? "#202226" : "#ffffff",
      border: `1px solid ${dark ? "rgba(255,255,255,0.12)" : "#eee"}`,
      color: dark ? "#e8e9ec" : "#2b2d33",
    } as const,
    /** spread onto <Tooltip itemStyle={...}> / labelStyle */
    tooltipItemStyle: { color: dark ? "#e8e9ec" : "#2b2d33" } as const,
    /** hover highlight behind the active bar */
    cursorFill: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
    /** axis tick + grid colours that hold contrast on either theme */
    axisTick: dark ? "#9aa1ab" : "#6b7280",
    grid: dark ? "rgba(255,255,255,0.12)" : "#d1d5db",
  };
}
