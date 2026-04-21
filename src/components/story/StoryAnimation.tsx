import { useEffect, useRef, useState } from "react";

/**
 * StoryAnimation
 * A reusable, frame-based SVG animator that plays one of many built-in
 * scenes by name. Each scene is a small choreography hand-built with SVG
 * and CSS transforms driven by a `t` value (0 → 1) on a loop.
 */

type Props = {
  name: string;
  /** loop duration in ms (default 6s) */
  duration?: number;
  /** auto-play (default true) */
  playing?: boolean;
};

export function StoryAnimation({ name, duration = 6000, playing = true }: Props) {
  const [t, setT] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!playing) return;
    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = (now - startRef.current) % duration;
      setT(elapsed / duration);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startRef.current = null;
    };
  }, [playing, duration]);

  return (
    <div className="relative w-full aspect-[16/9] rounded-xl border border-primary/30 bg-gradient-to-br from-card via-background to-card overflow-hidden grid-bg">
      <div className="absolute inset-0 pointer-events-none scanline" />
      <svg viewBox="0 0 800 450" className="relative w-full h-full">
        <Scene name={name} t={t} />
      </svg>
      <div className="absolute bottom-2 right-3 font-mono text-[10px] text-primary/60 uppercase tracking-widest">
        scene · {name}
      </div>
    </div>
  );
}

/* ------------------------------- helpers -------------------------------- */
const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
const easeInOut = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
const seg = (t: number, from: number, to: number) => {
  if (t <= from) return 0;
  if (t >= to) return 1;
  return easeInOut((t - from) / (to - from));
};

/* ------------------------------- scenes --------------------------------- */
function Scene({ name, t }: { name: string; t: number }) {
  switch (name) {
    case "chaos-without-os": return <ChaosScene t={t} />;
    case "os-manager": return <ManagerScene t={t} />;
    case "os-responsibilities": return <ResponsibilitiesScene t={t} />;
    case "hardware-tour": return <HardwareTourScene t={t} />;
    case "program-vs-process": return <ProgramVsProcessScene t={t} />;
    case "process-states": return <ProcessStatesScene t={t} />;
    case "context-switch": return <ContextSwitchScene t={t} />;
    case "fcfs-vs-sjf": return <FcfsSjfScene t={t} />;
    case "round-robin": return <RoundRobinScene t={t} />;
    case "memory-grid": return <MemoryGridScene t={t} />;
    case "fixed-vs-variable": return <FixedVsVariableScene t={t} />;
    case "paging-translate": return <PagingScene t={t} />;
    case "virtual-memory": return <VirtualMemoryScene t={t} />;
    case "page-fault": return <PageFaultScene t={t} />;
    case "race-condition": return <RaceScene t={t} />;
    case "lock-and-key": return <LockKeyScene t={t} />;
    case "semaphore-parking": return <ParkingScene t={t} />;
    case "producer-consumer": return <ProducerConsumerScene t={t} />;
    case "deadlock-bridge": return <DeadlockBridgeScene t={t} />;
    case "disk-seek": return <DiskScene t={t} />;
    case "file-tree": return <FileTreeScene t={t} />;
    case "permissions": return <PermsScene t={t} />;
    default: return <FallbackScene name={name} />;
  }
}

function FallbackScene({ name }: { name: string }) {
  return (
    <text x="400" y="225" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontFamily="JetBrains Mono" fontSize="14">
      [animation: {name}]
    </text>
  );
}

/* ============================== SCENES ================================== */

function ChaosScene({ t }: { t: number }) {
  // 3 apps shoot arrows at hardware → chaos. Then we morph to "needs OS"
  const shake = Math.sin(t * Math.PI * 16) * (3 + 8 * Math.sin(t * Math.PI));
  const apps = [
    { x: 100, y: 80, label: "App A", color: "hsl(var(--primary))" },
    { x: 100, y: 200, label: "App B", color: "hsl(var(--secondary))" },
    { x: 100, y: 320, label: "App C", color: "hsl(var(--accent))" },
  ];
  const hw = [
    { x: 600, y: 80, label: "CPU" },
    { x: 600, y: 200, label: "RAM" },
    { x: 600, y: 320, label: "DISK" },
  ];
  return (
    <g transform={`translate(${shake},0)`}>
      {apps.map((a, i) => (
        <g key={i}>
          <rect x={a.x - 50} y={a.y - 25} width={120} height={50} rx={8} fill={a.color} opacity={0.18} stroke={a.color} />
          <text x={a.x + 10} y={a.y + 5} fill={a.color} fontFamily="Space Grotesk" fontWeight={700} fontSize={16}>{a.label}</text>
        </g>
      ))}
      {hw.map((h, i) => (
        <g key={i}>
          <rect x={h.x - 50} y={h.y - 25} width={120} height={50} rx={6} fill="hsl(var(--muted))" stroke="hsl(var(--border))" />
          <text x={h.x + 10} y={h.y + 5} fill="hsl(var(--foreground))" fontFamily="JetBrains Mono" fontSize={14} textAnchor="middle">{h.label}</text>
        </g>
      ))}
      {/* tangled arrows */}
      {apps.map((a, i) =>
        hw.map((h, j) => {
          const phase = (t + (i * 0.3 + j * 0.2)) % 1;
          const op = 0.25 + 0.6 * Math.abs(Math.sin(phase * Math.PI * 2));
          return (
            <line
              key={`${i}-${j}`}
              x1={a.x + 75} y1={a.y}
              x2={h.x - 50} y2={h.y}
              stroke={a.color}
              strokeWidth={1.5}
              opacity={op}
              strokeDasharray="4 6"
            />
          );
        })
      )}
      {/* chaos sparks */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2 + t * Math.PI * 2;
        const r = 30 + 20 * Math.sin(t * Math.PI * 4 + i);
        return (
          <circle key={i} cx={400 + Math.cos(a) * r} cy={225 + Math.sin(a) * r} r={3} fill="hsl(var(--destructive))" opacity={0.6} />
        );
      })}
      <text x={400} y={235} textAnchor="middle" fontFamily="Space Grotesk" fontWeight={700} fontSize={28} fill="hsl(var(--destructive))">CHAOS</text>
      <text x={400} y={260} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={11} fill="hsl(var(--muted-foreground))">// no traffic cop · everyone fights</text>
    </g>
  );
}

