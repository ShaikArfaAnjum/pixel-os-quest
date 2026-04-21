import { ReactNode } from "react";

export function PageHeader({ kicker, title, subtitle, children }: { kicker: string; title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <div className="mb-8">
      <div className="font-mono text-xs uppercase tracking-[0.4em] text-secondary cyan-text mb-2">// {kicker}</div>
      <h1 className="font-display text-4xl sm:text-5xl font-bold text-gradient-cyber">{title}</h1>
      {subtitle && <p className="text-muted-foreground mt-3 max-w-2xl">{subtitle}</p>}
      {children}
    </div>
  );
}
