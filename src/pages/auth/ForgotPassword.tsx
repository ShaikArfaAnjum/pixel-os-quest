import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Mail } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";

const schema = z.object({ email: z.string().trim().email("Enter a valid email").max(255) });

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email });
    if (!parsed.success) return toast.error(parsed.error.errors[0].message);
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    setSent(true);
  };

  return (
    <AuthShell
      title="Reset your password"
      subtitle="We'll email you a link to set a new password"
      footer={<><Link to="/sign-in" className="text-primary hover:underline">Back to sign in</Link></>}
    >
      {sent ? (
        <div className="text-center py-6 space-y-2">
          <CheckCircle2 className="w-12 h-12 mx-auto text-primary" />
          <p className="font-display text-lg">Check your inbox</p>
          <p className="text-sm text-muted-foreground">If an account exists for <span className="text-foreground">{email}</span>, you'll get a reset link shortly.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="font-mono text-xs uppercase tracking-wider">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@school.edu" />
          </div>
          <Button type="submit" className="w-full h-11 font-mono uppercase tracking-wider" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            Send reset link
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
