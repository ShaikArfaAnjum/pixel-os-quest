import { useParams, Link, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { getChapter, CHAPTERS } from "@/data/chapters";
import { StoryPlayer } from "@/components/story/StoryPlayer";
import { ArrowLeft, Clock, Zap } from "lucide-react";

export default function ChapterPage() {
  const { id } = useParams();
  const chapter = id ? getChapter(id) : undefined;
  if (!chapter) return <Navigate to="/chapters" replace />;
  const Icon = chapter.icon;

  return (
    <AppLayout>
      <Link to="/chapters" className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-primary mb-4">
        <ArrowLeft className="w-3.5 h-3.5" /> All Chapters
      </Link>

      <header className="mb-8 flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-primary/15 border border-primary/40 flex items-center justify-center text-primary shrink-0">
          <Icon className="w-7 h-7" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
            <span className="text-secondary">Phase {chapter.phase} · {chapter.phaseLabel}</span>
            <span>•</span>
            <span>Chapter {chapter.order.toString().padStart(2, "0")}</span>
            <span>•</span>
            <span className="text-accent">{chapter.difficulty}</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight">{chapter.title}</h1>
          <p className="text-muted-foreground mt-1">{chapter.subtitle}</p>
          <div className="flex items-center gap-4 mt-3 text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> ~{chapter.estMinutes} min</span>
            <span className="flex items-center gap-1 text-primary"><Zap className="w-3 h-3" /> +{chapter.xpReward + chapter.challenge.xp} XP</span>
          </div>
        </div>
      </header>

      <StoryPlayer chapter={chapter} />
    </AppLayout>
  );
}

export function ChaptersIndexPage() {
  return (
    <AppLayout>
      <header className="mb-8">
        <div className="font-mono text-[10px] uppercase tracking-widest text-secondary mb-1">your journey</div>
        <h1 className="font-display text-4xl font-bold">Chapters</h1>
        <p className="text-muted-foreground mt-1">Animated, story-first lessons. Watch, learn, then beat the challenge to unlock the next.</p>
      </header>
      <div className="space-y-8">
        {Array.from(new Set(CHAPTERS.map((c) => c.phase))).map((p) => {
          const phaseChapters = CHAPTERS.filter((c) => c.phase === p);
          return (
            <section key={p}>
              <h2 className="font-display font-bold uppercase tracking-wider text-lg mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full" />
                Phase {p} · {phaseChapters[0].phaseLabel}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {phaseChapters.map((c) => {
                  const Icon = c.icon;
                  return (
                    <Link key={c.id} to={`/chapter/${c.id}`} className="glass-card rounded-xl p-5 hover:-translate-y-1 transition-all hover:border-primary/50 group">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/15 border border-primary/40 flex items-center justify-center text-primary">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">CH {c.order.toString().padStart(2, "0")}</span>
                      </div>
                      <h3 className="font-display font-bold text-lg leading-tight group-hover:text-primary transition-colors">{c.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{c.subtitle}</p>
                      <div className="flex items-center justify-between mt-4 text-xs font-mono">
                        <span className="text-accent">{c.difficulty}</span>
                        <span className="text-primary">+{c.xpReward + c.challenge.xp} XP</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </AppLayout>
  );
}