function ManagerScene({ t }: { t: number }) {
  const apps = [
    { y: 80, label: "App A", color: "hsl(var(--primary))" },
    { y: 200, label: "App B", color: "hsl(var(--secondary))" },
    { y: 320, label: "App C", color: "hsl(var(--accent))" },
  ];
  const hw = [
    { y: 80, label: "CPU" },
    { y: 200, label: "RAM" },
    { y: 320, label: "DISK" },
  ];
  // active app cycles
  const active = Math.floor(t * 3) % 3;
  return (
    <g>
      {apps.map((a, i) => (
        <g key={i} opacity={i === active ? 1 : 0.5}>
          <rect x={50} y={a.y - 25} width={120} height={50} rx={8} fill={a.color} opacity={0.2} stroke={a.color} />
          <text x={110} y={a.y + 5} fill={a.color} fontFamily="Space Grotesk" fontWeight={700} fontSize={16} textAnchor="middle">{a.label}</text>
        </g>
      ))}
      {/* OS manager box */}
      <rect x={320} y={150} width={160} height={150} rx={14} fill="hsl(var(--primary)/0.12)" stroke="hsl(var(--primary))" strokeWidth={2} />
      <text x={400} y={210} textAnchor="middle" fontFamily="Space Grotesk" fontWeight={800} fontSize={22} fill="hsl(var(--primary))">OS</text>
      <text x={400} y={235} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={11} fill="hsl(var(--muted-foreground))">manager</text>
      <text x={400} y={270} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={10} fill="hsl(var(--secondary))">syscall</text>
      {/* arrow from active app → OS */}
      <line x1={170} y1={apps[active].y} x2={320} y2={225} stroke={apps[active].color} strokeWidth={2.5} markerEnd="url(#arrow)" />
      {/* OS dispatches to one hardware */}
      {hw.map((h, i) => (
        <g key={i} opacity={i === active ? 1 : 0.4}>
          <rect x={620} y={h.y - 25} width={120} height={50} rx={6} fill="hsl(var(--muted))" stroke={i === active ? "hsl(var(--primary))" : "hsl(var(--border))"} strokeWidth={i === active ? 2 : 1} />
          <text x={680} y={h.y + 5} fill="hsl(var(--foreground))" fontFamily="JetBrains Mono" fontSize={14} textAnchor="middle">{h.label}</text>
        </g>
      ))}
      <line x1={480} y1={225} x2={620} y2={hw[active].y} stroke="hsl(var(--primary))" strokeWidth={2.5} markerEnd="url(#arrow)" />
      <defs>
        <marker id="arrow" markerWidth={10} markerHeight={10} refX={8} refY={5} orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="hsl(var(--primary))" />
        </marker>
      </defs>
    </g>
  );
}

function ResponsibilitiesScene({ t }: { t: number }) {
  const items = [
    { label: "Process", icon: "⚡", color: "hsl(var(--primary))" },
    { label: "Memory", icon: "🧠", color: "hsl(var(--secondary))" },
    { label: "Files / I/O", icon: "🗄️", color: "hsl(var(--accent))" },
    { label: "Security", icon: "🔒", color: "hsl(var(--warning))" },
  ];
  return (
    <g>
      <circle cx={400} cy={225} r={50} fill="hsl(var(--primary)/0.15)" stroke="hsl(var(--primary))" strokeWidth={2} />
      <text x={400} y={230} textAnchor="middle" fontFamily="Space Grotesk" fontWeight={800} fontSize={22} fill="hsl(var(--primary))">OS</text>
      {items.map((it, i) => {
        const a = (i / items.length) * Math.PI * 2 + t * Math.PI * 0.5;
        const r = 150;
        const x = 400 + Math.cos(a) * r;
        const y = 225 + Math.sin(a) * r;
        const pulse = 1 + 0.08 * Math.sin(t * Math.PI * 4 + i);
        return (
          <g key={i} transform={`translate(${x},${y}) scale(${pulse})`}>
            <circle r={42} fill={it.color} opacity={0.18} stroke={it.color} strokeWidth={1.5} />
            <text textAnchor="middle" y={-4} fontSize={22}>{it.icon}</text>
            <text textAnchor="middle" y={20} fontFamily="JetBrains Mono" fontSize={11} fill={it.color}>{it.label}</text>
            <line x1={-Math.cos(a) * 42} y1={-Math.sin(a) * 42} x2={-Math.cos(a) * (r - 50)} y2={-Math.sin(a) * (r - 50)} stroke={it.color} strokeOpacity={0.4} strokeDasharray="3 4" />
          </g>
        );
      })}
    </g>
  );
}

function HardwareTourScene({ t }: { t: number }) {
  // a packet travels: keyboard → CPU → RAM → DISK → monitor
  const stops = [
    { x: 80, y: 360, label: "⌨️ Keyboard" },
    { x: 240, y: 100, label: "🧠 CPU" },
    { x: 440, y: 100, label: "🪑 RAM" },
    { x: 640, y: 100, label: "🗄️ Disk" },
    { x: 720, y: 360, label: "🖥️ Monitor" },
  ];
  const seg2 = stops.length - 1;
  const phase = t * seg2;
  const i = Math.min(seg2 - 1, Math.floor(phase));
  const f = phase - i;
  const x = lerp(stops[i].x, stops[i + 1].x, easeInOut(f));
  const y = lerp(stops[i].y, stops[i + 1].y, easeInOut(f));
  return (
    <g>
      {stops.map((s, idx) => (
        <g key={idx}>
          <rect x={s.x - 60} y={s.y - 25} width={120} height={50} rx={8} fill="hsl(var(--card))" stroke="hsl(var(--border))" />
          <text x={s.x} y={s.y + 6} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={14} fill="hsl(var(--foreground))">{s.label}</text>
        </g>
      ))}
      {stops.slice(0, -1).map((s, idx) => (
        <line key={idx} x1={s.x} y1={s.y} x2={stops[idx + 1].x} y2={stops[idx + 1].y} stroke="hsl(var(--primary)/0.4)" strokeWidth={1.5} strokeDasharray="4 4" />
      ))}
      <circle cx={x} cy={y} r={9} fill="hsl(var(--primary))">
        <animate attributeName="r" values="8;12;8" dur="0.8s" repeatCount="indefinite" />
      </circle>
      <circle cx={x} cy={y} r={18} fill="hsl(var(--primary)/0.25)" />
    </g>
  );
}

