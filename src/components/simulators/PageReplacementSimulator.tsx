import { useMemo, useState } from "react";
import { Play, RefreshCw } from "lucide-react";
import { useProgress } from "@/store/progress";

type Algo = "FIFO" | "LRU" | "OPTIMAL";

type Step = {
  ref: number;
  frames: (number | null)[];
  hit: boolean;
  evicted: number | null;
};

function simulate(refs: number[], frameCount: number, algo: Algo): Step[] {
  const frames: (number | null)[] = new Array(frameCount).fill(null);
  const fifoQueue: number[] = []; // page numbers in load order
  const lruOrder: number[] = []; // most recent at end
  const steps: Step[] = [];

  for (let i = 0; i < refs.length; i++) {
    const ref = refs[i];
    const slotIdx = frames.indexOf(ref);
    const hit = slotIdx !== -1;
    let evicted: number | null = null;

    if (hit) {
      if (algo === "LRU") {
        const idx = lruOrder.indexOf(ref);
        if (idx !== -1) lruOrder.splice(idx, 1);
        lruOrder.push(ref);
      }
    } else {
      const emptyIdx = frames.indexOf(null);
      if (emptyIdx !== -1) {
        frames[emptyIdx] = ref;
        fifoQueue.push(ref);
        lruOrder.push(ref);
      } else {
        let victim: number;
        if (algo === "FIFO") {
          victim = fifoQueue.shift()!;
          fifoQueue.push(ref);
        } else if (algo === "LRU") {
          victim = lruOrder.shift()!;
          lruOrder.push(ref);
        } else {
          // OPTIMAL: page used farthest in future or never
          let farthest = -1;
          let chosen = frames[0]!;
          for (const f of frames) {
            const next = refs.slice(i + 1).indexOf(f!);
            if (next === -1) { chosen = f!; break; }
            if (next > farthest) { farthest = next; chosen = f!; }
          }
          victim = chosen;
        }
        evicted = victim;
        const idx = frames.indexOf(victim);
        frames[idx] = ref;
      }
    }

    steps.push({ ref, frames: [...frames], hit, evicted });
  }
  return steps;
}

