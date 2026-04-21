import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { LEVELS } from "@/data/levels";
import { useProgress } from "@/store/progress";
import { CheckCircle2, Circle } from "lucide-react";

const NOTES: Record<number, { topic: string; body: string }[]> = {
  1: [
    { topic: "File System Hierarchy", body: "Linux organizes everything as files under a single root /. Directories are special files mapping names → inodes. Use ls, pwd, cd, mkdir to navigate." },
    { topic: "Permissions (rwx)", body: "Each file has owner / group / others permission triplets. chmod 755 file = rwxr-xr-x. The execute bit on a directory means you may cd into it." },
    { topic: "Filters & Regex", body: "Pipe streams through grep (search), sed (substitute), cut/sort/uniq. Regex anchors: ^ start, $ end, . any, * zero+, + one+." },
  ],
  2: [
    { topic: "Process vs Program", body: "A program is passive code on disk. A process is an active instance: code + PC + registers + stack + heap + PCB." },
    { topic: "Process States", body: "New → Ready → Running → Waiting → Terminated. The scheduler moves processes between Ready and Running; I/O moves them to Waiting." },
    { topic: "Scheduling Goals", body: "Maximize CPU utilization & throughput; minimize turnaround, waiting, and response times — these often conflict." },
  ],
  3: [
    { topic: "Critical Section", body: "A code region accessing shared data. Only one process may execute its critical section at a time (mutual exclusion)." },
    { topic: "Semaphore", body: "An integer with two atomic ops: wait(s)/P decrements (blocks if <0), signal(s)/V increments. Binary semaphore = mutex." },
    { topic: "Producer-Consumer", body: "Use empty (init=N), full (init=0) and mutex (init=1) to coordinate a bounded buffer between producers and consumers." },
  ],
  8: [
    { topic: "Page Faults", body: "When a referenced page is not in a frame, the OS triggers a page fault, evicts a victim if memory is full, and loads the new page." },
    { topic: "FIFO vs LRU vs OPT", body: "FIFO evicts the oldest loaded; LRU the least recently used; OPTIMAL the one used farthest in the future (theoretical lower bound)." },
    { topic: "Belady's Anomaly", body: "With FIFO, increasing the number of frames can — counterintuitively — increase the page fault rate. LRU and OPT are immune." },
  ],
};

export default function LearnPage() {
  const { completedLessons, completeLesson, addXP } = useProgress();

  const mark = (id: string) => {
    if (completedLessons.has(id)) return;
    completeLesson(id);
    addXP(15);
  };

  return (
    <AppLayout>
      <PageHeader kicker="knowledge base" title="Learning Modules" subtitle="Bite-size notes for every level. Mark a lesson complete to earn 15 XP." />

      <div className="space-y-8">
        {LEVELS.map((lvl) => {
          const Icon = lvl.icon;
          const notes = NOTES[lvl.id] ?? lvl.topics.map((t) => ({ topic: t, body: "Coming soon — explore the simulators while we polish the lesson notes." }));
          return (
            <section key={lvl.id} className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-md bg-primary/15 border border-primary/40 flex items-center justify-center text-primary">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Level {lvl.id.toString().padStart(2, "0")}</div>
                  <h2 className="font-display font-bold text-xl">{lvl.title} · <span className="text-muted-foreground font-normal">{lvl.subtitle}</span></h2>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                {notes.map((n, i) => {
                  const id = `lvl${lvl.id}-${i}`;
                  const done = completedLessons.has(id);
                  return (
                    <button
                      key={i}
                      onClick={() => mark(id)}
                      className={`text-left p-4 rounded-lg border transition-all ${
                        done ? "border-primary/40 bg-primary/5" : "border-border bg-muted/30 hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="font-display font-bold text-sm">{n.topic}</span>
                        {done ? <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> : <Circle className="w-4 h-4 text-muted-foreground shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{n.body}</p>
                    </button>
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
