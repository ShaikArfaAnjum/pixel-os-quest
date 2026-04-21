import { ACHIEVEMENTS, useProgress } from "@/store/progress";

export function AchievementGrid() {
  const { unlocked } = useProgress();
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {ACHIEVEMENTS.map((a) => {
        const got = unlocked.has(a.id);
        return (
          <div
            key={a.id}
            className={`rounded-lg p-3 text-center border transition-all ${
              got
                ? "border-primary/50 bg-primary/5 shadow-[0_0_20px_hsl(var(--primary)/0.2)]"
                : "border-border bg-muted/20 opacity-50 grayscale"
            }`}
          >
            <div className={`text-3xl mb-1 ${got ? "animate-float" : ""}`}>{a.icon}</div>
            <div className="font-mono text-[10px] uppercase tracking-wider font-bold">{a.name}</div>
            <div className="text-[10px] text-muted-foreground mt-1 leading-tight">{a.description}</div>
          </div>
        );
      })}
    </div>
  );
}
