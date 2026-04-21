import { useState } from "react";
import { Chapter } from "@/data/chapters";
import { StoryAnimation } from "./StoryAnimation";
import { useProgress } from "@/store/progress";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, CheckCircle2, Trophy, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function StoryPlayer({ chapter }: { chapter: Chapter }) {
  const [stage, setStage] = useState<"hook" | "scene" | "challenge" | "done">("hook");
  const [sceneIdx, setSceneIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const { addXP, completeLesson, completedLessons } = useProgress();
  const alreadyDone = completedLessons.has(`chapter-${chapter.id}`);

  const scene = chapter.scenes[sceneIdx];
  const isLastScene = sceneIdx === chapter.scenes.length - 1;

  const next = () => {
    if (stage === "hook") setStage("scene");
    else if (stage === "scene") {
      if (isLastScene) setStage("challenge");
      else setSceneIdx((i) => i + 1);
    }
  };
  const prev = () => {
    if (stage === "scene" && sceneIdx > 0) setSceneIdx((i) => i - 1);
    else if (stage === "scene") setStage("hook");
    else if (stage === "challenge") setStage("scene");
  };

  const submit = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === chapter.challenge.correct) {
      const reward = chapter.challenge.xp + (alreadyDone ? 0 : chapter.xpReward);
      addXP(reward);
      completeLesson(`chapter-${chapter.id}`);
      toast({ title: `+${reward} XP`, description: `${chapter.title} mastered!` });
      setTimeout(() => setStage("done"), 800);
    }
  };

  return (
    <div className="space-y-6">
      {/* progress steps */}
      <div className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <Step label="Hook" active={stage === "hook"} done={stage !== "hook"} />
        <span>—</span>
        <Step label={`Scenes (${sceneIdx + 1}/${chapter.scenes.length})`} active={stage === "scene"} done={stage === "challenge" || stage === "done"} />
        <span>—</span>
        <Step label="Challenge" active={stage === "challenge"} done={stage === "done"} />
      </div>

      {stage === "hook" && (
        <div className="glass-card rounded-xl p-6 sm:p-8 space-y-5 animate-fade-in">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary mt-1 shrink-0" />
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-secondary mb-1">The Hook</div>
              <p className="font-display text-xl sm:text-2xl leading-snug">{chapter.hook}</p>
            </div>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-2">Why it matters</div>
            <p className="text-muted-foreground leading-relaxed">{chapter.whyItMatters}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {chapter.analogies.map((a, i) => (
              <div key={i} className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="text-2xl mb-1">{a.emoji}</div>
                <div className="font-display font-bold mb-1">{a.title}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {stage === "scene" && (
        <div className="space-y-4 animate-fade-in">
          <StoryAnimation name={scene.animation} />
          <div className="glass-card rounded-xl p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-primary mb-2">
              Scene {sceneIdx + 1} of {chapter.scenes.length}
            </div>
            <p className="font-display text-lg leading-snug mb-3">{scene.narration}</p>
            {scene.keyPoints && (
              <ul className="space-y-1.5 pt-2 border-t border-border">
                {scene.keyPoints.map((kp, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5">›</span>
                    <span>{kp}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {stage === "challenge" && (
        <div className="glass-card rounded-xl p-6 sm:p-8 space-y-5 animate-scale-in">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-warning mb-2 flex items-center gap-2">
              <Trophy className="w-3 h-3" /> Challenge · +{chapter.challenge.xp} XP
            </div>
            <h3 className="font-display text-xl font-bold">{chapter.challenge.question}</h3>
          </div>
          <div className="space-y-2">
            {chapter.challenge.options.map((opt, i) => {
              const isCorrect = i === chapter.challenge.correct;
              const isPicked = picked === i;
              const showState = picked !== null;
              return (
                <button
                  key={i}
                  onClick={() => submit(i)}
                  disabled={picked !== null}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    showState
                      ? isCorrect
                        ? "border-success bg-success/10"
                        : isPicked
                        ? "border-destructive bg-destructive/10"
                        : "border-border opacity-60"
                      : "border-border bg-muted/20 hover:border-primary/50 hover:bg-primary/5"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm">{opt}</span>
                    {showState && isCorrect && <CheckCircle2 className="w-4 h-4 text-success shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <div className="rounded-lg bg-muted/30 border border-border p-4 text-sm text-muted-foreground">
              <span className="font-mono text-[10px] text-secondary uppercase tracking-widest block mb-1">Explanation</span>
              {chapter.challenge.explain}
            </div>
          )}
        </div>
      )}

      {stage === "done" && (
        <div className="glass-card rounded-xl p-8 text-center space-y-4 animate-scale-in">
          <div className="text-6xl">🎉</div>
          <h2 className="font-display text-3xl font-bold text-gradient-primary">Chapter Mastered!</h2>
          <p className="text-muted-foreground">You earned XP and unlocked the next chapter.</p>
          {chapter.simRoute && (
            <Link to={chapter.simRoute} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-secondary/20 text-secondary border border-secondary/40 font-mono text-sm hover:bg-secondary/30">
              {chapter.simLabel ?? "Try the simulator"} <ArrowRight className="w-4 h-4" />
            </Link>
          )}
          {chapter.nextChapter && (
            <div>
              <Link to={`/chapter/${chapter.nextChapter}`} onClick={() => { setStage("hook"); setSceneIdx(0); setPicked(null); }} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-display font-bold hover:bg-primary/90">
                Next Chapter <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* nav */}
      {stage !== "done" && (
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={prev}
            disabled={stage === "hook"}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          {stage !== "challenge" && (
            <button
              onClick={next}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-display font-bold text-sm hover:bg-primary/90"
            >
              {stage === "hook" ? "Begin" : isLastScene ? "Take the Challenge" : "Next Scene"} <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Step({ label, active, done }: { label: string; active: boolean; done: boolean }) {
  return (
    <span className={active ? "text-primary" : done ? "text-success" : "text-muted-foreground"}>
      {done ? "✓ " : ""}{label}
    </span>
  );
}
