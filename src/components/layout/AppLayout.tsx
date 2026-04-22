import { ReactNode } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Cpu, Database, Workflow, Trophy, BookOpen, Terminal, Sparkles, User as UserIcon, LogOut } from "lucide-react";
import { useProgress } from "@/store/progress";
import { useAuth } from "@/store/auth";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/chapters", label: "Chapters", icon: Sparkles },
  { to: "/learn", label: "Learn", icon: BookOpen },
  { to: "/sim/scheduling", label: "Scheduling", icon: Cpu },
  { to: "/sim/page-replacement", label: "Paging", icon: Database },
  { to: "/sim/semaphore", label: "Semaphore", icon: Workflow },
  { to: "/quiz", label: "Quiz", icon: Trophy },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const { level, xp, progressInLevel, username } = useProgress();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const pct = (progressInLevel / 250) * 100;
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col grid-bg">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="container flex items-center justify-between h-16 gap-6">
          <NavLink to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-mono font-bold text-background animate-pulse-glow">
              <Terminal className="w-5 h-5" />
            </div>
            <div className="font-display font-bold text-lg leading-none">
              <div className="text-gradient-cyber">OS.QUEST</div>
              <div className="text-[10px] text-muted-foreground tracking-[0.3em] font-mono uppercase">v1.0</div>
            </div>
          </NavLink>

          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`relative px-3 py-2 rounded-md text-sm font-medium font-mono uppercase tracking-wider transition-all ${
                    active
                      ? "text-primary bg-primary/10 neon-text"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </span>
                  {active && (
                    <span className="absolute -bottom-px left-2 right-2 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-full glass-card">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-[11px] font-bold font-mono">
              {level}
            </div>
            <div className="flex flex-col gap-1 min-w-[100px]">
              <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                <span>LVL {level}</span>
                <span className="text-primary">{xp} XP</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="md:hidden flex overflow-x-auto px-4 pb-2 gap-1 border-t border-border/50">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono uppercase ${
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </header>

      <main className="flex-1 container py-8 animate-fade-in">{children}</main>

      <footer className="border-t border-border/50 py-4 text-center text-xs font-mono text-muted-foreground">
        <span className="text-primary">$</span> OS.QUEST · learning operating systems, gamified
      </footer>
    </div>
  );
}