function ProgramVsProcessScene({ t }: { t: number }) {
  // file icon spawns multiple running processes
  const spawned = Math.min(4, Math.floor(t * 5));
  return (
    <g>
      <g transform="translate(120,225)">
        <rect x={-50} y={-65} width={100} height={130} rx={6} fill="hsl(var(--card))" stroke="hsl(var(--secondary))" strokeWidth={2} />
        <text x={0} y={-30} textAnchor="middle" fontSize={28}>📄</text>
        <text x={0} y={5} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={12} fill="hsl(var(--secondary))">word.exe</text>
        <text x={0} y={25} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={9} fill="hsl(var(--muted-foreground))">PROGRAM</text>
        <text x={0} y={50} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={9} fill="hsl(var(--muted-foreground))">(on disk)</text>
      </g>
      <text x={250} y={230} textAnchor="middle" fontFamily="Space Grotesk" fontWeight={700} fontSize={32} fill="hsl(var(--primary))">→</text>
      {/* processes */}
      {[0, 1, 2, 3].map((i) => {
        const visible = i < spawned;
        const x = 380 + (i % 2) * 180;
        const y = 130 + Math.floor(i / 2) * 180;
        const sc = visible ? 1 : 0.3;
        return (
          <g key={i} transform={`translate(${x},${y}) scale(${sc})`} opacity={visible ? 1 : 0.2} style={{ transition: "all .4s" }}>
            <rect x={-65} y={-50} width={130} height={100} rx={8} fill="hsl(var(--primary)/0.15)" stroke="hsl(var(--primary))" />
            <text x={0} y={-25} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={10} fill="hsl(var(--muted-foreground))">PID {1000 + i}</text>
            <text x={0} y={0} textAnchor="middle" fontFamily="Space Grotesk" fontWeight={700} fontSize={16} fill="hsl(var(--primary))">Word #{i + 1}</text>
            <text x={0} y={22} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={9} fill="hsl(var(--secondary))">PROCESS</text>
            <circle cx={50} cy={-35} r={4} fill="hsl(var(--success))">
              <animate attributeName="opacity" values="1;0.3;1" dur="1.2s" repeatCount="indefinite" />
            </circle>
          </g>
        );
      })}
    </g>
  );
}

function ProcessStatesScene({ t }: { t: number }) {
  const states = [
    { id: "new", x: 100, y: 100, label: "NEW" },
    { id: "ready", x: 280, y: 100, label: "READY" },
    { id: "run", x: 460, y: 100, label: "RUNNING" },
    { id: "wait", x: 460, y: 320, label: "WAITING" },
    { id: "term", x: 680, y: 100, label: "TERMINATED" },
  ];
  // bouncing through states
  const order = [0, 1, 2, 3, 1, 2, 4];
  const idx = Math.floor(t * order.length) % order.length;
  const cur = states[order[idx]];
  const next = states[order[(idx + 1) % order.length]];
  const localT = (t * order.length) % 1;
  const ballX = lerp(cur.x, next.x, easeInOut(localT));
  const ballY = lerp(cur.y, next.y, easeInOut(localT));
  return (
    <g>
      {states.map((s) => (
        <g key={s.id}>
          <circle cx={s.x} cy={s.y} r={45} fill="hsl(var(--card))" stroke="hsl(var(--primary)/0.5)" strokeWidth={2} />
          <text x={s.x} y={s.y + 5} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={11} fill="hsl(var(--foreground))">{s.label}</text>
        </g>
      ))}
      {/* arrows */}
      <Arrow x1={145} y1={100} x2={235} y2={100} />
      <Arrow x1={325} y1={100} x2={415} y2={100} />
      <Arrow x1={460} y1={145} x2={460} y2={275} />
      <Arrow x1={420} y1={310} x2={325} y2={140} />
      <Arrow x1={505} y1={100} x2={635} y2={100} />
      {/* moving ball = current process */}
      <circle cx={ballX} cy={ballY} r={12} fill="hsl(var(--accent))" opacity={0.9}>
        <animate attributeName="r" values="10;14;10" dur="0.6s" repeatCount="indefinite" />
      </circle>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="hsl(var(--secondary))" strokeWidth={1.5} markerEnd="url(#arrow2)" strokeDasharray="4 3" />;
}

function ContextSwitchScene({ t }: { t: number }) {
  // CPU box, two PCBs swap
  const phase = (t * 2) % 1;
  const onA = phase < 0.5;
  const swap = phase < 0.5 ? phase * 2 : (phase - 0.5) * 2;
  return (
    <g>
      <defs>
        <marker id="arrow2" markerWidth={10} markerHeight={10} refX={8} refY={5} orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="hsl(var(--secondary))" />
        </marker>
      </defs>
      <rect x={320} y={150} width={160} height={150} rx={10} fill="hsl(var(--primary)/0.12)" stroke="hsl(var(--primary))" strokeWidth={2} />
      <text x={400} y={195} textAnchor="middle" fontFamily="Space Grotesk" fontWeight={800} fontSize={26} fill="hsl(var(--primary))">CPU</text>
      <text x={400} y={225} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={11} fill="hsl(var(--muted-foreground))">running...</text>
      <text x={400} y={270} textAnchor="middle" fontFamily="Space Grotesk" fontWeight={700} fontSize={20} fill={onA ? "hsl(var(--secondary))" : "hsl(var(--accent))"}>
        {onA ? "PROCESS A" : "PROCESS B"}
      </text>
      {/* PCBs */}
      <PCB x={100} y={225} label="PCB A" color="hsl(var(--secondary))" active={onA} pulse={onA ? 1 - swap : swap} />
      <PCB x={700} y={225} label="PCB B" color="hsl(var(--accent))" active={!onA} pulse={onA ? swap : 1 - swap} />
      {/* arrows showing save/restore */}
      <text x={400} y={395} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={11} fill="hsl(var(--muted-foreground))">
        save state → load state → resume — repeat thousands of times per second
      </text>
    </g>
  );
}

function PCB({ x, y, label, color, active, pulse }: { x: number; y: number; label: string; color: string; active: boolean; pulse: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-60} y={-60} width={120} height={120} rx={8} fill="hsl(var(--card))" stroke={color} strokeWidth={active ? 2.5 : 1.5} opacity={0.6 + 0.4 * pulse} />
      <text x={0} y={-30} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={11} fill={color}>{label}</text>
      <text x={0} y={-5} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={9} fill="hsl(var(--muted-foreground))">PC: 0x{(1234 + pulse * 99).toFixed(0)}</text>
      <text x={0} y={12} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={9} fill="hsl(var(--muted-foreground))">SP: 0x{(7777 + pulse * 32).toFixed(0)}</text>
      <text x={0} y={29} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={9} fill="hsl(var(--muted-foreground))">regs: 8</text>
      <text x={0} y={48} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={9} fill={active ? "hsl(var(--success))" : "hsl(var(--muted-foreground))"}>
        {active ? "● RUNNING" : "○ READY"}
      </text>
    </g>
  );
}

