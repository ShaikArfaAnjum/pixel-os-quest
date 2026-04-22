import { Link } from "react-router-dom";
import { ArrowRight, Cpu, Gamepad2, PlayCircle, Sparkles, Star, Trophy, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  { icon: PlayCircle, title: "Animated Lessons", desc: "Visual storytelling for every concept", color: "primary" },
  { icon: Gamepad2, title: "Interactive Simulators", desc: "CPU, paging, semaphores — touch the OS", color: "secondary" },
  { icon: Trophy, title: "Gamified Progress", desc: "XP, badges, levels, daily quests", color: "accent" },
  { icon: Users, title: "Leaderboard", desc: "Compete with classmates worldwide", color: "primary" },
];

const STATS = [
  { v: "500+", l: "students learning OS" },
  { v: "95%", l: "say they understand better" },
  { v: "4.9", l: "average rating", icon: Star },
];

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col grid-bg">
      {/* Top nav */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-mono font-bold text-background">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="font-display font-bold text-lg leading-none">
              <div className="text-gradient-cyber">OS.QUEST</div>
              <div className="text-[10px] text-muted-foreground tracking-[0.3em] font-mono uppercase">v1.0</div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="font-mono uppercase tracking-wider">
              <Link to="/dashboard">Enter <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative container py-20 md:py-32 text-center overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px]" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card mb-6 font-mono text-[10px] uppercase tracking-[0.25em] text-secondary">
            <Sparkles className="w-3 h-3" /> The most fun way to learn OS
          </div>

          <h1 className="font-display font-bold text-5xl md:text-7xl leading-[1.05] tracking-tight max-w-4xl mx-auto">
            Master <span className="text-gradient-cyber">Operating Systems</span><br />
            Through Gaming
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Learn OS from basics to advanced with animations, interactive simulators, and challenges.
            Earn XP. Climb the leaderboard. Actually understand it.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="h-14 px-8 text-base font-mono uppercase tracking-wider animate-pulse-glow">
              <Link to="/dashboard">
                <Zap className="w-5 h-5" /> Get Started
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {STATS.map((s) => (
              <div key={s.l} className="glass-card rounded-xl p-4">
                <div className="font-display font-bold text-3xl md:text-4xl text-gradient-cyber flex items-center justify-center gap-1">
                  {s.v}
                  {s.icon && <s.icon className="w-5 h-5 text-warning fill-warning" />}
                </div>
                <div className="text-[11px] font-mono text-muted-foreground tracking-wide mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="container py-16">
          <div className="text-center mb-12">
            <div className="font-mono text-xs text-secondary tracking-[0.3em] uppercase mb-2">// what you'll get</div>
            <h2 className="font-display font-bold text-3xl md:text-5xl">Built like a game. Teaches like a pro.</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              const c =
                f.color === "primary" ? "from-primary/20 border-primary/40 text-primary" :
                f.color === "secondary" ? "from-secondary/20 border-secondary/40 text-secondary" :
                "from-accent/20 border-accent/40 text-accent";
              return (
                <div key={f.title} className={`group rounded-xl border bg-gradient-to-br ${c} to-transparent p-6 hover:-translate-y-1 transition-all`}>
                  <Icon className="w-8 h-8 mb-4" />
                  <h3 className="font-display font-bold text-lg">{f.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="container py-20">
          <div className="glass-card rounded-2xl p-10 md:p-16 text-center scanline relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-60 h-60 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-12 -left-12 w-60 h-60 bg-accent/20 rounded-full blur-3xl" />
            <h2 className="font-display font-bold text-3xl md:text-5xl relative">
              Ready to <span className="text-gradient-cyber">level up</span>?
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto relative">
              Join hundreds of students who turned a dry syllabus into the best game on their phone.
            </p>
            <Button asChild size="lg" className="mt-8 h-14 px-10 font-mono uppercase tracking-wider relative">
              <Link to="/dashboard">
                Start your quest <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 py-6 text-center text-xs font-mono text-muted-foreground">
        <span className="text-primary">$</span> OS.QUEST · learning operating systems, gamified
      </footer>
    </div>
  );
}
