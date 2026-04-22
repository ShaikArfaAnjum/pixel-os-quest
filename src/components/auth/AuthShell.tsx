import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Cpu } from "lucide-react";

export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col grid-bg">
      <header className="container h-16 flex items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-background">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="font-display font-bold text-lg text-gradient-cyber">OS.QUEST</div>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="glass-card rounded-2xl p-8 scanline relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
            <div className="relative">
              <h1 className="font-display font-bold text-2xl md:text-3xl">{title}</h1>
              {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
              <div className="mt-6 space-y-4">{children}</div>
            </div>
          </div>
          {footer && <div className="text-center text-sm text-muted-foreground mt-6">{footer}</div>}
        </div>
      </main>
    </div>
  );
}

export function GoogleButton({ onClick, loading }: { onClick: () => void; loading?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="w-full h-11 rounded-md border border-border bg-card hover:bg-muted/50 flex items-center justify-center gap-3 transition-colors font-medium disabled:opacity-50"
    >
      <svg className="w-5 h-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34 6.5 29.3 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.4-.3-3.5z"/>
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8c1.8-4.3 6-7.5 10.9-7.5 3.1 0 5.9 1.2 8 3l5.7-5.7C34 6.5 29.3 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z"/>
        <path fill="#4CAF50" d="M24 43.5c5.2 0 9.9-2 13.4-5.3L31.2 33c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.2-8L6.2 32.5C9.6 38.4 16.3 43.5 24 43.5z"/>
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.8l6.2 5.2C40.9 35.8 43.5 30.3 43.5 24c0-1.2-.1-2.4-.3-3.5z"/>
      </svg>
      Continue with Google
    </button>
  );
}
