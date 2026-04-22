import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/store/auth";
import { useProgress, ACHIEVEMENTS, XP_PER_LEVEL_VALUE } from "@/store/progress";
import { LEVELS } from "@/data/levels";
import { CHAPTERS } from "@/data/chapters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, LogOut, Mail, Save, Shield, Sparkles, Trophy, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { username, setUsername, xp, level, unlocked, completedLessons, progressInLevel } = useProgress();

  const [name, setName] = useState(username);
  const [emailNotif, setEmailNotif] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [updatingPw, setUpdatingPw] = useState(false);

  useEffect(() => setName(username), [username]);

  const saveProfile = async () => {
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 40) return toast.error("Username must be 2-40 characters");
    setSaving(true);
    setUsername(trimmed);
    setSaving(false);
    toast.success("Profile updated");
  };

  const changePassword = async () => {
    if (pw.length < 8) return toast.error("Password must be at least 8 characters");
    if (pw !== pw2) return toast.error("Passwords don't match");
    setUpdatingPw(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setUpdatingPw(false);
    if (error) return toast.error(error.message);
    setPw(""); setPw2("");
    toast.success("Password updated");
  };

  const doSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const pct = (progressInLevel / XP_PER_LEVEL_VALUE) * 100;
  const currentLevel = LEVELS[Math.min(level - 1, LEVELS.length - 1)];

  // Chapter progress (heuristic from completed lessons + level)
  const chapterProgress = CHAPTERS.map((ch) => {
    const total = ch.scenes?.length ?? 1;
    const done = Math.min(total, [...completedLessons].filter((l) => l.startsWith(`ch-${ch.id}`)).length);
    return { id: ch.id, title: ch.title, pct: Math.round((done / total) * 100), done, total };
  });

  const initial = (username || user?.email || "U").slice(0, 1).toUpperCase();

  return (
    <AppLayout>
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 md:p-8 mb-6 relative overflow-hidden scanline">
        <div className="absolute -top-12 -right-12 w-60 h-60 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-60 h-60 bg-accent/20 rounded-full blur-3xl" />
        <div className="relative flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent p-0.5 animate-pulse-glow shrink-0">
            <div className="w-full h-full rounded-[14px] bg-card flex items-center justify-center font-display font-bold text-5xl text-gradient-cyber">
              {initial}
            </div>
          </div>
          <div className="flex-1 w-full">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-3xl font-bold">{username}</h1>
              <Badge className="bg-accent text-accent-foreground font-mono">LV {level}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{currentLevel.title} · {currentLevel.subtitle}</p>
            {user?.email && <p className="text-xs font-mono text-muted-foreground mt-1 flex items-center gap-1"><Mail className="w-3 h-3" /> {user.email}</p>}

            <div className="mt-4 space-y-1.5 max-w-md">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-secondary flex items-center gap-1"><Zap className="w-3 h-3" /> {xp} XP</span>
                <span className="text-muted-foreground">{XP_PER_LEVEL_VALUE - progressInLevel} XP to LV {level + 1}</span>
              </div>
              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary via-secondary to-accent" style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="font-mono">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatBox label="LESSONS" value={completedLessons.size} icon={Sparkles} color="primary" />
            <StatBox label="BADGES" value={unlocked.size} icon={Trophy} color="accent" />
            <StatBox label="LEVEL" value={level} icon={Zap} color="secondary" />
            <StatBox label="XP" value={xp} icon={Zap} color="primary" />
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {ACHIEVEMENTS.map((a) => {
              const got = unlocked.has(a.id);
              return (
                <div key={a.id} className={`rounded-xl p-4 text-center border transition-all ${got ? "border-primary/50 bg-primary/5 shadow-[0_0_20px_hsl(var(--primary)/0.2)]" : "border-border bg-muted/20 opacity-50 grayscale"}`}>
                  <div className={`text-4xl mb-2 ${got ? "animate-float" : ""}`}>{a.icon}</div>
                  <div className="font-mono text-xs uppercase tracking-wider font-bold">{a.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{a.description}</div>
                  {got && <Badge variant="secondary" className="mt-2 text-[10px] font-mono">UNLOCKED</Badge>}
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-3">
          {chapterProgress.map((ch) => (
            <div key={ch.id} className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-display font-bold">{ch.title}</div>
                <div className="font-mono text-xs text-muted-foreground">{ch.done}/{ch.total} · {ch.pct}%</div>
              </div>
              <Progress value={ch.pct} className="h-2" />
            </div>
          ))}
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="glass-card rounded-xl p-5 space-y-4">
            <h3 className="font-display font-bold uppercase tracking-wider text-sm">Edit profile</h3>
            <div className="space-y-1.5">
              <Label htmlFor="username" className="font-mono text-xs uppercase tracking-wider">Username</Label>
              <Input id="username" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} />
            </div>
            <Button onClick={saveProfile} disabled={saving} className="font-mono uppercase tracking-wider">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save changes
            </Button>
          </div>

          <div className="glass-card rounded-xl p-5 space-y-4">
            <h3 className="font-display font-bold uppercase tracking-wider text-sm flex items-center gap-2"><Shield className="w-4 h-4" /> Change password</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="pw" className="font-mono text-xs uppercase tracking-wider">New password</Label>
                <Input id="pw" type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pw2" className="font-mono text-xs uppercase tracking-wider">Confirm</Label>
                <Input id="pw2" type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} />
              </div>
            </div>
            <Button onClick={changePassword} disabled={updatingPw} variant="secondary" className="font-mono uppercase tracking-wider">
              {updatingPw ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Update password
            </Button>
          </div>

          <div className="glass-card rounded-xl p-5 space-y-3">
            <h3 className="font-display font-bold uppercase tracking-wider text-sm">Preferences</h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Email notifications</div>
                <div className="text-xs text-muted-foreground">Daily challenge reminders, leaderboard updates</div>
              </div>
              <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
            </div>
          </div>

          <div className="glass-card rounded-xl p-5 border-destructive/30">
            <h3 className="font-display font-bold uppercase tracking-wider text-sm text-destructive mb-2">Danger zone</h3>
            <p className="text-xs text-muted-foreground mb-3">Sign out of your account. Your progress is safe and will sync next time you log in.</p>
            <Button onClick={doSignOut} variant="destructive" className="font-mono uppercase tracking-wider">
              <LogOut className="w-4 h-4" /> Sign out
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}

function StatBox({ label, value, icon: Icon, color }: { label: string; value: any; icon: any; color: string }) {
  const c = color === "primary" ? "text-primary border-primary/30" : color === "secondary" ? "text-secondary border-secondary/30" : "text-accent border-accent/30";
  return (
    <div className={`glass-card rounded-xl p-4 border ${c}`}>
      <Icon className={`w-5 h-5 mb-1 ${c}`} />
      <div className={`font-display font-bold text-2xl ${c}`}>{value}</div>
      <div className="text-[10px] font-mono text-muted-foreground tracking-widest">{label}</div>
    </div>
  );
}
