import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { AuthAlert } from "@/components/auth/AuthAlert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/routes";

export function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const { error: authError } = await signUp(email.trim(), password);
    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    setSuccess(
      "Account created! Check your email to confirm, or sign in if confirmation is disabled."
    );

    setTimeout(() => navigate(ROUTES.login, { replace: true }), 2500);
  }

  return (
    <div className="w-full max-w-md animate-fade-up">
      <div className="glass-strong rounded-2xl border border-hairline p-8 sm:p-10 shadow-elevated">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-hairline bg-surface-elevated text-xs font-medium mb-4">
            <Sparkles className="h-3 w-3 text-violet-400" />
            Get started free
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gradient">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Start building AI quiz funnels in minutes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <AuthAlert variant="error" message={error} />}
          {success && <AuthAlert variant="success" message={success} />}

          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading || !!success}
              className="h-11 rounded-xl border-hairline bg-background/80"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <Input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading || !!success}
              minLength={6}
              className="h-11 rounded-xl border-hairline bg-background/80"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-confirm">Confirm password</Label>
            <Input
              id="signup-confirm"
              type="password"
              autoComplete="new-password"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading || !!success}
              minLength={6}
              className="h-11 rounded-xl border-hairline bg-background/80"
            />
          </div>

          <Button
            type="submit"
            disabled={loading || !!success}
            className="w-full h-11 rounded-xl btn-shimmer text-white border-0 bg-accent-gradient shadow-glow font-medium"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account…
              </>
            ) : (
              <>
                Create account
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to={ROUTES.login}
            className="text-violet-300 hover:text-violet-200 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
