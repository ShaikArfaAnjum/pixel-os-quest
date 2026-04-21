import { useProgress, XP_PER_LEVEL_VALUE } from "@/store/progress";
import { LEVELS } from "@/data/levels";
import { Zap } from "lucide-react";

export function ProfileCard() {
  const { username, level, xp, progressInLevel, xpToNext, completedLessons, unlocked } = useProgress();
  const pct = (progressInLevel / XP_PER_LEVEL_VALUE) * 100;
  const currentLevel = LEVELS[Math.min(level - 1, LEVELS.length - 1)];

  return (
    <div className="glass-card rounded-xl p-6 relative overflow-hidden scanline">
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />

      <div className="relative flex flex-col sm:flex-row gap-6 items-start">
        <div className="relative">
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent p-0.5 animate-pulse-glow">
            <div className="w-full h-full rounded-[10px] bg-card flex items-center justify-center font-display font-bold text-3xl text-gradient-cyber">
              {username.slice(0, 1).toUpperCase()}
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-accent text-accent-foreground text-xs font-mono font-bold shadow-lg">
            LV {level}
          </div>
        </div>

        <div className="flex-1 w-full">
          <div className="flex items-baseline gap-2 mb-1">
            <h2 className="font-display text-2xl font-bold">{username}</h2>
            <span className="text-xs font-mono text-muted-foreground uppercase">// {currentLevel.title}</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{currentLevel.subtitle}</p>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-secondary cyan-text flex items-center gap-1">
                <Zap className="w-3 h-3" /> {xp} XP
              </span>
              <span className="text-muted-foreground">{xpToNext} XP to LV {level + 1}</span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-700 relative"
                style={{ width: `${pct}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5">
            <Stat label="LESSONS" value={completedLessons.size} accent="primary" />
            <Stat label="BADGES" value={unlocked.size} accent="secondary" />
            <Stat label="LEVEL" value={level} accent="accent" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent: string }) {
  const colorMap: Record<string, string> = {
    primary: "text-primary neon-text",
    secondary: "text-secondary cyan-text",
    accent: "text-accent pink-text",
  };
  return (
    <div className="rounded-lg bg-muted/40 border border-border p-3 text-center">
      <div className={`font-display text-2xl font-bold ${colorMap[accent]}`}>{value}</div>
      <div className="text-[10px] font-mono text-muted-foreground tracking-widest">{label}</div>
    </div>
  );
}
