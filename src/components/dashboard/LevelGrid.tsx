import { Link } from "react-router-dom";
import { LEVELS } from "@/data/levels";
import { useProgress } from "@/store/progress";
import { Lock, CheckCircle2 } from "lucide-react";

const SIM_ROUTES: Record<number, string> = {
  2: "/sim/scheduling",
  3: "/sim/semaphore",
  8: "/sim/page-replacement",
};

export function LevelGrid() {
  const { level: userLevel } = useProgress();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {LEVELS.map((lvl, idx) => {
        const Icon = lvl.icon;
        const unlocked = lvl.id <= userLevel;
        const route = SIM_ROUTES[lvl.id] ?? "/learn";
        const colorClass =
          lvl.color === "primary" ? "from-primary/20 to-primary/5 border-primary/40 text-primary" :
          lvl.color === "secondary" ? "from-secondary/20 to-secondary/5 border-secondary/40 text-secondary" :
          lvl.color === "accent" ? "from-accent/20 to-accent/5 border-accent/40 text-accent" :
          "from-warning/20 to-warning/5 border-warning/40 text-warning";

        return (
          <Link
            key={lvl.id}
            to={unlocked ? route : "#"}
            onClick={(e) => !unlocked && e.preventDefault()}
            className={`group relative rounded-xl border bg-gradient-to-br p-4 transition-all hover:-translate-y-1 ${colorClass} ${
              !unlocked ? "opacity-40 cursor-not-allowed" : "hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)]"
            }`}
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg bg-card/80 border border-current/30 flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="font-mono text-xs opacity-60">LV {lvl.id.toString().padStart(2, "0")}</div>
            </div>
            <h3 className="font-display font-bold text-lg leading-tight">{lvl.title}</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-3">{lvl.subtitle}</p>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="opacity-70">{lvl.topics.length} topics</span>
              {unlocked ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
