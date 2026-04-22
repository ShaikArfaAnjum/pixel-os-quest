import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { AuthShell, GoogleButton } from "@/components/auth/AuthShell";

const schema = z.object({
  fullName: z.string().trim().min(2, "Enter your name").max(80),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "At least 8 characters").max(72),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, { message: "Passwords don't match", path: ["confirm"] });

function strengthOf(pw: string): { score: number; label: string; color: string } {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const labels = ["Too weak", "Weak", "Okay", "Strong", "Excellent"];
  const colors = ["bg-destructive", "bg-destructive", "bg-warning", "bg-secondary", "bg-primary"];
  return { score: s, label: labels[s], color: colors[s] };
}

export default function SignUp() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const strength = useMemo(() => strengthOf(password), [password]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) return toast.error("Please accept the terms to continue");
    const parsed = schema.safeParse({ fullName, email, password, confirm });
    if (!parsed.success) return toast.error(parsed.error.errors[0].message);

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          full_name: parsed.data.fullName,
          username: parsed.data.fullName.split(" ")[0] || parsed.data.email.split("@")[0],
        },
      },
    });
    setLoading(false);
    if (error) {
      if (error.message.toLowerCase().includes("registered")) toast.error("This email is already registered. Try signing in instead.");
      else toast.error(error.message);
      return;
    }
    toast.success("Account created! Welcome to OS.Quest 🎮");
    navigate("/dashboard", { replace: true });
  };

  const google = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) { setLoading(false); toast.error(error.message); }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Free forever. No credit card."
      footer={<>Already have an account? <Link to="/sign-in" className="text-primary hover:underline">Sign in</Link></>}
    >
      <GoogleButton onClick={google} loading={loading} />
      <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
        <div className="h-px bg-border flex-1" /> or <div className="h-px bg-border flex-1" />
      </div>

      <form onSubmit={submit} className="space-y-3.5">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="font-mono text-xs uppercase tracking-wider">Full name</Label>
          <Input id="name" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ada Lovelace" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="font-mono text-xs uppercase tracking-wider">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@school.edu" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pw" className="font-mono text-xs uppercase tracking-wider">Password</Label>
          <Input id="pw" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" />
          {password && (
            <div className="space-y-1">
              <div className="grid grid-cols-4 gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className={`h-1 rounded-full ${i < strength.score ? strength.color : "bg-muted"}`} />
                ))}
              </div>
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{strength.label}</div>
            </div>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirm" className="font-mono text-xs uppercase tracking-wider">Confirm password</Label>
          <Input id="confirm" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        <label className="flex items-start gap-2 text-xs text-muted-foreground">
          <Checkbox checked={agree} onCheckedChange={(c) => setAgree(!!c)} className="mt-0.5" />
          <span>I agree to the <a className="text-primary hover:underline" href="#">Terms</a> and <a className="text-primary hover:underline" href="#">Privacy Policy</a>.</span>
        </label>
        <Button type="submit" className="w-full h-11 font-mono uppercase tracking-wider" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}
