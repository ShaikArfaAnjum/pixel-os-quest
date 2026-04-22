import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, LogIn } from "lucide-react";
import { AuthShell, GoogleButton } from "@/components/auth/AuthShell";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation() as { state: { from?: string } };
  const from = location.state?.from || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setLoading(false);
    if (error) {
      toast.error(error.message.includes("Invalid") ? "Invalid email or password" : error.message);
      return;
    }
    toast.success("Welcome back, cadet 🚀");
    navigate(from, { replace: true });
  };

  const google = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue your quest"
      footer={<>New here? <Link to="/sign-up" className="text-primary hover:underline">Create an account</Link></>}
    >
      <GoogleButton onClick={google} loading={loading} />

      <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
        <div className="h-px bg-border flex-1" /> or <div className="h-px bg-border flex-1" />
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="font-mono text-xs uppercase tracking-wider">Email</Label>
          <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@school.edu" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="font-mono text-xs uppercase tracking-wider">Password</Label>
            <Link to="/forgot-password" className="text-xs text-secondary hover:underline">Forgot password?</Link>
          </div>
          <Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <Checkbox checked={remember} onCheckedChange={(c) => setRemember(!!c)} />
          Remember me
        </label>
        <Button type="submit" className="w-full h-11 font-mono uppercase tracking-wider" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
          Sign in
        </Button>
      </form>
    </AuthShell>
  );
}