function FcfsSjfScene({ t }: { t: number }) {
  // Two gantt charts: FCFS [A=10,B=1,C=1] vs SJF [B,C,A]
  const total = 12;
  const cursor = t * total;
  return (
    <g>
      <text x={400} y={30} textAnchor="middle" fontFamily="Space Grotesk" fontWeight={700} fontSize={18} fill="hsl(var(--foreground))">
        Same 3 jobs, different order
      </text>
      {/* FCFS row */}
      <text x={40} y={130} fontFamily="JetBrains Mono" fontSize={12} fill="hsl(var(--muted-foreground))">FCFS</text>
      <GanttBar x={40} y={150} w={500 * 10 / 12} color="hsl(var(--primary))" label="A (10ms)" cursor={cursor < 10 ? cursor / 12 : 1} />
      <GanttBar x={40 + 500 * 10 / 12} y={150} w={500 * 1 / 12} color="hsl(var(--secondary))" label="B" cursor={cursor < 10 ? 0 : cursor < 11 ? (cursor - 10) : 1} />
      <GanttBar x={40 + 500 * 11 / 12} y={150} w={500 * 1 / 12} color="hsl(var(--accent))" label="C" cursor={cursor < 11 ? 0 : (cursor - 11)} />
      <text x={40} y={210} fontFamily="JetBrains Mono" fontSize={11} fill="hsl(var(--destructive))">avg wait ≈ 7.0 ms</text>
      {/* SJF row */}
      <text x={40} y={290} fontFamily="JetBrains Mono" fontSize={12} fill="hsl(var(--muted-foreground))">SJF</text>
      <GanttBar x={40} y={310} w={500 * 1 / 12} color="hsl(var(--secondary))" label="B" cursor={cursor < 1 ? cursor : 1} />
      <GanttBar x={40 + 500 / 12} y={310} w={500 / 12} color="hsl(var(--accent))" label="C" cursor={cursor < 1 ? 0 : cursor < 2 ? cursor - 1 : 1} />
      <GanttBar x={40 + 500 * 2 / 12} y={310} w={500 * 10 / 12} color="hsl(var(--primary))" label="A (10ms)" cursor={cursor < 2 ? 0 : (cursor - 2) / 10} />
      <text x={40} y={370} fontFamily="JetBrains Mono" fontSize={11} fill="hsl(var(--success))">avg wait ≈ 1.0 ms ✓</text>
      {/* time axis */}
      <line x1={40} y1={400} x2={540} y2={400} stroke="hsl(var(--border))" />
      {Array.from({ length: 13 }).map((_, i) => (
        <text key={i} x={40 + (500 * i) / 12} y={418} fontSize={10} fontFamily="JetBrains Mono" fill="hsl(var(--muted-foreground))" textAnchor="middle">{i}</text>
      ))}
    </g>
  );
}

function GanttBar({ x, y, w, color, label, cursor }: { x: number; y: number; w: number; color: string; label: string; cursor: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={40} rx={4} fill={color} opacity={0.18} stroke={color} />
      <rect x={x} y={y} width={w * Math.max(0, Math.min(1, cursor))} height={40} rx={4} fill={color} opacity={0.6} />
      <text x={x + w / 2} y={y + 25} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={11} fill="hsl(var(--foreground))">{label}</text>
    </g>
  );
}

function RoundRobinScene({ t }: { t: number }) {
  const procs = ["A", "B", "C", "A", "B", "C"];
  const colors = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))"];
  const slot = 500 / procs.length;
  const cursor = t * procs.length;
  return (
    <g>
      <text x={400} y={50} textAnchor="middle" fontFamily="Space Grotesk" fontWeight={700} fontSize={18} fill="hsl(var(--foreground))">Round Robin · quantum = 5ms</text>
      {procs.map((p, i) => {
        const c = colors["ABC".indexOf(p)];
        const filled = Math.max(0, Math.min(1, cursor - i));
        return (
          <g key={i}>
            <rect x={150 + i * slot} y={170} width={slot - 4} height={60} rx={5} fill={c} opacity={0.15} stroke={c} />
            <rect x={150 + i * slot} y={170} width={(slot - 4) * filled} height={60} rx={5} fill={c} opacity={0.6} />
            <text x={150 + i * slot + (slot - 4) / 2} y={205} textAnchor="middle" fontFamily="Space Grotesk" fontWeight={700} fontSize={20} fill="hsl(var(--foreground))">{p}</text>
          </g>
        );
      })}
      <text x={400} y={290} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={11} fill="hsl(var(--muted-foreground))">
        Each process gets a slice. Then preempted. Rotated. Repeated.
      </text>
      {/* circular indicator */}
      <g transform="translate(400,360)">
        {[0, 1, 2].map((i) => {
          const a = (i / 3) * Math.PI * 2 + t * Math.PI * 2;
          return (
            <circle key={i} cx={Math.cos(a) * 30} cy={Math.sin(a) * 30} r={8} fill={colors[i]} />
          );
        })}
      </g>
    </g>
  );
}

function MemoryGridScene({ t }: { t: number }) {
  const cols = 16;
  const rows = 8;
  const cell = 28;
  const startX = 70;
  const startY = 80;
  // fill cells over time
  const filled = Math.floor(t * cols * rows * 1.2);
  return (
    <g>
      <text x={startX} y={50} fontFamily="JetBrains Mono" fontSize={12} fill="hsl(var(--muted-foreground))">RAM · each box = 1 byte · address shown</text>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const idx = r * cols + c;
          const isFilled = idx < filled;
          const colorIdx = Math.floor(idx / 18) % 3;
          const colors = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))"];
          return (
            <rect
              key={`${r}-${c}`}
              x={startX + c * cell}
              y={startY + r * cell}
              width={cell - 2}
              height={cell - 2}
              rx={3}
              fill={isFilled ? colors[colorIdx] : "hsl(var(--muted))"}
              opacity={isFilled ? 0.6 : 0.3}
              stroke="hsl(var(--border))"
            />
          );
        })
      )}
      <text x={400} y={400} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={11} fill="hsl(var(--muted-foreground))">
        Address 0 → 127 · programs claim contiguous ranges
      </text>
    </g>
  );
}

