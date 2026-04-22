import { AppLayout } from "@/components/layout/AppLayout";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { Leaderboard } from "@/components/dashboard/Leaderboard";
import { LevelGrid } from "@/components/dashboard/LevelGrid";
import { AchievementGrid } from "@/components/dashboard/AchievementGrid";
import { PageHeader } from "@/components/PageHeader";
import { Link } from "react-router-dom";
import { useProgress } from "@/store/progress";
import { ACHIEVEMENTS } from "@/store/progress";
import { CHAPTERS } from "@/data/chapters";
import { ArrowRight, Cpu, Database, Workflow, Sparkles, Flame, Target, Trophy, PlayCircle, BookOpen } from "lucide-react";

const QUICK = [
  { to: "/sim/scheduling", title: "CPU Scheduling", desc: "FCFS · SJF · RR · Priority", icon: Cpu, color: "primary" },
  { to: "/sim/page-replacement", title: "Page Replacement", desc: "FIFO · LRU · Optimal", icon: Database, color: "secondary" },
  { to: "/sim/semaphore", title: "Producer-Consumer", desc: "Semaphores in action", icon: Workflow, color: "accent" },
  { to: "/quiz", title: "Knowledge Quiz", desc: "Test your skills", icon: Trophy, color: "primary" },
];

const DAILY_CHALLENGES = [
  { title: "Beat the FIFO algorithm at Page Replacement", reward: 50, difficulty: "Medium", to: "/sim/page-replacement" },
  { title: "Run all CPU scheduling algorithms back-to-back", reward: 50, difficulty: "Easy", to: "/sim/scheduling" },
  { title: "Score 100% on the OS Knowledge Quiz", reward: 75, difficulty: "Hard", to: "/quiz" },
  { title: "Complete a full chapter from start to finish", reward: 60, difficulty: "Medium", to: "/chapters" },
];

export default function Dashboard() {
  const { username, xp, level, unlocked, completedLessons, progressInLevel } = useProgress();
  const dayIdx = Math.floor(Date.now() / 86400000) % DAILY_CHALLENGES.length;
  const daily = DAILY_CHALLENGES[dayIdx];

  // Resume chapter
  const lastChapterIdx = Math.min(Math.floor(completedLessons.size / 2), CHAPTERS.length - 1);
  const resumeChapter = CHAPTERS[lastChapterIdx];

  // Latest achievement
  const latestAch = [...unlocked].length
    ? ACHIEVEMENTS.find((a) => a.id === [...unlocked][unlocked.size - 1])
    : null;

  return (
    <AppLayout>
      <PageHeader
        kicker={`welcome back, ${username}`}
        title="Your Mission Control."
        subtitle="Daily challenge, leaderboard, and the next lesson — all in one place."
      />

      {/* Top quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat icon={Sparkles} label="LEVEL" value={level} hint={`${progressInLevel}/250 XP`} color="primary" />
        <Stat icon={Flame} label="XP" value={xp.toLocaleString()} hint="lifetime" color="secondary" />
        <Stat icon={Trophy} label="BADGES" value={unlocked.size} hint={`/ ${ACHIEVEMENTS.length}`} color="accent" />
        <Stat icon={BookOpen} label="LESSONS" value={completedLessons.size} hint="completed" color="primary" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Continue learning */}
          <Link to={`/chapter/${resumeChapter.id}`} className="block glass-card rounded-xl p-6 border-primary/40 hover:border-primary transition-all hover:-translate-y-0.5 group relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-background animate-pulse-glow shrink-0">
                <PlayCircle className="w-7 h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[10px] uppercase tracking-widest text-secondary">continue learning</div>
                <h3 className="font-display font-bold text-xl truncate">{resumeChapter.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{resumeChapter.subtitle}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform shrink-0" />
            </div>
          </Link>

          {/* Daily challenge + Achievement spotlight */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="glass-card rounded-xl p-5 border-accent/30 relative overflow-hidden">
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-accent" />
                  <h3 className="font-display font-bold uppercase tracking-wider">Daily Challenge</h3>
                </div>
                <p className="text-sm mb-3">{daily.title}</p>
                <div className="flex items-center gap-2 mb-3 text-[10px] font-mono uppercase tracking-wider">
                  <span className="px-2 py-0.5 rounded bg-warning/20 text-warning border border-warning/40">{daily.difficulty}</span>
                  <span className="px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/40">+{daily.reward} XP</span>
                </div>
                <Link to={daily.to} className="inline-flex items-center gap-1 text-sm font-mono text-accent hover:underline">
                  Start challenge <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="glass-card rounded-xl p-5 border-primary/30 relative overflow-hidden">
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-bold uppercase tracking-wider">Spotlight</h3>
                </div>
                {latestAch ? (
                  <>
                    <div className="text-4xl mb-1 animate-float">{latestAch.icon}</div>
                    <div className="font-display font-bold">{latestAch.name}</div>
                    <p className="text-xs text-muted-foreground">{latestAch.description}</p>
                  </>
                ) : (
                  <>
                    <div className="text-4xl mb-1 opacity-50">🎯</div>
                    <div className="font-display font-bold">Earn your first badge</div>
                    <p className="text-xs text-muted-foreground">Complete a lesson to unlock achievements</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <ProfileCard />

          {/* Quick launch */}
          <div>
            <h2 className="font-display font-bold uppercase tracking-wider text-lg mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full" /> Quick Launch
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {QUICK.map((q) => {
                const Icon = q.icon;
                const c = q.color === "primary" ? "from-primary/20 border-primary/40 text-primary" : q.color === "secondary" ? "from-secondary/20 border-secondary/40 text-secondary" : "from-accent/20 border-accent/40 text-accent";
                return (
                  <Link key={q.to} to={q.to} className={`group rounded-xl border bg-gradient-to-br ${c} to-transparent p-4 hover:-translate-y-1 transition-all`}>
                    <Icon className="w-6 h-6 mb-2" />
                    <div className="font-display font-bold text-sm">{q.title}</div>
                    <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{q.desc}</div>
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
}

function Stat({ icon: Icon, label, value, hint, color }: { icon: any; label: string; value: any; hint: string; color: string }) {
  const c = color === "primary" ? "text-primary border-primary/30" : color === "secondary" ? "text-secondary border-secondary/30" : "text-accent border-accent/30";
  return (
    <div className={`glass-card rounded-xl p-4 border ${c}`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-4 h-4 ${c}`} />
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{label}</span>
      </div>
      <div className={`font-display font-bold text-2xl ${c}`}>{value}</div>
      <div className="text-[10px] font-mono text-muted-foreground mt-0.5">{hint}</div>
    </div>
  );
}
