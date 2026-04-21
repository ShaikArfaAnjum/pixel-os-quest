import { Cpu, HardDrive, Lock, Layers, Network, Database, Zap, FileCode, Workflow, Crown } from "lucide-react";

export type LevelInfo = {
  id: number;
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  topics: string[];
};

export const LEVELS: LevelInfo[] = [
  { id: 1, title: "OS Basics", subtitle: "Linux & File Systems", icon: FileCode, color: "primary", topics: ["File system", "Permissions", "Commands", "Regex"] },
  { id: 2, title: "Processes", subtitle: "CPU Scheduling", icon: Cpu, color: "secondary", topics: ["PCB", "FCFS", "SJF", "Round Robin", "Priority"] },
  { id: 3, title: "Synchronization", subtitle: "Critical Section", icon: Workflow, color: "accent", topics: ["Peterson's", "Semaphores", "Producer-Consumer"] },
  { id: 4, title: "Deadlocks", subtitle: "Banker's Algorithm", icon: Lock, color: "warning", topics: ["Prevention", "Avoidance", "Detection"] },
  { id: 5, title: "Memory Mgmt", subtitle: "Allocation Strategies", icon: Layers, color: "primary", topics: ["MFT", "MVT", "First/Best/Worst Fit"] },
  { id: 6, title: "Paging", subtitle: "Address Translation", icon: Network, color: "secondary", topics: ["Page Table", "TLB", "Multi-level"] },
  { id: 7, title: "Virtual Memory", subtitle: "Demand Paging", icon: Zap, color: "accent", topics: ["Page Fault", "Working Set", "Thrashing"] },
  { id: 8, title: "Page Replacement", subtitle: "FIFO • LRU • OPT", icon: Database, color: "primary", topics: ["FIFO", "LRU", "Optimal", "Belady"] },
  { id: 9, title: "Disk Scheduling", subtitle: "Seek Optimization", icon: HardDrive, color: "secondary", topics: ["FCFS", "SSTF", "SCAN", "C-LOOK"] },
  { id: 10, title: "Master", subtitle: "File Systems & Beyond", icon: Crown, color: "accent", topics: ["Allocation", "Free Space", "Directory"] },
];
