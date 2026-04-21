import { useState } from "react";
import { QUESTIONS } from "@/data/quiz";
import { useProgress } from "@/store/progress";
import { Check, X, RefreshCw, Trophy } from "lucide-react";

export function QuizCard() {
  const { addXP, unlock } = useProgress();
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = QUESTIONS[idx];

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.correct) {
      setScore((s) => s + 1);
      addXP(10);
    }
  };

  const next = () => {
    if (idx === QUESTIONS.length - 1) {
      setDone(true);
      if (score + (picked === q.correct ? 0 : 0) === QUESTIONS.length) unlock("perfectionist");
      // Use the actual score after this question
      const finalScore = score; // already updated
      if (finalScore === QUESTIONS.length) unlock("perfectionist");
      addXP(50);
    } else {
      setIdx(idx + 1);
      setPicked(null);
    }
  };

  const restart = () => {
    setIdx(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    const perfect = score === QUESTIONS.length;
    return (
      <div className="glass-card rounded-2xl p-8 text-center scanline">
        <Trophy className={`w-16 h-16 mx-auto mb-4 ${perfect ? "text-warning animate-float" : "text-primary"}`} />
        <h3 className="font-display text-3xl font-bold text-gradient-cyber mb-2">
          {perfect ? "PERFECT RUN" : "QUIZ COMPLETE"}
        </h3>
        <div className="font-mono text-muted-foreground mb-6">
          Score: <span className="text-primary text-xl">{score}</span> / {QUESTIONS.length} · +50 XP bonus
        </div>
        <button onClick={restart} className="px-6 py-2.5 rounded-md bg-primary text-primary-foreground font-display font-bold uppercase tracking-wider inline-flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
          Question {idx + 1} / {QUESTIONS.length}
        </span>
        <span className="font-mono text-xs text-secondary">SCORE: {score}</span>
      </div>
      <div className="h-1 bg-muted rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500" style={{ width: `${((idx + 1) / QUESTIONS.length) * 100}%` }} />
      </div>

      <h3 className="font-display text-xl sm:text-2xl font-bold mb-6">{q.q}</h3>

      <div className="space-y-2.5">
        {q.options.map((opt, i) => {
          const isCorrect = picked !== null && i === q.correct;
          const isWrong = picked === i && i !== q.correct;
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={picked !== null}
              className={`w-full text-left p-4 rounded-lg border font-mono text-sm flex items-center gap-3 transition-all ${
                isCorrect ? "border-primary bg-primary/15 text-primary neon-text" :
                isWrong ? "border-destructive bg-destructive/15 text-destructive" :
                picked !== null ? "border-border bg-muted/20 opacity-50" :
                "border-border bg-muted/30 hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              <span className={`w-7 h-7 rounded-md flex items-center justify-center text-xs ${
                isCorrect ? "bg-primary text-background" : isWrong ? "bg-destructive text-white" : "bg-background border border-border"
              }`}>
                {isCorrect ? <Check className="w-4 h-4" /> : isWrong ? <X className="w-4 h-4" /> : String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{opt}</span>
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div className="mt-5 p-4 rounded-lg bg-muted/40 border border-border animate-fade-in">
          <div className="font-mono text-[10px] uppercase tracking-widest text-secondary mb-1">// explanation</div>
          <p className="text-sm text-muted-foreground">{q.explain}</p>
          <button
            onClick={next}
            className="mt-4 px-5 py-2 rounded-md bg-gradient-to-r from-primary to-secondary text-background font-display font-bold uppercase tracking-wider text-sm"
          >
            {idx === QUESTIONS.length - 1 ? "Finish" : "Next →"}
          </button>
        </div>
      )}
    </div>
  );
}
