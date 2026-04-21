import {
  Cpu, HardDrive, Lock, Layers, Network, Database, Zap, FileCode, Workflow, Crown, Gauge, Shield, Boxes,
} from "lucide-react";

export type AnalogyCard = {
  title: string;
  body: string;
  emoji: string;
};

export type StoryScene = {
  id: string;
  /** Short caption shown as narration */
  narration: string;
  /** Name of the built-in animation to render. See StoryAnimation. */
  animation:
    | "chaos-without-os"
    | "os-manager"
    | "os-responsibilities"
    | "hardware-tour"
    | "program-vs-process"
    | "process-states"
    | "context-switch"
    | "fcfs-vs-sjf"
    | "round-robin"
    | "memory-grid"
    | "fixed-vs-variable"
    | "paging-translate"
    | "virtual-memory"
    | "page-fault"
    | "race-condition"
    | "lock-and-key"
    | "semaphore-parking"
    | "producer-consumer"
    | "deadlock-bridge"
    | "disk-seek"
    | "file-tree"
    | "permissions";
  /** Optional details shown after the animation */
  keyPoints?: string[];
};

export type ChapterChallenge = {
  question: string;
  options: string[];
  correct: number;
  explain: string;
  xp: number;
};

export type Chapter = {
  id: string;
  order: number;
  phase: number;
  phaseLabel: string;
  title: string;
  subtitle: string;
  icon: any;
  color: "primary" | "secondary" | "accent" | "warning";
  difficulty: "Beginner" | "Easy" | "Medium" | "Hard";
  estMinutes: number;
  xpReward: number;
  hook: string;
  whyItMatters: string;
  analogies: AnalogyCard[];
  scenes: StoryScene[];
  challenge: ChapterChallenge;
  simRoute?: string;
  simLabel?: string;
  nextChapter?: string;
};

