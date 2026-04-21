import { useMemo, useState } from "react";
import { Plus, Trash2, Play, RefreshCw } from "lucide-react";
import { useProgress } from "@/store/progress";

type Process = { id: string; arrival: number; burst: number; priority: number };
type Algo = "FCFS" | "SJF" | "RR" | "PRIORITY";

type Slice = { pid: string; start: number; end: number };

function scheduleFCFS(procs: Process[]): Slice[] {
  const sorted = [...procs].sort((a, b) => a.arrival - b.arrival);
  const slices: Slice[] = [];
  let t = 0;
  for (const p of sorted) {
    if (t < p.arrival) t = p.arrival;
    slices.push({ pid: p.id, start: t, end: t + p.burst });
    t += p.burst;
  }
  return slices;
}

function scheduleSJF(procs: Process[]): Slice[] {
  const remaining = procs.map((p) => ({ ...p, rem: p.burst, done: false }));
  const slices: Slice[] = [];
  let t = 0;
  while (remaining.some((p) => !p.done)) {
    const available = remaining.filter((p) => !p.done && p.arrival <= t);
    if (!available.length) {
      t++;
      continue;
    }
    available.sort((a, b) => a.burst - b.burst);
    const next = available[0];
    slices.push({ pid: next.id, start: t, end: t + next.burst });
    t += next.burst;
    next.done = true;
  }
  return slices;
}

function scheduleRR(procs: Process[], q: number): Slice[] {
  const remaining = procs.map((p) => ({ ...p, rem: p.burst }));
  const slices: Slice[] = [];
  const queue: typeof remaining = [];
  let t = 0;
  const arrived = new Set<string>();
  // initial
  remaining.filter((p) => p.arrival <= t).forEach((p) => { queue.push(p); arrived.add(p.id); });
  if (!queue.length && remaining.length) {
    t = Math.min(...remaining.map((p) => p.arrival));
    remaining.filter((p) => p.arrival <= t).forEach((p) => { queue.push(p); arrived.add(p.id); });
  }

  while (queue.length) {
    const cur = queue.shift()!;
    const run = Math.min(q, cur.rem);
    slices.push({ pid: cur.id, start: t, end: t + run });
    t += run;
    cur.rem -= run;
    // any new arrivals
    remaining
      .filter((p) => !arrived.has(p.id) && p.arrival <= t)
      .forEach((p) => { queue.push(p); arrived.add(p.id); });
    if (cur.rem > 0) queue.push(cur);
    if (!queue.length && remaining.some((p) => !arrived.has(p.id))) {
      const nextT = Math.min(...remaining.filter((p) => !arrived.has(p.id)).map((p) => p.arrival));
      t = nextT;
      remaining.filter((p) => !arrived.has(p.id) && p.arrival <= t).forEach((p) => { queue.push(p); arrived.add(p.id); });
    }
  }
  return mergeSlices(slices);
}

function schedulePriority(procs: Process[]): Slice[] {
  const remaining = procs.map((p) => ({ ...p, done: false }));
  const slices: Slice[] = [];
  let t = 0;
  while (remaining.some((p) => !p.done)) {
    const available = remaining.filter((p) => !p.done && p.arrival <= t);
    if (!available.length) { t++; continue; }
    available.sort((a, b) => a.priority - b.priority);
    const next = available[0];
    slices.push({ pid: next.id, start: t, end: t + next.burst });
    t += next.burst;
    next.done = true;
  }
  return slices;
}

function mergeSlices(slices: Slice[]): Slice[] {
  const out: Slice[] = [];
  for (const s of slices) {
    const last = out[out.length - 1];
    if (last && last.pid === s.pid && last.end === s.start) last.end = s.end;
    else out.push({ ...s });
  }
  return out;
}