function FixedVsVariableScene({ t }: { t: number }) {
  const w = 320;
  const h = 50;
  return (
    <g>
      <text x={180} y={80} textAnchor="middle" fontFamily="Space Grotesk" fontWeight={700} fontSize={14} fill="hsl(var(--foreground))">FIXED (MFT)</text>
      <text x={620} y={80} textAnchor="middle" fontFamily="Space Grotesk" fontWeight={700} fontSize={14} fill="hsl(var(--foreground))">VARIABLE (MVT)</text>
      {/* Fixed partitions */}
      <g transform="translate(20,110)">
        {[
          { size: 64, name: "P1" },
          { size: 128, name: "P2" },
          { size: 256, name: "P3" },
          { size: 512, name: "P4" },
        ].map((p, i) => {
          const partW = (p.size / 960) * w;
          const used = Math.min(p.size - 8, p.size * (0.3 + 0.5 * Math.sin(t * Math.PI * 2 + i)));
          const usedW = (used / 960) * w;
          const x = [0, 64, 192, 448].map((s) => (s / 960) * w)[i];
          return (
            <g key={i}>
              <rect x={x} y={0} width={partW - 2} height={h} rx={4} fill="hsl(var(--muted))" stroke="hsl(var(--border))" />
              <rect x={x} y={0} width={usedW} height={h} rx={4} fill="hsl(var(--secondary))" opacity={0.5} />
              <text x={x + 4} y={14} fontFamily="JetBrains Mono" fontSize={9} fill="hsl(var(--secondary))">{p.name}</text>
              <text x={x + partW - 4} y={h - 4} textAnchor="end" fontFamily="JetBrains Mono" fontSize={9} fill="hsl(var(--destructive))">internal</text>
            </g>
          );
        })}
      </g>
      <text x={180} y={200} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={11} fill="hsl(var(--destructive))">internal fragmentation = unused space INSIDE each slot</text>
      {/* Variable */}
      <g transform="translate(460,110)">
        {(() => {
          const blocks = [
            { size: 0.18, name: "A", filled: true },
            { size: 0.08, name: "", filled: false },
            { size: 0.22, name: "B", filled: true },
            { size: 0.06, name: "", filled: false },
            { size: 0.15, name: "C", filled: true },
            { size: 0.10, name: "", filled: false },
            { size: 0.21, name: "D", filled: true },
          ];
          let acc = 0;
          return blocks.map((b, i) => {
            const x = acc * w;
            const ww = b.size * w;
            acc += b.size;
            const wob = b.filled ? 0 : Math.sin(t * Math.PI * 2 + i) * 1.5;
            return (
              <g key={i}>
                <rect x={x} y={0} width={ww - 1} height={h} rx={4} fill={b.filled ? "hsl(var(--accent))" : "hsl(var(--destructive))"} opacity={b.filled ? 0.5 : 0.25 + 0.15 * Math.abs(wob)} stroke={b.filled ? "hsl(var(--accent))" : "hsl(var(--destructive))"} strokeDasharray={b.filled ? undefined : "3 2"} />
                {b.name && <text x={x + ww / 2} y={32} textAnchor="middle" fontFamily="Space Grotesk" fontWeight={700} fontSize={14} fill="hsl(var(--foreground))">{b.name}</text>}
                {!b.name && <text x={x + ww / 2} y={32} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={9} fill="hsl(var(--destructive))">gap</text>}
              </g>
            );
          });
        })()}
      </g>
      <text x={620} y={200} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={11} fill="hsl(var(--destructive))">external fragmentation = scattered free gaps</text>
      <text x={400} y={300} textAnchor="middle" fontFamily="Space Grotesk" fontWeight={700} fontSize={18} fill="hsl(var(--primary))">Both waste memory — just differently.</text>
      <text x={400} y={330} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={11} fill="hsl(var(--muted-foreground))">Solution: paging breaks memory into fixed pages — best of both</text>
    </g>
  );
}

function PagingScene({ t }: { t: number }) {
  // virtual page → page table → physical frame
  const va = Math.floor(t * 4) % 4;
  const mapping = [3, 1, 0, 2];
  const pa = mapping[va];
  return (
    <g>
      <text x={120} y={50} fontFamily="JetBrains Mono" fontSize={12} fill="hsl(var(--secondary))">VIRTUAL pages</text>
      <text x={400} y={50} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={12} fill="hsl(var(--primary))">PAGE TABLE</text>
      <text x={680} y={50} textAnchor="end" fontFamily="JetBrains Mono" fontSize={12} fill="hsl(var(--accent))">PHYSICAL frames</text>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={50} y={80 + i * 70} width={140} height={50} rx={5} fill={i === va ? "hsl(var(--secondary))" : "hsl(var(--muted))"} opacity={i === va ? 0.5 : 0.3} stroke="hsl(var(--secondary))" />
          <text x={120} y={110 + i * 70} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={12} fill="hsl(var(--foreground))">VPage {i}</text>
        </g>
      ))}
      {/* page table */}
      <rect x={310} y={80} width={180} height={300} rx={8} fill="hsl(var(--card))" stroke="hsl(var(--primary))" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <text x={330} y={110 + i * 70} fontFamily="JetBrains Mono" fontSize={11} fill={i === va ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}>VP {i} →</text>
          <text x={460} y={110 + i * 70} textAnchor="end" fontFamily="JetBrains Mono" fontSize={11} fill={i === va ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))"}>Frame {mapping[i]}</text>
        </g>
      ))}
      {/* frames */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={610} y={80 + i * 70} width={140} height={50} rx={5} fill={i === pa ? "hsl(var(--accent))" : "hsl(var(--muted))"} opacity={i === pa ? 0.5 : 0.3} stroke="hsl(var(--accent))" />
          <text x={680} y={110 + i * 70} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={12} fill="hsl(var(--foreground))">Frame {i}</text>
        </g>
      ))}
      {/* arrows */}
      <line x1={190} y1={105 + va * 70} x2={310} y2={105 + va * 70} stroke="hsl(var(--secondary))" strokeWidth={2} markerEnd="url(#arrow)" />
      <line x1={490} y1={105 + va * 70} x2={610} y2={105 + pa * 70} stroke="hsl(var(--accent))" strokeWidth={2} markerEnd="url(#arrow)" />
      <text x={400} y={420} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={11} fill="hsl(var(--muted-foreground))">CPU asks for VP {va} → table says Frame {pa} → access in 1 step</text>
    </g>
  );
}

function VirtualMemoryScene({ t }: { t: number }) {
  // RAM + DISK with pages swapping
  const swap = (t * 2) % 1;
  return (
    <g>
      <text x={200} y={50} textAnchor="middle" fontFamily="Space Grotesk" fontWeight={700} fontSize={16} fill="hsl(var(--primary))">RAM (fast, small)</text>
      <text x={600} y={50} textAnchor="middle" fontFamily="Space Grotesk" fontWeight={700} fontSize={16} fill="hsl(var(--secondary))">DISK (slow, huge)</text>
      <rect x={50} y={80} width={300} height={300} rx={10} fill="hsl(var(--primary)/0.05)" stroke="hsl(var(--primary))" />
      <rect x={450} y={80} width={300} height={300} rx={10} fill="hsl(var(--secondary)/0.05)" stroke="hsl(var(--secondary))" />
      {/* RAM pages */}
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={i} x={70 + (i % 3) * 90} y={100 + Math.floor(i / 3) * 90} width={80} height={75} rx={4} fill="hsl(var(--primary))" opacity={0.4} />
      ))}
      {/* Disk pages */}
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={470 + (i % 4) * 70} y={100 + Math.floor(i / 4) * 90} width={60} height={75} rx={4} fill="hsl(var(--secondary))" opacity={0.4} />
      ))}
      {/* swapping page */}
      {(() => {
        const out = swap < 0.5;
        const x = lerp(200, 540, out ? swap * 2 : 1 - (swap - 0.5) * 2);
        return (
          <g transform={`translate(${x},230)`}>
            <rect x={-30} y={-25} width={60} height={50} rx={4} fill="hsl(var(--accent))" />
            <text x={0} y={4} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={10} fill="hsl(var(--accent-foreground))">page</text>
          </g>
        );
      })()}
      <text x={400} y={420} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={11} fill="hsl(var(--muted-foreground))">Hot pages live in RAM. Cold ones get swapped to disk. Magic.</text>
    </g>
  );
}

