import { AppLayout } from "@/components/layout/AppLayout";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { LevelGrid } from "@/components/dashboard/LevelGrid";
import { AchievementGrid } from "@/components/dashboard/AchievementGrid";
import { Leaderboard } from "@/components/dashboard/Leaderboard";
import { PageHeader } from "@/components/PageHeader";
import { Link } from "react-router-dom";
import { Cpu, Database, Workflow, ArrowRight, Sparkles } from "lucide-react";

const QUICK = [
  { to: "/sim/scheduling", title: "CPU Scheduling", desc: "FCFS · SJF · RR · Priority", icon: Cpu, color: "primary" },
  { to: "/sim/page-replacement", title: "Page Replacement", desc: "FIFO · LRU · Optimal", icon: Database, color: "secondary" },
  { to: "/sim/semaphore", title: "Producer-Consumer", desc: "Semaphores in action", icon: Workflow, color: "accent" },
];

const Index = () => {
  return (
    <AppLayout>
      <PageHeader
        kicker="welcome cadet"
        title="Master the Operating System."
        subtitle="An interactive, gamified path through OS fundamentals — from Linux & processes to virtual memory and disk scheduling."
      />

      <Link to="/chapters" className="block mb-6 glass-card rounded-xl p-5 border-primary/40 hover:border-primary transition-all hover:-translate-y-0.5 group">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-background animate-pulse-glow">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-secondary">new · animated learning path</div>
              <h2 className="font-display font-bold text-xl">Start the Story-Driven Journey</h2>
              <p className="text-sm text-muted-foreground">14 chapters · animated scenes · real-world analogies · XP challenges.</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform shrink-0" />
        </div>
      </Link>

      <div className="grid lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 space-y-6">
          <ProfileCard />

          <div>
            <h2 className="font-display font-bold uppercase tracking-wider text-lg mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full" /> Quick Launch
            </h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {QUICK.map((q) => {
                const Icon = q.icon;
                const c = q.color === "primary" ? "from-primary/20 border-primary/40 text-primary" : q.color === "secondary" ? "from-secondary/20 border-secondary/40 text-secondary" : "from-accent/20 border-accent/40 text-accent";
                return (
                  <Link key={q.to} to={q.to} className={`group rounded-xl border bg-gradient-to-br ${c} to-transparent p-4 hover:-translate-y-1 transition-all`}>
                    <Icon className="w-6 h-6 mb-2" />
                    <div className="font-display font-bold">{q.title}</div>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">{q.desc}</div>
                    <div className="flex items-center gap-1 text-xs font-mono mt-3 opacity-70 group-hover:opacity-100">
                      Launch <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <Leaderboard />
      </div>

      <div className="mb-10">
        <h2 className="font-display font-bold uppercase tracking-wider text-lg mb-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-secondary rounded-full" /> Skill Tree · 10 Levels
        </h2>
        <LevelGrid />
      </div>

      <div>
        <h2 className="font-display font-bold uppercase tracking-wider text-lg mb-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded-full" /> Achievements
        </h2>
        <AchievementGrid />
      </div>
    </AppLayout>
  );
};

export default Index;
