import { useProgress } from "@/store/progress";
import { Trophy } from "lucide-react";

const FAKE = [
  { name: "Neo_42", xp: 2840 },
  { name: "BitWizard", xp: 2150 },
  { name: "KernelHacker", xp: 1890 },
  { name: "PagingPro", xp: 1420 },
  { name: "SemaphoreSam", xp: 980 },
  { name: "ForkBomb", xp: 720 },
];

export function Leaderboard() {
  const { username, xp } = useProgress();
  const all = [...FAKE, { name: username, xp }].sort((a, b) => b.xp - a.xp);

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-warning" />
        <h3 className="font-display font-bold uppercase tracking-wider">Leaderboard</h3>
      </div>
      <div className="space-y-2">
        {all.slice(0, 7).map((p, i) => {
          const isYou = p.name === username;
          return (
            <div
              key={p.name + i}
              className={`flex items-center gap-3 p-2 rounded-md ${
                isYou ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/40"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-mono font-bold ${
                  i === 0 ? "bg-warning text-background" :
                  i === 1 ? "bg-muted-foreground/40 text-foreground" :
                  i === 2 ? "bg-accent/60 text-foreground" :
                  "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              <div className="flex-1 font-mono text-sm">
                {p.name} {isYou && <span className="text-primary text-xs">// you</span>}
              </div>
              <div className="font-mono text-xs text-secondary">{p.xp.toLocaleString()} XP</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
