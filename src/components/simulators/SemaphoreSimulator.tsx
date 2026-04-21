import { useEffect, useRef, useState } from "react";
import { Play, Pause, RefreshCw, Plus, Minus } from "lucide-react";
import { useProgress } from "@/store/progress";

const BUFFER_SIZE = 5;

type Item = { id: number };

export function SemaphoreSimulator() {
  const { addXP, unlock } = useProgress();
  const [buffer, setBuffer] = useState<Item[]>([]);
  const [empty, setEmpty] = useState(BUFFER_SIZE);
  const [full, setFull] = useState(0);
  const [mutex, setMutex] = useState(1);
  const [log, setLog] = useState<{ kind: "P" | "C" | "info"; msg: string }[]>([]);
  const [running, setRunning] = useState(false);
  const [pCount, setPCount] = useState(2);
  const [cCount, setCCount] = useState(2);
  const counter = useRef(0);
  const ranOnce = useRef(false);

  const addLog = (kind: "P" | "C" | "info", msg: string) => {
    setLog((l) => [{ kind, msg }, ...l].slice(0, 14));
  };

  const produce = () => {
    setBuffer((b) => {
      if (b.length >= BUFFER_SIZE) {
        addLog("P", "Producer BLOCKED — buffer full");
        return b;
      }
      counter.current += 1;
      const item = { id: counter.current };
      addLog("P", `Producer wait(empty)→${BUFFER_SIZE - b.length - 1} · put item ${item.id}`);
      setEmpty((e) => Math.max(0, e - 1));
      setFull((f) => f + 1);
      return [...b, item];
    });
  };

  const consume = () => {
    setBuffer((b) => {
      if (!b.length) {
        addLog("C", "Consumer BLOCKED — buffer empty");
        return b;
      }
      const item = b[0];
      addLog("C", `Consumer wait(full)→${b.length - 1} · take item ${item.id}`);
      setEmpty((e) => e + 1);
      setFull((f) => Math.max(0, f - 1));
      return b.slice(1);
    });
  };

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      // Random producer or consumer fires
      const total = pCount + cCount;
      const r = Math.random() * total;
      if (r < pCount) produce();
      else consume();
    }, 900);
    return () => clearInterval(interval);
  }, [running, pCount, cCount]);

  const reset = () => {
    setBuffer([]);
    setEmpty(BUFFER_SIZE);
    setFull(0);
    setMutex(1);
    setLog([]);
    counter.current = 0;
    setRunning(false);
  };

  const toggle = () => {
    if (!running && !ranOnce.current) {
      addXP(25);
      unlock("sync_guru");
      ranOnce.current = true;
    }
    setRunning((r) => !r);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <SemBox label="empty" value={empty} max={BUFFER_SIZE} color="primary" />
        <SemBox label="full" value={full} max={BUFFER_SIZE} color="secondary" />
        <SemBox label="mutex" value={mutex} max={1} color="accent" />
      </div>

      {/* Buffer visualization */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold uppercase tracking-wider text-secondary cyan-text">Bounded Buffer</h3>
          <span className="font-mono text-xs text-muted-foreground">capacity = {BUFFER_SIZE}</span>
        </div>
        <div className="flex justify-center gap-3 py-6">
          {Array.from({ length: BUFFER_SIZE }).map((_, i) => {
            const item = buffer[i];
            return (
              <div
                key={i}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 flex items-center justify-center font-mono font-bold text-lg transition-all ${
                  item
                    ? "border-primary bg-primary/20 text-primary neon-text animate-scale-in"
                    : "border-dashed border-border text-muted-foreground/30"
                }`}
              >
                {item ? `#${item.id}` : "·"}
              </div>
            );
          })}
        </div>
        <div className="flex justify-center gap-8 mt-4 font-mono text-xs">
          <div className="flex items-center gap-2 text-primary">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" /> {pCount} Producer{pCount > 1 ? "s" : ""}
          </div>
          <div className="flex items-center gap-2 text-accent">
            <div className="w-3 h-3 rounded-full bg-accent animate-pulse" /> {cCount} Consumer{cCount > 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="glass-card rounded-xl p-5 grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Counter label="Producers" value={pCount} onChange={setPCount} />
          <Counter label="Consumers" value={cCount} onChange={setCCount} />
        </div>
        <div className="flex flex-col justify-center gap-2">
          <button
            onClick={toggle}
            className="py-3 rounded-md bg-gradient-to-r from-primary to-secondary text-background font-display font-bold uppercase tracking-widest flex items-center justify-center gap-2"
          >
            {running ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4 fill-background" /> Start +25 XP</>}
          </button>
          <button
            onClick={reset}
            className="py-2 rounded-md border border-border font-mono text-xs uppercase tracking-wider hover:border-primary/50 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset
          </button>
          <div className="flex gap-2">
            <button onClick={produce} className="flex-1 py-2 rounded-md bg-primary/15 text-primary font-mono text-xs uppercase border border-primary/40">
              Step Producer
            </button>
            <button onClick={consume} className="flex-1 py-2 rounded-md bg-accent/15 text-accent font-mono text-xs uppercase border border-accent/40">
              Step Consumer
            </button>
          </div>
        </div>
      </div>

      {/* Log */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="font-display font-bold uppercase tracking-wider text-warning mb-3">Event Log</h3>
        <div className="font-mono text-xs space-y-1 max-h-64 overflow-y-auto">
          {log.length === 0 && <div className="text-muted-foreground">// waiting for events...</div>}
          {log.map((l, i) => (
            <div
              key={i}
              className={`flex gap-2 animate-slide-in-right ${
                l.kind === "P" ? "text-primary" : l.kind === "C" ? "text-accent" : "text-muted-foreground"
              }`}
            >
              <span className="opacity-60">[{String(log.length - i).padStart(2, "0")}]</span>
              <span>{l.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SemBox({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const colorMap: Record<string, string> = {
    primary: "border-primary/40 text-primary",
    secondary: "border-secondary/40 text-secondary",
    accent: "border-accent/40 text-accent",
  };
  return (
    <div className={`glass-card rounded-xl p-4 border ${colorMap[color]}`}>
      <div className="flex items-baseline justify-between">
        <div className="font-mono text-xs uppercase tracking-widest opacity-70">sem_{label}</div>
        <div className="font-display font-bold text-3xl">{value}</div>
      </div>
      <div className="h-1.5 mt-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            color === "primary" ? "bg-primary" : color === "secondary" ? "bg-secondary" : "bg-accent"
          }`}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    </div>
  );
}

function Counter({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-md bg-muted/40 border border-border">
      <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <button onClick={() => onChange(Math.max(1, value - 1))} className="w-7 h-7 rounded bg-background border border-border hover:border-primary/50 flex items-center justify-center">
          <Minus className="w-3 h-3" />
        </button>
        <span className="font-mono font-bold w-6 text-center">{value}</span>
        <button onClick={() => onChange(Math.min(5, value + 1))} className="w-7 h-7 rounded bg-background border border-border hover:border-primary/50 flex items-center justify-center">
          <Plus className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