function PageFaultScene({ t }: { t: number }) {
  // 4 frames, sliding window of references
  const refs = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5];
  const idx = Math.floor(t * refs.length) % refs.length;
  // simulate FIFO with 3 frames
  const frames: (number | null)[] = [null, null, null];
  let pointer = 0;
  let faults = 0;
  for (let i = 0; i <= idx; i++) {
    if (!frames.includes(refs[i])) {
      frames[pointer] = refs[i];
      pointer = (pointer + 1) % 3;
      faults++;
    }
  }
  const isFault = (() => {
    const f2: (number | null)[] = [null, null, null];
    let p = 0;
    for (let i = 0; i < idx; i++) {
      if (!f2.includes(refs[i])) {
        f2[p] = refs[i];
        p = (p + 1) % 3;
      }
    }
    return !f2.includes(refs[idx]);
  })();
  return (
    <g>
      <text x={400} y={40} textAnchor="middle" fontFamily="Space Grotesk" fontWeight={700} fontSize={16} fill="hsl(var(--foreground))">FIFO · 3 frames · live trace</text>
      {/* reference string */}
      {refs.map((r, i) => (
        <g key={i}>
          <rect x={60 + i * 55} y={80} width={50} height={40} rx={4} fill={i === idx ? "hsl(var(--primary))" : "hsl(var(--muted))"} opacity={i === idx ? 0.6 : 0.3} stroke="hsl(var(--border))" />
          <text x={85 + i * 55} y={106} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={14} fill={i === idx ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))"}>{r}</text>
        </g>
      ))}
      {/* frames */}
      {[0, 1, 2].map((f) => (
        <g key={f}>
          <rect x={300} y={170 + f * 60} width={200} height={50} rx={6} fill="hsl(var(--card))" stroke="hsl(var(--secondary))" />
          <text x={320} y={200 + f * 60} fontFamily="JetBrains Mono" fontSize={12} fill="hsl(var(--muted-foreground))">Frame {f}</text>
          <text x={480} y={200 + f * 60} textAnchor="end" fontFamily="Space Grotesk" fontWeight={700} fontSize={20} fill="hsl(var(--primary))">{frames[f] ?? "—"}</text>
        </g>
      ))}
      <g transform="translate(620,250)">
        <rect x={-60} y={-30} width={120} height={60} rx={8} fill={isFault ? "hsl(var(--destructive)/0.2)" : "hsl(var(--success)/0.2)"} stroke={isFault ? "hsl(var(--destructive))" : "hsl(var(--success))"} />
        <text x={0} y={-8} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={10} fill="hsl(var(--muted-foreground))">access {refs[idx]}</text>
        <text x={0} y={18} textAnchor="middle" fontFamily="Space Grotesk" fontWeight={800} fontSize={18} fill={isFault ? "hsl(var(--destructive))" : "hsl(var(--success))"}>{isFault ? "FAULT" : "HIT"}</text>
      </g>
      <text x={400} y={400} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={11} fill="hsl(var(--muted-foreground))">faults so far: {faults}</text>
    </g>
  );
}

function RaceScene({ t }: { t: number }) {
  // Two processes A, B both compute balance
  const steps = [
    { who: "A", op: "read", val: 100 },
    { who: "B", op: "read", val: 100 },
    { who: "A", op: "+50", val: 150 },
    { who: "B", op: "+30", val: 130 },
    { who: "A", op: "write", val: 150 },
    { who: "B", op: "write", val: 130 },
  ];
  const idx = Math.min(steps.length - 1, Math.floor(t * (steps.length + 0.5)));
  const balance = idx >= 4 ? 150 : 100;
  const finalBalance = idx >= 5 ? 130 : balance;
  return (
    <g>
      <text x={400} y={40} textAnchor="middle" fontFamily="Space Grotesk" fontWeight={700} fontSize={16} fill="hsl(var(--foreground))">
        Bank account: $100. A adds $50. B adds $30.
      </text>
      {/* Process A */}
      <g>
        <rect x={40} y={80} width={250} height={280} rx={10} fill="hsl(var(--secondary)/0.05)" stroke="hsl(var(--secondary))" />
        <text x={165} y={110} textAnchor="middle" fontFamily="Space Grotesk" fontWeight={700} fontSize={14} fill="hsl(var(--secondary))">Process A (+$50)</text>
        {steps.filter((s) => s.who === "A").map((s, i) => {
          const myIdx = steps.indexOf(s);
          const active = idx >= myIdx;
          return (
            <text key={i} x={60} y={150 + i * 50} fontFamily="JetBrains Mono" fontSize={12} fill={active ? "hsl(var(--secondary))" : "hsl(var(--muted-foreground))"} opacity={active ? 1 : 0.4}>
              → {s.op} {s.op !== "read" ? `→ ${s.val}` : ""}
            </text>
          );
        })}
      </g>
      {/* Process B */}
      <g>
        <rect x={510} y={80} width={250} height={280} rx={10} fill="hsl(var(--accent)/0.05)" stroke="hsl(var(--accent))" />
        <text x={635} y={110} textAnchor="middle" fontFamily="Space Grotesk" fontWeight={700} fontSize={14} fill="hsl(var(--accent))">Process B (+$30)</text>
        {steps.filter((s) => s.who === "B").map((s, i) => {
          const myIdx = steps.indexOf(s);
          const active = idx >= myIdx;
          return (
            <text key={i} x={530} y={150 + i * 50} fontFamily="JetBrains Mono" fontSize={12} fill={active ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))"} opacity={active ? 1 : 0.4}>
              → {s.op} {s.op !== "read" ? `→ ${s.val}` : ""}
            </text>
          );
        })}
      </g>
      {/* shared balance */}
      <g transform="translate(400,225)">
        <rect x={-90} y={-50} width={180} height={100} rx={10} fill="hsl(var(--card))" stroke={idx >= 5 ? "hsl(var(--destructive))" : "hsl(var(--primary))"} strokeWidth={2} />
        <text x={0} y={-20} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={11} fill="hsl(var(--muted-foreground))">$BALANCE</text>
        <text x={0} y={20} textAnchor="middle" fontFamily="Space Grotesk" fontWeight={800} fontSize={32} fill={idx >= 5 ? "hsl(var(--destructive))" : "hsl(var(--primary))"}>${finalBalance}</text>
      </g>
      <text x={400} y={410} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={12} fill={idx >= 5 ? "hsl(var(--destructive))" : "hsl(var(--muted-foreground))"}>
        {idx >= 5 ? "💥 Lost update! Expected $180, got $130" : "interleaving in progress…"}
      </text>
    </g>
  );
}