function computeMetrics(procs: Process[], slices: Slice[]) {
  const completion: Record<string, number> = {};
  for (const s of slices) {
    if (!completion[s.pid] || s.end > completion[s.pid]) completion[s.pid] = s.end;
  }
  const rows = procs.map((p) => {
    const ct = completion[p.id] ?? 0;
    const tat = ct - p.arrival;
    const wt = tat - p.burst;
    return { id: p.id, ct, tat, wt };
  });
  const avgWT = rows.reduce((a, r) => a + r.wt, 0) / rows.length;
  const avgTAT = rows.reduce((a, r) => a + r.tat, 0) / rows.length;
  return { rows, avgWT, avgTAT };
}

const COLORS = [
  "bg-primary text-primary-foreground",
  "bg-secondary text-secondary-foreground",
  "bg-accent text-accent-foreground",
  "bg-warning text-background",
  "bg-purple-500 text-white",
  "bg-pink-400 text-white",
  "bg-cyan-400 text-background",
  "bg-orange-400 text-background",
];

export function SchedulingSimulator() {
  const { addXP, unlock } = useProgress();
  const [procs, setProcs] = useState<Process[]>([
    { id: "P1", arrival: 0, burst: 6, priority: 2 },
    { id: "P2", arrival: 1, burst: 3, priority: 1 },
    { id: "P3", arrival: 2, burst: 8, priority: 3 },
    { id: "P4", arrival: 3, burst: 4, priority: 2 },
  ]);
  const [algo, setAlgo] = useState<Algo>("FCFS");
  const [quantum, setQuantum] = useState(2);
  const [ranAlgos, setRanAlgos] = useState<Set<Algo>>(new Set());

  const slices = useMemo(() => {
    const merged =
      algo === "FCFS" ? scheduleFCFS(procs) :
      algo === "SJF" ? scheduleSJF(procs) :
      algo === "RR" ? scheduleRR(procs, quantum) :
      schedulePriority(procs);
    return mergeSlices(merged);
  }, [procs, algo, quantum]);

  const metrics = useMemo(() => computeMetrics(procs, slices), [procs, slices]);
  const totalTime = slices.reduce((m, s) => Math.max(m, s.end), 0);

  const colorFor = (pid: string) => {
    const idx = procs.findIndex((p) => p.id === pid);
    return COLORS[idx % COLORS.length];
  };

  const addProc = () => {
    const id = `P${procs.length + 1}`;
    setProcs([...procs, { id, arrival: 0, burst: 4, priority: 1 }]);
  };

  const updateProc = (i: number, field: keyof Process, val: any) => {
    const next = [...procs];
    (next[i] as any)[field] = field === "id" ? val : Number(val);
    setProcs(next);
  };

  const removeProc = (i: number) => setProcs(procs.filter((_, j) => j !== i));

  const handleRun = () => {
    addXP(20);
    const newSet = new Set(ranAlgos);
    newSet.add(algo);
    setRanAlgos(newSet);
    if (newSet.size === 4) unlock("scheduler");
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-[1fr_2fr] gap-6">
        {/* Process input */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold uppercase tracking-wider text-primary neon-text">Processes</h3>
            <button onClick={addProc} className="p-1.5 rounded-md bg-primary/20 hover:bg-primary/30 text-primary">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2 font-mono text-sm">
            <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 text-[10px] text-muted-foreground uppercase tracking-wider">
              <span>ID</span><span>AT</span><span>BT</span><span>PR</span><span></span>
            </div>
            {procs.map((p, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-center">
                <input
                  value={p.id}
                  onChange={(e) => updateProc(i, "id", e.target.value)}
                  className="bg-input rounded px-2 py-1 text-xs border border-border focus:border-primary outline-none w-full"
                />
                <input type="number" min={0} value={p.arrival} onChange={(e) => updateProc(i, "arrival", e.target.value)} className="bg-input rounded px-2 py-1 text-xs border border-border focus:border-primary outline-none w-full" />
                <input type="number" min={1} value={p.burst} onChange={(e) => updateProc(i, "burst", e.target.value)} className="bg-input rounded px-2 py-1 text-xs border border-border focus:border-primary outline-none w-full" />
                <input type="number" min={1} value={p.priority} onChange={(e) => updateProc(i, "priority", e.target.value)} className="bg-input rounded px-2 py-1 text-xs border border-border focus:border-primary outline-none w-full" />
                <button onClick={() => removeProc(i)} className="p-1 text-destructive hover:bg-destructive/20 rounded">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Algorithm controls */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="font-display font-bold uppercase tracking-wider text-secondary cyan-text mb-4">Algorithm</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {(["FCFS", "SJF", "RR", "PRIORITY"] as Algo[]).map((a) => (
              <button
                key={a}
                onClick={() => setAlgo(a)}
                className={`px-3 py-2.5 rounded-md font-mono text-xs uppercase tracking-wider border transition-all ${
                  algo === a
                    ? "bg-primary/20 border-primary text-primary neon-text"
                    : "border-border bg-muted/30 hover:border-primary/50"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
          {algo === "RR" && (
            <div className="mb-4">
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Time Quantum: {quantum}</label>
              <input type="range" min={1} max={8} value={quantum} onChange={(e) => setQuantum(Number(e.target.value))} className="w-full accent-primary mt-1" />
            </div>
          )}
          <button
            onClick={handleRun}
            className="w-full py-3 rounded-md bg-gradient-to-r from-primary to-secondary text-background font-display font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:shadow-[0_0_30px_hsl(var(--primary)/0.6)] transition-all"
          >
            <Play className="w-4 h-4 fill-background" /> Execute & Earn 20 XP
          </button>
          <div className="mt-3 text-[11px] font-mono text-muted-foreground text-center">
            Algorithms run: {ranAlgos.size}/4 (run all to unlock 🏆)
          </div>
        </div>
      </div>

      {/* Gantt chart */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="font-display font-bold uppercase tracking-wider text-accent pink-text mb-4">Gantt Chart</h3>
        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-max border border-border rounded-md overflow-hidden">
            {slices.map((s, i) => {
              const w = (s.end - s.start) * 50;
              return (
                <div
                  key={i}
                  className={`${colorFor(s.pid)} flex flex-col items-center justify-center border-r border-background/30 font-mono font-bold text-sm relative animate-scale-in`}
                  style={{ width: `${w}px`, height: "70px", animationDelay: `${i * 80}ms` }}
                >
                  {s.pid}
                  <span className="absolute -bottom-5 left-0 text-[10px] text-muted-foreground">{s.start}</span>
                  {i === slices.length - 1 && (
                    <span className="absolute -bottom-5 right-0 text-[10px] text-muted-foreground">{s.end}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Metric label="Total Time" value={totalTime} />
          <Metric label="Avg Wait" value={metrics.avgWT.toFixed(2)} />
          <Metric label="Avg TAT" value={metrics.avgTAT.toFixed(2)} />
          <Metric label="CPU Util" value="100%" />
        </div>

        {/* Per process metrics */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full font-mono text-xs">
            <thead>
              <tr className="text-muted-foreground uppercase tracking-wider border-b border-border">
                <th className="text-left py-2">Process</th>
                <th className="text-right">Completion</th>
                <th className="text-right">Turnaround</th>
                <th className="text-right">Waiting</th>
              </tr>
            </thead>
            <tbody>
              {metrics.rows.map((r) => (
                <tr key={r.id} className="border-b border-border/50">
                  <td className="py-2 text-primary">{r.id}</td>
                  <td className="text-right">{r.ct}</td>
                  <td className="text-right">{r.tat}</td>
                  <td className="text-right">{r.wt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-muted/40 border border-border p-3 text-center">
      <div className="font-display text-xl font-bold text-primary neon-text">{value}</div>
      <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{label}</div>
    </div>
  );
}
