export type Question = {
  q: string;
  options: string[];
  correct: number;
  explain: string;
};

export const QUESTIONS: Question[] = [
  {
    q: "Which scheduling algorithm can cause starvation of long processes?",
    options: ["FCFS", "Round Robin", "SJF", "All of the above"],
    correct: 2,
    explain: "Shortest Job First continually prefers shorter jobs, so a long job may wait indefinitely (starvation).",
  },
  {
    q: "What does the 'x' permission mean for a directory in Linux?",
    options: ["List its contents", "Enter (cd into) the directory", "Create files inside", "Delete the directory"],
    correct: 1,
    explain: "On directories, execute permission allows you to traverse into it (cd). Read lists contents.",
  },
  {
    q: "Belady's anomaly can occur with which page replacement algorithm?",
    options: ["LRU", "Optimal", "FIFO", "None"],
    correct: 2,
    explain: "FIFO can suffer Belady's anomaly: more frames may produce MORE faults. LRU and OPT are stack algorithms and don't.",
  },
  {
    q: "Which of these is NOT a necessary condition for deadlock?",
    options: ["Mutual exclusion", "Hold and wait", "Preemption", "Circular wait"],
    correct: 2,
    explain: "Deadlock requires NO preemption — the four conditions are mutual exclusion, hold & wait, no preemption, circular wait.",
  },
  {
    q: "In Producer-Consumer with semaphores, what does wait(empty) do?",
    options: [
      "Increments empty by 1",
      "Decrements empty; blocks if 0",
      "Locks the mutex",
      "Notifies the consumer",
    ],
    correct: 1,
    explain: "wait() / P() decrements the semaphore. If the value would go below 0, the process is blocked.",
  },
  {
    q: "Round Robin with very small time quantum approaches behavior of...",
    options: ["FCFS", "SJF", "Processor sharing (fair)", "Priority scheduling"],
    correct: 2,
    explain: "As quantum → 0 (ignoring overhead), every process appears to run simultaneously — processor sharing.",
  },
  {
    q: "TLB is used to speed up which operation?",
    options: [
      "Disk seek",
      "Page table lookup",
      "Context switch",
      "Process scheduling",
    ],
    correct: 1,
    explain: "Translation Lookaside Buffer caches recent virtual→physical address translations to skip the page table walk.",
  },
  {
    q: "SCAN disk scheduling is also known as the...",
    options: ["Greedy algorithm", "Elevator algorithm", "Lazy algorithm", "Banker algorithm"],
    correct: 1,
    explain: "SCAN moves the head in one direction servicing requests, then reverses — like an elevator.",
  },
];
