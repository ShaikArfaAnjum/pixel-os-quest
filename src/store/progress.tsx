import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first_blood", name: "First Blood", description: "Complete your first lesson", icon: "🩸" },
  { id: "scheduler", name: "Algorithm Master", description: "Run all CPU scheduling algorithms", icon: "⚡" },
  { id: "sync_guru", name: "Sync Guru", description: "Solve the Producer-Consumer problem", icon: "🔄" },
  { id: "memory_wizard", name: "Memory Wizard", description: "Score perfect on Page Replacement", icon: "🧠" },
  { id: "deadlock", name: "Deadlock Detective", description: "Run Banker's Algorithm successfully", icon: "🕵️" },
  { id: "perfectionist", name: "Perfectionist", description: "100% accuracy on a quiz", icon: "💎" },
  { id: "speed_runner", name: "Speed Runner", description: "Reach Level 3", icon: "🏃" },
  { id: "legend", name: "Leaderboard Legend", description: "Reach Level 5", icon: "👑" },
];

const XP_PER_LEVEL = 250;

type ProgressState = {
  xp: number;
  level: number;
  unlocked: Set<string>;
  completedLessons: Set<string>;
  username: string;
};

type Ctx = ProgressState & {
  addXP: (amount: number, reason?: string) => void;
  unlock: (id: string) => void;
  completeLesson: (id: string) => void;
  setUsername: (n: string) => void;
  xpToNext: number;
  progressInLevel: number;
  reset: () => void;
};

const ProgressContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "os-quest-progress-v1";

const load = (): ProgressState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        xp: parsed.xp ?? 0,
        level: parsed.level ?? 1,
        unlocked: new Set(parsed.unlocked ?? []),
        completedLessons: new Set(parsed.completedLessons ?? []),
        username: parsed.username ?? "Cadet",
      };
    }
  } catch {}
  return { xp: 0, level: 1, unlocked: new Set(), completedLessons: new Set(), username: "Cadet" };
};

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(() => load());

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        xp: state.xp,
        level: state.level,
        unlocked: [...state.unlocked],
        completedLessons: [...state.completedLessons],
        username: state.username,
      })
    );
  }, [state]);

  const addXP = useCallback((amount: number) => {
    setState((s) => {
      const newXP = s.xp + amount;
      const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
      const unlocked = new Set(s.unlocked);
      if (newLevel >= 3) unlocked.add("speed_runner");
      if (newLevel >= 5) unlocked.add("legend");
      return { ...s, xp: newXP, level: newLevel, unlocked };
    });
  }, []);

  const unlock = useCallback((id: string) => {
    setState((s) => {
      if (s.unlocked.has(id)) return s;
      const unlocked = new Set(s.unlocked);
      unlocked.add(id);
      return { ...s, unlocked };
    });
  }, []);

  const completeLesson = useCallback((id: string) => {
    setState((s) => {
      if (s.completedLessons.has(id)) return s;
      const completed = new Set(s.completedLessons);
      completed.add(id);
      const unlocked = new Set(s.unlocked);
      if (completed.size >= 1) unlocked.add("first_blood");
      return { ...s, completedLessons: completed, unlocked };
    });
  }, []);

  const setUsername = useCallback((n: string) => setState((s) => ({ ...s, username: n })), []);
  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ xp: 0, level: 1, unlocked: new Set(), completedLessons: new Set(), username: "Cadet" });
  }, []);

  const progressInLevel = state.xp % XP_PER_LEVEL;
  const xpToNext = XP_PER_LEVEL - progressInLevel;

  return (
    <ProgressContext.Provider
      value={{ ...state, addXP, unlock, completeLesson, setUsername, xpToNext, progressInLevel, reset }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}

export const XP_PER_LEVEL_VALUE = XP_PER_LEVEL;