export function PageReplacementSimulator() {
  const { addXP, unlock } = useProgress();
  const [refStr, setRefStr] = useState("1, 2, 3, 4, 2, 1, 5, 6, 2, 1, 2, 3, 7, 6, 3, 2, 1, 2, 3, 6");
  const [frameCount, setFrameCount] = useState(3);
  const [algo, setAlgo] = useState<Algo>("FIFO");

  const refs = useMemo(() => refStr.split(",").map((s) => parseInt(s.trim())).filter((n) => !isNaN(n)), [refStr]);

  const steps = useMemo(() => simulate(refs, frameCount, algo), [refs, frameCount, algo]);
  const faults = steps.filter((s) => !s.hit).length;
  const hits = steps.length - faults;
  const faultRate = ((faults / steps.length) * 100).toFixed(1);

  const handleRun = () => {
    addXP(15);
    if (algo === "OPTIMAL") unlock("memory_wizard");
  };

  // Compare all
  const compare = useMemo(() => {
    return (["FIFO", "LRU", "OPTIMAL"] as Algo[]).map((a) => {
      const s = simulate(refs, frameCount, a);
      return { algo: a, faults: s.filter((x) => !x.hit).length };
    });
  }, [refs, frameCount]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-4 md:col-span-2">
          <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Reference String</label>
          <input
            value={refStr}
            onChange={(e) => setRefStr(e.target.value)}
            className="w-full mt-2 bg-input rounded-md px-3 py-2 font-mono text-sm border border-border focus:border-primary outline-none"
          />
        </div>
        <div className="glass-card rounded-xl p-4">
          <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Frames: <span className="text-primary">{frameCount}</span>
          </label>
          <input type="range" min={2} max={7} value={frameCount} onChange={(e) => setFrameCount(Number(e.target.value))} className="w-full accent-primary mt-3" />
        </div>
      </div>

      <div className="glass-card rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex gap-2">
            {(["FIFO", "LRU", "OPTIMAL"] as Algo[]).map((a) => (
              <button
                key={a}
                onClick={() => setAlgo(a)}
                className={`px-4 py-2 rounded-md font-mono text-xs uppercase tracking-wider border ${
                  algo === a ? "bg-secondary/20 border-secondary text-secondary cyan-text" : "border-border hover:border-secondary/50"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
          <button
            onClick={handleRun}
            className="px-5 py-2 rounded-md bg-gradient-to-r from-secondary to-accent text-background font-display font-bold uppercase tracking-wider flex items-center gap-2 hover:shadow-[0_0_30px_hsl(var(--secondary)/0.5)]"
          >
            <Play className="w-3.5 h-3.5 fill-background" /> Run +15 XP
          </button>
        </div>

        {/* Visualization */}
        <div className="overflow-x-auto pb-2">
          <div className="inline-flex flex-col gap-1 font-mono text-xs">
            <div className="flex gap-1">
              <div className="w-12 text-right pr-2 text-muted-foreground">REF</div>
              {steps.map((s, i) => (
                <div key={i} className="w-10 text-center text-muted-foreground">{s.ref}</div>
              ))}
            </div>
            {Array.from({ length: frameCount }).map((_, frameIdx) => (
              <div key={frameIdx} className="flex gap-1">
                <div className="w-12 text-right pr-2 text-muted-foreground">F{frameIdx}</div>
                {steps.map((s, i) => {
                  const val = s.frames[frameIdx];
                  const isNew = i === 0 ? val !== null : s.frames[frameIdx] !== steps[i - 1].frames[frameIdx];
                  const isHit = s.hit && val === s.ref;
                  return (
                    <div
                      key={i}
                      className={`w-10 h-10 flex items-center justify-center rounded border font-bold transition-all ${
                        val === null ? "border-border/30 text-muted-foreground/40" :
                        isHit ? "border-primary bg-primary/30 text-primary neon-text" :
                        isNew ? "border-accent bg-accent/20 text-accent" :
                        "border-border bg-muted/40"
                      }`}
                    >
                      {val ?? "·"}
                    </div>
                  );
                })}
              </div>
            ))}
            <div className="flex gap-1 mt-2">
              <div className="w-12 text-right pr-2 text-muted-foreground">RES</div>
              {steps.map((s, i) => (
                <div
                  key={i}
                  className={`w-10 text-center font-bold ${s.hit ? "text-primary" : "text-destructive"}`}
                >
                  {s.hit ? "H" : "F"}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-center">
            <div className="font-display text-2xl font-bold text-destructive">{faults}</div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Page Faults</div>
          </div>
          <div className="rounded-lg bg-primary/10 border border-primary/30 p-3 text-center">
            <div className="font-display text-2xl font-bold text-primary neon-text">{hits}</div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Hits</div>
          </div>
          <div className="rounded-lg bg-secondary/10 border border-secondary/30 p-3 text-center">
            <div className="font-display text-2xl font-bold text-secondary cyan-text">{faultRate}%</div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Fault Rate</div>
          </div>
        </div>
      </div>

      {/* Algorithm comparison */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="font-display font-bold uppercase tracking-wider text-accent pink-text mb-4">Comparison</h3>
        <div className="space-y-2">
          {compare.map((c) => {
            const max = Math.max(...compare.map((x) => x.faults));
            const w = (c.faults / max) * 100;
            return (
              <div key={c.algo} className="flex items-center gap-3">
                <div className="w-20 font-mono text-xs">{c.algo}</div>
                <div className="flex-1 h-6 bg-muted rounded-md overflow-hidden">
                  <div
                    className={`h-full flex items-center justify-end pr-2 font-mono text-xs font-bold transition-all duration-700 ${
                      c.faults === Math.min(...compare.map((x) => x.faults))
                        ? "bg-gradient-to-r from-primary to-primary-glow text-background"
                        : "bg-gradient-to-r from-muted-foreground/40 to-muted-foreground/20 text-foreground"
                    }`}
                    style={{ width: `${w}%` }}
                  >
                    {c.faults}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