function LockKeyScene({ t }: { t: number }) {
  const inside = Math.floor(t * 4) % 2 === 0;
  return (
    <g>
      <rect x={250} y={120} width={300} height={220} rx={12} fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth={2} />
      <text x={400} y={155} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={11} fill="hsl(var(--muted-foreground))">CRITICAL SECTION</text>
      <text x={400} y={245} textAnchor="middle" fontSize={48}>{inside ? "🟢" : "🔒"}</text>
      <text x={400} y={300} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={11} fill={inside ? "hsl(var(--success))" : "hsl(var(--destructive))"}>
        {inside ? "Process A inside · others wait" : "Locked · queue forming"}
      </text>
      {/* queue */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <circle cx={80 + i * 50} cy={230} r={18} fill="hsl(var(--secondary))" opacity={0.6} />
          <text x={80 + i * 50} y={235} textAnchor="middle" fontSize={14} fontFamily="Space Grotesk" fontWeight={700} fill="hsl(var(--background))">P{i + 2}</text>
        </g>
      ))}
      <text x={155} y={280} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={10} fill="hsl(var(--muted-foreground))">waiting queue</text>
    </g>
  );
}

function ParkingScene({ t }: { t: number }) {
  // 5 spots, cars cycling
  const spots = 5;
  const occupied = Array.from({ length: spots }).map((_, i) => {
    const phase = (t * 2 + i * 0.2) % 1;
    return phase < 0.7;
  });
  const count = occupied.filter(Boolean).length;
  return (
    <g>
      <text x={400} y={50} textAnchor="middle" fontFamily="Space Grotesk" fontWeight={700} fontSize={16} fill="hsl(var(--foreground))">Counting Semaphore (init = 5)</text>
      {Array.from({ length: spots }).map((_, i) => (
        <g key={i}>
          <rect x={130 + i * 110} y={140} width={90} height={130} rx={6} fill="hsl(var(--muted))" stroke="hsl(var(--primary))" strokeDasharray="3 3" />
          {occupied[i] && (
            <text x={175 + i * 110} y={220} textAnchor="middle" fontSize={48}>🚗</text>
          )}
          <text x={175 + i * 110} y={295} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={11} fill="hsl(var(--muted-foreground))">spot {i + 1}</text>
        </g>
      ))}
      <g transform="translate(400,360)">
        <rect x={-100} y={-25} width={200} height={50} rx={8} fill="hsl(var(--primary)/0.15)" stroke="hsl(var(--primary))" />
        <text x={-20} y={5} textAnchor="end" fontFamily="JetBrains Mono" fontSize={12} fill="hsl(var(--muted-foreground))">free spaces:</text>
        <text x={20} y={6} fontFamily="Space Grotesk" fontWeight={800} fontSize={20} fill="hsl(var(--primary))">{spots - count}</text>
      </g>
    </g>
  );
}

function ProducerConsumerScene({ t }: { t: number }) {
  // buffer of 5 slots, items slide in and out
  const slots = 5;
  const cycle = (t * 4) % 1;
  const items = Array.from({ length: slots }).map((_, i) => {
    const phase = (t * 2 + i * 0.13) % 1;
    return phase < 0.6;
  });
  return (
    <g>
      <g transform="translate(80,200)">
        <text x={50} y={-50} textAnchor="middle" fontFamily="Space Grotesk" fontWeight={700} fontSize={14} fill="hsl(var(--secondary))">PRODUCER</text>
        <text x={50} y={-25} textAnchor="middle" fontSize={36}>👨‍🍳</text>
      </g>
      <g transform="translate(670,200)">
        <text x={50} y={-50} textAnchor="middle" fontFamily="Space Grotesk" fontWeight={700} fontSize={14} fill="hsl(var(--accent))">CONSUMER</text>
        <text x={50} y={-25} textAnchor="middle" fontSize={36}>🤤</text>
      </g>
      {/* buffer */}
      <rect x={250} y={170} width={300} height={80} rx={8} fill="hsl(var(--card))" stroke="hsl(var(--primary))" />
      {Array.from({ length: slots }).map((_, i) => (
        <g key={i}>
          <rect x={260 + i * 56} y={180} width={50} height={60} rx={4} fill="hsl(var(--muted))" stroke="hsl(var(--border))" />
          {items[i] && <text x={285 + i * 56} y={220} textAnchor="middle" fontSize={26}>🍪</text>}
        </g>
      ))}
      {/* moving cookie producer→buffer */}
      <g transform={`translate(${lerp(180, 260, easeInOut(cycle))},220)`}>
        <text fontSize={22}>🍪</text>
      </g>
      {/* buffer→consumer */}
      <g transform={`translate(${lerp(540, 670, easeInOut(cycle))},220)`}>
        <text fontSize={22}>🍪</text>
      </g>
      {/* semaphore values */}
      <text x={400} y={310} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={12} fill="hsl(var(--muted-foreground))">
        empty = {slots - items.filter(Boolean).length} · full = {items.filter(Boolean).length} · mutex = 1
      </text>
      <text x={400} y={340} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={11} fill="hsl(var(--primary))">
        Producer: P(empty) → P(mutex) → add → V(mutex) → V(full)
      </text>
    </g>
  );
}

function DeadlockBridgeScene({ t }: { t: number }) {
  const shake = Math.sin(t * Math.PI * 8) * 2;
  return (
    <g transform={`translate(${shake},0)`}>
      <text x={400} y={50} textAnchor="middle" fontFamily="Space Grotesk" fontWeight={700} fontSize={16} fill="hsl(var(--warning))">CIRCULAR WAIT · neither moves</text>
      <rect x={150} y={200} width={500} height={70} rx={4} fill="hsl(var(--muted))" stroke="hsl(var(--border))" />
      <text x={400} y={195} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={11} fill="hsl(var(--muted-foreground))">— ONE LANE BRIDGE —</text>
      <g transform="translate(220,235)">
        <text fontSize={42}>🚗</text>
        <text x={50} y={-20} fontFamily="JetBrains Mono" fontSize={11} fill="hsl(var(--secondary))">A holds Lock1</text>
        <text x={50} y={50} fontFamily="JetBrains Mono" fontSize={11} fill="hsl(var(--destructive))">wants Lock2 →</text>
      </g>
      <g transform="translate(530,235)">
        <text fontSize={42}>🚙</text>
        <text x={-180} y={-20} fontFamily="JetBrains Mono" fontSize={11} fill="hsl(var(--accent))">B holds Lock2</text>
        <text x={-180} y={50} fontFamily="JetBrains Mono" fontSize={11} fill="hsl(var(--destructive))">← wants Lock1</text>
      </g>
      <text x={400} y={350} textAnchor="middle" fontFamily="Space Grotesk" fontWeight={800} fontSize={26} fill="hsl(var(--destructive))">⛔ DEADLOCK</text>
      <text x={400} y={385} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={11} fill="hsl(var(--muted-foreground))">mutual exclusion + hold &amp; wait + no preemption + circular wait</text>
    </g>
  );
}

