import { Sparkles, Droplets, Scissors, Flame, HandHeart } from "lucide-react";
import { Dot } from "./ui";
import type { Status } from "@/lib/data";

const map: Record<string, { bg: string; fg: string; Icon: typeof Sparkles }> = {
  massage:  { bg: "#e6f7f4", fg: "#1fb9a9", Icon: HandHeart },
  hotstone: { bg: "#e8f1fb", fg: "#1e3a5f", Icon: Flame },
  nails:    { bg: "#f0813c", fg: "#ffffff", Icon: Droplets },
  beard:    { bg: "#c9b49a", fg: "#6b4a1f", Icon: Scissors },
  bath:     { bg: "#f3f4f6", fg: "#374151", Icon: Sparkles },
};

export function ServiceIcon({ kind, dot, size = 52 }: { kind: string; dot?: Status; size?: number }) {
  const m = map[kind] ?? map.massage;
  const Icon = m.Icon;
  return (
    <span className="relative inline-block shrink-0">
      <span className="flex items-center justify-center rounded-full" style={{ width: size, height: size, background: m.bg }}>
        <Icon style={{ color: m.fg, width: size * 0.5, height: size * 0.5 }} strokeWidth={1.8} />
      </span>
      {dot && <Dot s={dot} className="absolute bottom-0 left-0 ring-2 ring-white dark:ring-night-2" />}
    </span>
  );
}
