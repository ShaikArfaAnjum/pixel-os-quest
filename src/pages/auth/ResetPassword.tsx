import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, KeyRound } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";

const schema = z.object({
  password: z.string().min(8, "At least 8 characters").max(72),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, { message: "Passwords don't match", path: ["confirm"] });

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase handles the recovery hash automatically and emits PASSWORD_RECOVERY
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    // Also accept if we already have a session from the link
    supabase.auth.getSession().then(({ data: { session } }) => session && setReady(true));
    return () => data.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ password, confirm });
    if (!parsed.success) return toast.error(parsed.error.errors[0].message);
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated. Welcome back!");
    navigate("/dashboard", { replace: true });
  };

  return (
    <AuthShell
      title="Set a new password"
      subtitle={ready ? "Choose something strong" : "Verifying your reset link…"}
      footer={<><Link to="/sign-in" className="text-primary hover:underline">Back to sign in</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="pw" className="font-mono text-xs uppercase tracking-wider">New password</Label>
          <Input id="pw" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirm" className="font-mono text-xs uppercase tracking-wider">Confirm password</Label>
          <Input id="confirm" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        <Button type="submit" className="w-full h-11 font-mono uppercase tracking-wider" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
          Update password
        </Button>
      </form>
    </AuthShell>
  );
}