export const CHAPTERS: Chapter[] = [
  {
    id: "what-is-os",
    order: 1,
    phase: 1,
    phaseLabel: "Foundation",
    title: "What is an Operating System?",
    subtitle: "The manager behind every click",
    icon: Shield,
    color: "primary",
    difficulty: "Beginner",
    estMinutes: 6,
    xpReward: 40,
    hook: "Imagine a computer with no referee — printers printing garbage, your video call frozen, three apps fighting for the CPU. That was the 1950s. Then someone built the OS.",
    whyItMatters: "Every app you use — Chrome, Spotify, Discord — talks to the OS, not the hardware. The OS is the invisible translator, scheduler, and security guard between you and the silicon.",
    analogies: [
      { emoji: "🍽️", title: "Restaurant Manager", body: "Chefs (CPU) cook, waiters (I/O) serve, the manager (OS) decides the order so customers (apps) don't wait forever." },
      { emoji: "✈️", title: "Air Traffic Control", body: "Many planes (processes), limited runways (CPU cores). ATC (scheduler) decides who lands when — nobody crashes." },
      { emoji: "📚", title: "Library Organizer", body: "The OS organizes books (memory) so multiple readers (programs) can find what they need without collisions." },
    ],
    scenes: [
      {
        id: "chaos",
        animation: "chaos-without-os",
        narration: "Without an OS, every app fights for hardware directly. Chaos: the printer jams, audio stutters, the screen glitches.",
        keyPoints: ["Apps can't safely share CPU, RAM, or disk", "One crashing app can take the whole machine down", "Someone needs to be in charge"],
      },
      {
        id: "manager",
        animation: "os-manager",
        narration: "Enter the OS: a manager between apps and hardware. It schedules, allocates, and protects.",
        keyPoints: ["Apps talk to the OS via system calls", "The OS talks to hardware via drivers", "Everyone gets a fair turn"],
      },
      {
        id: "responsibilities",
        animation: "os-responsibilities",
        narration: "Four big jobs: run programs, manage memory, handle files & I/O, and protect users from each other.",
        keyPoints: ["Process management", "Memory management", "File systems & I/O", "Security & user interface"],
      },
    ],
    challenge: {
      question: "You open Chrome, Spotify, and Zoom — all 'at the same time' on a 1-core laptop. What's really happening?",
      options: [
        "The CPU magically runs 3 things simultaneously",
        "Only one app actually runs; Spotify and Zoom are paused",
        "The OS switches the CPU between them so fast it looks parallel",
        "Each app gets its own hidden CPU",
      ],
      correct: 2,
      explain: "A single CPU core runs ONE instruction at a time. The OS rapidly swaps which process owns the CPU — this illusion is called multitasking.",
      xp: 20,
    },
    nextChapter: "hardware-basics",
  },
  {
    id: "hardware-basics",
    order: 2,
    phase: 1,
    phaseLabel: "Foundation",
    title: "How a Computer Works",
    subtitle: "CPU, RAM, Disk, I/O",
    icon: Cpu,
    color: "secondary",
    difficulty: "Beginner",
    estMinutes: 5,
    xpReward: 35,
    hook: "Before we talk about what the OS DOES, let's meet the four players it manages: the brain, the desk, the cabinet, and the senses.",
    whyItMatters: "Every OS concept — scheduling, paging, I/O — exists because these four components have wildly different speeds. The OS's whole job is hiding that gap.",
    analogies: [
      { emoji: "🧠", title: "CPU = Brain", body: "Does calculations. Blazing fast — 1 step in a nanosecond." },
      { emoji: "🪑", title: "RAM = Desk", body: "Your current workspace. Fast, but wipes when you leave." },
      { emoji: "🗄️", title: "Disk = Filing Cabinet", body: "Permanent, huge, but ~1,000,000x slower than RAM." },
      { emoji: "⌨️", title: "I/O = Senses", body: "Keyboard, mouse, network — how the computer talks to the world." },
    ],
    scenes: [
      {
        id: "tour",
        animation: "hardware-tour",
        narration: "A tour of the four components, and how data flows between them.",
        keyPoints: ["CPU reads instructions from RAM", "RAM loads data from disk when needed", "I/O events interrupt the CPU"],
      },
    ],
    challenge: {
      question: "Reading 1 byte from RAM takes ~1 ns. Reading 1 byte from a hard disk takes ~10 ms. How many times slower is the disk?",
      options: ["100x", "10,000x", "10,000,000x", "1,000x"],
      correct: 2,
      explain: "10 ms = 10,000,000 ns. That 7-orders-of-magnitude gap is why the OS works so hard to keep hot data in RAM.",
      xp: 15,
    },
    nextChapter: "process-intro",
  },
  {
    id: "process-intro",
    order: 3,
    phase: 2,
    phaseLabel: "Execution",
    title: "Programs vs Processes",
    subtitle: "From recipe to cooking",
    icon: FileCode,
    color: "accent",
    difficulty: "Easy",
    estMinutes: 6,
    xpReward: 40,
    hook: "You double-click Word. What actually happens? A frozen file on disk becomes a living, breathing process with memory, state, and its own identity.",
    whyItMatters: "The 'process' is the fundamental unit the OS schedules, isolates, and kills. Understanding it unlocks scheduling, sync, memory — everything.",
    analogies: [
      { emoji: "📖", title: "Recipe vs Cooking", body: "A program is a recipe (static). A process is the actual cooking (active, consuming resources)." },
      { emoji: "🎭", title: "Script vs Performance", body: "Same script (program), many live shows (processes), each with its own state." },
    ],
    scenes: [
      {
        id: "prog-proc",
        animation: "program-vs-process",
        narration: "One Word.exe on disk → 4 running instances. Same code, 4 independent processes.",
        keyPoints: ["Process = code + data + stack + registers + PC", "Each has a unique PID and PCB", "Processes are isolated from each other"],
      },
      {
        id: "states",
        animation: "process-states",
        narration: "A process moves through states: New → Ready → Running → Waiting → Terminated.",
        keyPoints: ["Ready = waiting for CPU", "Running = has the CPU now", "Waiting = needs I/O to finish"],
      },
    ],
    challenge: {
      question: "A process calls read() from disk. The disk takes 10ms to respond. What state does the process enter?",
      options: ["Running (it's busy working)", "Ready (back in the queue)", "Waiting (blocked on I/O)", "Terminated (it's done)"],
      correct: 2,
      explain: "While blocked on I/O, the process moves to Waiting. The CPU isn't wasted — the scheduler picks another Ready process.",
      xp: 20,
    },
    nextChapter: "cpu-scheduling",
  },
  {
    id: "cpu-scheduling",
    order: 4,
    phase: 2,
    phaseLabel: "Execution",
    title: "CPU Scheduling",
    subtitle: "FCFS · SJF · Round Robin · Priority",
    icon: Gauge,
    color: "primary",
    difficulty: "Medium",
    estMinutes: 8,
    xpReward: 60,
    hook: "Three processes. One CPU. Who goes first? This single question birthed an entire subfield of computer science.",
    whyItMatters: "Pick the wrong scheduler and your server crawls, your video stutters, your game lags. Every OS ships multiple schedulers for different workloads.",
    analogies: [
      { emoji: "🎫", title: "FCFS = Ticket Queue", body: "Whoever showed up first gets served first. Fair, but one slow person blocks everyone." },
      { emoji: "⚡", title: "SJF = Express Lane", body: "Shortest task first. Minimizes average wait — but long jobs can starve." },
      { emoji: "🔁", title: "Round Robin = Teacher's Turn", body: "Everyone gets 5 minutes, rotating. Fair, responsive — great for interactive systems." },
    ],
    scenes: [
      {
        id: "fcfs-sjf",
        animation: "fcfs-vs-sjf",
        narration: "Watch how the same 3 jobs finish at wildly different times depending on the order.",
        keyPoints: ["FCFS: simple but convoy effect", "SJF: optimal average wait, but needs to know burst times", "SJF can starve long jobs"],
      },
      {
        id: "rr",
        animation: "round-robin",
        narration: "Round Robin gives each process a fixed time slice, then preempts and rotates.",
        keyPoints: ["Great for time-sharing", "Quantum too small → overhead", "Quantum too large → acts like FCFS"],
      },
    ],
    challenge: {
      question: "Jobs arrive at t=0: A=10ms, B=1ms, C=1ms. What's the AVERAGE waiting time under FCFS vs SJF?",
      options: ["Same: 4ms vs 4ms", "FCFS: 7ms, SJF: 1ms", "FCFS: 4ms, SJF: 0.67ms", "FCFS: 10ms, SJF: 3ms"],
      correct: 2,
      explain: "FCFS: A waits 0, B waits 10, C waits 11 → avg (0+10+11)/3 ≈ 7. But think about SJF order B,C,A: B waits 0, C waits 1, A waits 2 → avg 1. (Average of (0+1+2)/3 = 1ms) — SJF wins massively.",
      xp: 30,
    },
    simRoute: "/sim/scheduling",
    simLabel: "Try the Scheduling Simulator",
    nextChapter: "context-switching",
  },
  {
    id: "context-switching",
    order: 5,
    phase: 2,
    phaseLabel: "Execution",
    title: "Interrupts & Context Switching",
    subtitle: "The cost of changing minds",
    icon: Zap,
    color: "secondary",
    difficulty: "Easy",
    estMinutes: 4,
    xpReward: 30,
    hook: "Switching processes isn't free. Every switch costs microseconds of pure overhead. Too many switches and your CPU does nothing but bookkeeping.",
    whyItMatters: "This is why choosing the right time quantum matters, why real-time systems limit interrupts, and why async/await exists.",
    analogies: [
      { emoji: "👩‍🏫", title: "Teacher Switching Classes", body: "Save your place in class A (registers), walk to class B (restore), teach, then come back." },
    ],
    scenes: [
      {
        id: "ctx",
        animation: "context-switch",
        narration: "Save registers + PC, load the next process's saved state, resume. All overhead — zero user work.",
        keyPoints: ["Saved state lives in the PCB", "Typical cost: 1-10 microseconds", "Too-small time quantum = CPU trashing"],
      },
    ],
    challenge: {
      question: "Your time quantum is 1 microsecond and context switch costs 1 microsecond. What fraction of CPU is actual useful work?",
      options: ["100%", "~50%", "~75%", "~25%"],
      correct: 1,
      explain: "If every 1μs of work costs 1μs of overhead, you spend half your CPU just switching. This is called CPU thrashing.",
      xp: 15,
    },
    nextChapter: "memory-basics",
  },
  {
    id: "memory-basics",
    order: 6,
    phase: 3,
    phaseLabel: "Memory",
    title: "Memory & Addressing",
    subtitle: "RAM is a giant numbered grid",
    icon: Layers,
    color: "accent",
    difficulty: "Easy",
    estMinutes: 5,
    xpReward: 35,
    hook: "Your RAM is literally 8 billion numbered mailboxes. Every variable, every pixel, every frame of Netflix lives at some address.",
    whyItMatters: "Understanding addresses is the gateway to everything: allocation, paging, virtual memory, security.",
    analogies: [
      { emoji: "🏢", title: "Apartment Building", body: "Each apartment has a number (address). The super (OS) decides who lives where." },
    ],
    scenes: [
      {
        id: "grid",
        animation: "memory-grid",
        narration: "Each byte of RAM has a unique address. Programs ask the OS 'I need 4KB' and get a range back.",
        keyPoints: ["1 byte = 1 mailbox", "Addresses are just integers (0, 1, 2, ...)", "Programs don't pick addresses — the OS does"],
      },
    ],
    challenge: {
      question: "Why can't programs just pick their own memory addresses?",
      options: [
        "They can, it just takes longer",
        "They'd all try to use address 0 and collide",
        "The CPU would get confused",
        "Memory is read-only",
      ],
      correct: 1,
      explain: "If every program picked its own addresses, they'd overlap and corrupt each other's data. The OS hands out non-overlapping regions.",
      xp: 15,
    },
    nextChapter: "memory-allocation",
  },
  {
    id: "memory-allocation",
    order: 7,
    phase: 3,
    phaseLabel: "Memory",
    title: "Memory Allocation",
    subtitle: "Fixed, Variable & Fragmentation",
    icon: Boxes,
    color: "warning",
    difficulty: "Medium",
    estMinutes: 7,
    xpReward: 50,
    hook: "Give every program a fixed slot → waste. Give every program exactly what it asks for → chaos of gaps. Welcome to fragmentation.",
    whyItMatters: "Fragmentation is WHY paging was invented. If you don't feel the pain of contiguous allocation, paging feels arbitrary.",
    analogies: [
      { emoji: "🧱", title: "Fixed Partitions (MFT)", body: "Like hotel rooms of 3 fixed sizes. A small guest in a big room wastes space → INTERNAL fragmentation." },
      { emoji: "🧩", title: "Variable (MVT)", body: "Cut exactly to fit. After guests leave, gaps scatter → EXTERNAL fragmentation." },
    ],
    scenes: [
      {
        id: "fixed-vs-var",
        animation: "fixed-vs-variable",
        narration: "Watch memory fill under fixed vs variable partitions. Both waste memory — just in different ways.",
        keyPoints: ["MFT = internal fragmentation (slack inside each slot)", "MVT = external fragmentation (scattered gaps)", "First-fit / Best-fit / Worst-fit all have trade-offs"],
      },
    ],
    challenge: {
      question: "A 100KB program enters a 128KB fixed partition. This creates...",
      options: ["28KB external fragmentation", "28KB internal fragmentation", "128KB wasted", "No fragmentation"],
      correct: 1,
      explain: "The 28KB is unused INSIDE the partition allocated to this program — classic internal fragmentation.",
      xp: 20,
    },
    simRoute: "/sim/memory-allocation",
    simLabel: "Try the Allocation Simulator",
    nextChapter: "paging",
  },
  {
    id: "paging",
    order: 8,
    phase: 3,
    phaseLabel: "Memory",
    title: "Paging & Address Translation",
    subtitle: "Virtual addresses, real magic",
    icon: Network,
    color: "primary",
    difficulty: "Medium",
    estMinutes: 7,
    xpReward: 55,
    hook: "What if memory didn't have to be contiguous? What if every program thought it had its own private RAM? That's paging — and it changed everything.",
    whyItMatters: "Every modern OS uses paging. It enables isolation, security, virtual memory, and efficient allocation all in one stroke.",
    analogies: [
      { emoji: "📮", title: "Post Office", body: "You write a street name (virtual address). The post office (MMU) looks up the real building (physical address)." },
    ],
    scenes: [
      {
        id: "translate",
        animation: "paging-translate",
        narration: "Every memory access goes through a page table that translates virtual → physical addresses.",
        keyPoints: ["Memory is split into fixed pages (typically 4KB)", "Page table maps virtual page → physical frame", "TLB caches recent translations"],
      },
    ],
    challenge: {
      question: "With 4KB pages, what part of a 32-bit virtual address is the offset within a page?",
      options: ["Top 20 bits", "Bottom 12 bits", "Bottom 20 bits", "Middle 8 bits"],
      correct: 1,
      explain: "4KB = 2^12 bytes, so the bottom 12 bits index inside the page. The top 20 bits select which page.",
      xp: 25,
    },
    nextChapter: "virtual-memory",
  },
  {
    id: "virtual-memory",
    order: 9,
    phase: 3,
    phaseLabel: "Memory",
    title: "Virtual Memory & Page Replacement",
    subtitle: "When RAM isn't enough",
    icon: Database,
    color: "secondary",
    difficulty: "Hard",
    estMinutes: 10,
    xpReward: 75,
    hook: "You have 8GB of RAM. You open Photoshop, Chrome with 40 tabs, and a VM. Somehow it works. How? RAM lies. It uses disk as backup.",
    whyItMatters: "Page replacement policy decides which pages stay fast and which go slow. Pick wrong → your laptop fans scream.",
    analogies: [
      { emoji: "🗂️", title: "Desk + Overflow Shelf", body: "Only a few files fit on your desk (RAM). The rest live on a shelf (disk). When you need one, you swap." },
    ],
    scenes: [
      {
        id: "vm",
        animation: "virtual-memory",
        narration: "Programs see a huge virtual address space. Only the hot pages live in RAM; cold ones live on disk.",
        keyPoints: ["Disk access is ~1,000,000x slower than RAM", "Too much swapping = thrashing", "Locality of reference makes it work"],
      },
      {
        id: "fault",
        animation: "page-fault",
        narration: "Access a page that isn't in RAM → PAGE FAULT. OS fetches it from disk, maybe evicting another page.",
        keyPoints: ["FIFO: evict oldest loaded", "LRU: evict least-recently-used", "OPT: evict what won't be used longest (theoretical best)"],
      },
    ],
    challenge: {
      question: "Reference string: 1,2,3,4,1,2,5,1,2,3,4,5 with 3 frames. Belady's anomaly means FIFO may get...",
      options: [
        "Fewer faults with more frames",
        "More faults with more frames",
        "Zero faults always",
        "Same faults regardless",
      ],
      correct: 1,
      explain: "FIFO can paradoxically produce MORE page faults when you give it MORE frames. LRU and OPT are immune.",
      xp: 35,
    },
    simRoute: "/sim/page-replacement",
    simLabel: "Try the Page Replacement Simulator",
    nextChapter: "race-conditions",
  },
  {
    id: "race-conditions",
    order: 10,
    phase: 4,
    phaseLabel: "Synchronization",
    title: "Race Conditions",
    subtitle: "When $100 becomes $50",
    icon: Workflow,
    color: "accent",
    difficulty: "Medium",
    estMinutes: 6,
    xpReward: 45,
    hook: "Two ATMs, one bank account, $100 balance. Both withdraw $50 at the same millisecond. You might end up with $0... or $50... or −$50. This happens in real banks.",
    whyItMatters: "Every concurrent bug — from Therac-25 to flash-sale double-charges — is a race condition in disguise.",
    analogies: [
      { emoji: "🏦", title: "Two Tellers, One Ledger", body: "Both read '$100', both add their transaction, both write back. One update vanishes." },
    ],
    scenes: [
      {
        id: "race",
        animation: "race-condition",
        narration: "Step-by-step: two processes interleave reads and writes. The 'lost update' strikes.",
        keyPoints: ["Happens any time shared data has no lock", "Non-deterministic: sometimes works, sometimes breaks", "Solution: make critical sections atomic"],
      },
    ],
    challenge: {
      question: "Which of these guarantees a race condition WON'T happen?",
      options: [
        "Fast CPU",
        "Small number of processes",
        "Mutual exclusion on the shared resource",
        "Using only modern hardware",
      ],
      correct: 2,
      explain: "Only mutual exclusion (locks, semaphores, atomic ops) prevents races. Speed and process count just change how often you see the bug.",
      xp: 20,
    },
    simRoute: "/sim/race",
    simLabel: "See a Live Race Condition",
    nextChapter: "semaphores",
  },
  {
    id: "semaphores",
    order: 11,
    phase: 4,
    phaseLabel: "Synchronization",
    title: "Semaphores & Critical Sections",
    subtitle: "Digital locks that actually work",
    icon: Lock,
    color: "primary",
    difficulty: "Medium",
    estMinutes: 8,
    xpReward: 60,
    hook: "Dijkstra asked: can we build mutual exclusion with just one integer? Yes — and it's called a semaphore.",
    whyItMatters: "Semaphores are the LEGO bricks of synchronization. Mutex, bounded buffer, readers-writers — all built on this primitive.",
    analogies: [
      { emoji: "🅿️", title: "Parking Lot Counter", body: "Sign shows 'spaces: 5'. Arrive → decrement. Leave → increment. Zero? Wait outside." },
      { emoji: "🔑", title: "Key on a Hook", body: "One key, one bathroom. Take the key (P), do your thing, return it (V). Simple mutex." },
    ],
    scenes: [
      {
        id: "lock",
        animation: "lock-and-key",
        narration: "Only one process in the critical section at a time. Others wait politely in a queue.",
        keyPoints: ["P(s) / wait: decrement, block if <0", "V(s) / signal: increment, wake one waiter", "Binary semaphore = mutex"],
      },
      {
        id: "parking",
        animation: "semaphore-parking",
        narration: "Counting semaphore in action: 5 spots, many cars, everyone waits their turn.",
      },
      {
        id: "pc",
        animation: "producer-consumer",
        narration: "Producer-Consumer with 3 semaphores: empty, full, mutex. Nobody overflows, nobody underflows.",
        keyPoints: ["empty = N (slots free)", "full = 0 (items ready)", "mutex = 1 (buffer lock)"],
      },
    ],
    challenge: {
      question: "In producer-consumer, what's the correct order for the producer?",
      options: [
        "V(mutex) → P(empty) → add → V(full) → P(mutex)",
        "P(empty) → P(mutex) → add → V(mutex) → V(full)",
        "P(full) → P(mutex) → add → V(mutex) → V(empty)",
        "P(mutex) → P(empty) → add → V(empty) → V(mutex)",
      ],
      correct: 1,
      explain: "Producer: P(empty) to reserve a slot, P(mutex) to lock the buffer, add the item, V(mutex), V(full). Reversing empty and mutex risks deadlock.",
      xp: 30,
    },
    simRoute: "/sim/semaphore",
    simLabel: "Try the Semaphore Simulator",
    nextChapter: "deadlocks",
  },
  {
    id: "deadlocks",
    order: 12,
    phase: 5,
    phaseLabel: "Deadlocks",
    title: "Deadlocks & the Banker",
    subtitle: "Four conditions, one disaster",
    icon: Lock,
    color: "warning",
    difficulty: "Hard",
    estMinutes: 9,
    xpReward: 70,
    hook: "Two cars on a one-lane bridge, face-to-face. Neither backs up. Traffic stops forever. That's a deadlock — and it happens in code every day.",
    whyItMatters: "A single deadlock can take down a whole server. The Banker's algorithm — from 1965 — is still how databases avoid them.",
    analogies: [
      { emoji: "🌉", title: "Narrow Bridge", body: "Two cars, opposite directions, neither backs up. Classic circular wait." },
    ],
    scenes: [
      {
        id: "bridge",
        animation: "deadlock-bridge",
        narration: "Four conditions all true → deadlock: mutual exclusion, hold & wait, no preemption, circular wait.",
        keyPoints: ["Break ANY one condition to prevent deadlock", "Avoidance: Banker's algorithm checks safety before allocating", "Detection: find cycles in resource graph, then recover"],
      },
    ],
    challenge: {
      question: "Banker's algorithm works by...",
      options: [
        "Killing random processes",
        "Only granting a request if the resulting state is SAFE (some ordering finishes everyone)",
        "Preventing all resource sharing",
        "Giving everyone max resources upfront",
      ],
      correct: 1,
      explain: "Banker's simulates the allocation and checks whether at least one process ordering can complete. If yes → safe → grant. If not → deny.",
      xp: 35,
    },
    simRoute: "/sim/bankers",
    simLabel: "Try the Banker's Simulator",
    nextChapter: "disk-scheduling",
  },
  {
    id: "disk-scheduling",
    order: 13,
    phase: 6,
    phaseLabel: "Storage",
    title: "Disk Scheduling",
    subtitle: "FCFS · SSTF · SCAN · C-LOOK",
    icon: HardDrive,
    color: "secondary",
    difficulty: "Medium",
    estMinutes: 6,
    xpReward: 50,
    hook: "Spinning disks are mechanical. The head physically flies across the platter. Pick the wrong order and you waste milliseconds — eons to a CPU.",
    whyItMatters: "Even on SSDs, request ordering matters. On HDDs, it decides whether your backup finishes in 1 hour or 10.",
    analogies: [
      { emoji: "🛗", title: "Elevator (SCAN)", body: "Go up picking up everyone, then come down picking up everyone. Fair and fast." },
    ],
    scenes: [
      {
        id: "seek",
        animation: "disk-seek",
        narration: "Watch the head sweep across cylinders under different algorithms. Total seek distance differs drastically.",
        keyPoints: ["FCFS: simple but long seeks", "SSTF: shortest first — can starve far requests", "SCAN / C-LOOK: elevator — great default"],
      },
    ],
    challenge: {
      question: "Head at 50. Queue: 82, 170, 43, 140, 24, 16, 190. Going up. Which algorithm likely gives minimum total head movement?",
      options: ["FCFS", "SSTF", "SCAN", "Random"],
      correct: 1,
      explain: "SSTF picks the nearest request next, typically minimizing total movement on random workloads — at the risk of starving far requests.",
      xp: 25,
    },
    simRoute: "/sim/disk",
    simLabel: "Try the Disk Simulator",
    nextChapter: "file-systems",
  },
  {
    id: "file-systems",
    order: 14,
    phase: 7,
    phaseLabel: "Files",
    title: "File Systems & Permissions",
    subtitle: "Trees, inodes, rwx",
    icon: Crown,
    color: "accent",
    difficulty: "Easy",
    estMinutes: 6,
    xpReward: 45,
    hook: "Everything in Linux is a file — your keyboard, your network card, even /dev/null. How does the OS keep billions of them organized AND secure?",
    whyItMatters: "Wrong permissions = security breach. Understanding inodes and allocation = understanding why your rm -rf is instant but recovery isn't.",
    analogies: [
      { emoji: "🌳", title: "Filing Cabinet Tree", body: "One root, branches for users, folders for topics, leaves are files." },
    ],
    scenes: [
      {
        id: "tree",
        animation: "file-tree",
        narration: "Linux: one root /, everything hangs off it. Directories are just special files mapping names → inodes.",
        keyPoints: ["Contiguous, Linked, and Indexed allocation trade off speed vs fragmentation", "Inodes store metadata, not names", "Hard links = multiple names for same inode"],
      },
      {
        id: "perms",
        animation: "permissions",
        narration: "Every file has owner/group/other × read/write/execute. chmod 755 = rwxr-xr-x.",
        keyPoints: ["Read = see content / list dir", "Write = modify / add remove entries", "Execute = run as program / traverse dir"],
      },
    ],
    challenge: {
      question: "chmod 640 myfile means...",
      options: [
        "Owner: rw-, Group: r--, Other: ---",
        "Owner: rwx, Group: r-x, Other: ---",
        "Owner: r--, Group: rw-, Other: rwx",
        "Owner: rwx, Group: rwx, Other: r--",
      ],
      correct: 0,
      explain: "6=rw-, 4=r--, 0=---. So owner reads & writes, group reads, others can't touch it.",
      xp: 20,
    },
  },
];

export const PHASES = [
  { id: 1, label: "Foundation", color: "primary" },
  { id: 2, label: "Execution", color: "secondary" },
  { id: 3, label: "Memory", color: "accent" },
  { id: 4, label: "Synchronization", color: "primary" },
  { id: 5, label: "Deadlocks", color: "warning" },
  { id: 6, label: "Storage", color: "secondary" },
  { id: 7, label: "Files", color: "accent" },
];

export function getChapter(id: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.id === id);
}

export function getNextChapter(id: string): Chapter | undefined {
  const c = getChapter(id);
  if (!c?.nextChapter) return undefined;
  return getChapter(c.nextChapter);
}