function DiskScene({ t }: { t: number }) {
  // disk track with head moving
  const cylinders = [16, 24, 43, 82, 140, 170, 190];
  const head0 = 50;
  // SSTF order from 50: 43, 24, 16, 82, 140, 170, 190
  const order = [50, 43, 24, 16, 82, 140, 170, 190];
  const phase = t * (order.length - 1);
  const i = Math.min(order.length - 2, Math.floor(phase));
  const f = phase - i;
  const headPos = lerp(order[i], order[i + 1], easeInOut(f));
  const x = 60 + (headPos / 200) * 680;
  return (
    <g>
      <text x={400} y={40} textAnchor="middle" fontFamily="Space Grotesk" fontWeight={700} fontSize={16} fill="hsl(var(--foreground))">SSTF · head sweeps to nearest request</text>
      {/* cylinder axis */}
      <line x1={60} y1={250} x2={740} y2={250} stroke="hsl(var(--border))" strokeWidth={2} />
      {Array.from({ length: 11 }).map((_, k) => (
        <g key={k}>
          <line x1={60 + (k * 200 / 10) * 680 / 200} y1={245} x2={60 + (k * 200 / 10) * 680 / 200} y2={255} stroke="hsl(var(--muted-foreground))" />
          <text x={60 + (k * 200 / 10) * 680 / 200} y={275} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={10} fill="hsl(var(--muted-foreground))">{k * 20}</text>
        </g>
      ))}
      {/* requests */}
      {cylinders.map((c, k) => (
        <g key={k}>
          <circle cx={60 + (c / 200) * 680} cy={210} r={6} fill="hsl(var(--secondary))" />
          <text x={60 + (c / 200) * 680} y={195} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={9} fill="hsl(var(--secondary))">{c}</text>
        </g>
      ))}
      {/* head */}
      <g transform={`translate(${x},250)`}>
        <line x1={0} y1={0} x2={0} y2={-40} stroke="hsl(var(--primary))" strokeWidth={2} />
        <polygon points="-8,-40 8,-40 0,-50" fill="hsl(var(--primary))" />
        <text x={0} y={20} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={11} fill="hsl(var(--primary))">head</text>
      </g>
      <text x={400} y={350} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={11} fill="hsl(var(--muted-foreground))">
        Visit order: {order.slice(1, i + 2).join(" → ")}
      </text>
    </g>
  );
}

function FileTreeScene({ t }: { t: number }) {
  const highlight = Math.floor(t * 4) % 4;
  const node = (x: number, y: number, label: string, on: boolean, kind: "dir" | "file") => (
    <g>
      <rect x={x - 50} y={y - 18} width={100} height={36} rx={6} fill={on ? "hsl(var(--primary)/0.25)" : "hsl(var(--card))"} stroke={kind === "dir" ? "hsl(var(--primary))" : "hsl(var(--secondary))"} />
      <text x={x} y={y + 5} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={11} fill="hsl(var(--foreground))">{label}</text>
    </g>
  );
  return (
    <g>
      {node(400, 70, "/", highlight === 0, "dir")}
      <line x1={400} y1={88} x2={200} y2={150} stroke="hsl(var(--border))" />
      <line x1={400} y1={88} x2={400} y2={150} stroke="hsl(var(--border))" />
      <line x1={400} y1={88} x2={600} y2={150} stroke="hsl(var(--border))" />
      {node(200, 170, "home/", highlight === 1, "dir")}
      {node(400, 170, "etc/", false, "dir")}
      {node(600, 170, "var/", false, "dir")}
      <line x1={200} y1={188} x2={120} y2={250} stroke="hsl(var(--border))" />
      <line x1={200} y1={188} x2={280} y2={250} stroke="hsl(var(--border))" />
      {node(120, 270, "arfa/", highlight === 2, "dir")}
      {node(280, 270, "ali/", false, "dir")}
      <line x1={120} y1={288} x2={60} y2={350} stroke="hsl(var(--border))" />
      <line x1={120} y1={288} x2={180} y2={350} stroke="hsl(var(--border))" />
      {node(60, 370, "notes.txt", highlight === 3, "file")}
      {node(180, 370, "song.mp3", false, "file")}
    </g>
  );
}

function PermsScene({ t }: { t: number }) {
  const perms = [
    { who: "Owner", val: 7, bits: "rwx" },
    { who: "Group", val: 5, bits: "r-x" },
    { who: "Other", val: 5, bits: "r-x" },
  ];
  return (
    <g>
      <text x={400} y={50} textAnchor="middle" fontFamily="Space Grotesk" fontWeight={700} fontSize={20} fill="hsl(var(--foreground))">chmod 755 myfile</text>
      <text x={400} y={80} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={12} fill="hsl(var(--muted-foreground))">→ rwxr-xr-x</text>
      {perms.map((p, i) => (
        <g key={i} transform={`translate(${130 + i * 200},150)`}>
          <rect x={-70} y={0} width={140} height={140} rx={10} fill="hsl(var(--card))" stroke="hsl(var(--primary))" />
          <text x={0} y={30} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={12} fill="hsl(var(--muted-foreground))">{p.who}</text>
          <text x={0} y={75} textAnchor="middle" fontFamily="Space Grotesk" fontWeight={800} fontSize={36} fill="hsl(var(--primary))">{p.val}</text>
          <text x={0} y={110} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={18} fill="hsl(var(--secondary))">{p.bits}</text>
        </g>
      ))}
      <text x={400} y={350} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={11} fill="hsl(var(--muted-foreground))">7 = 4(r) + 2(w) + 1(x) · 5 = 4(r) + 1(x) · 0 = none</text>
      <text x={400} y={400} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={11} fill={Math.sin(t * Math.PI * 2) > 0 ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))"}>
        owner full · group + others can read &amp; execute · nobody else can write
      </text>
    </g>
  );
}
