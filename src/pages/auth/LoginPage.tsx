import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { AuthAlert } from "@/components/auth/AuthAlert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/routes";

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? ROUTES.app;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = await signIn(email.trim(), password);

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    navigate(from, { replace: true });
  }

  return (
    <div className="w-full max-w-md animate-fade-up">
      <div className="glass-strong rounded-2xl border border-hairline p-8 sm:p-10 shadow-elevated">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-hairline bg-surface-elevated text-xs font-medium mb-4">
            <Sparkles className="h-3 w-3 text-violet-400" />
            Welcome back
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gradient">
            Sign in to QuizFlow AI
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Access your quiz funnels and AI workspace
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <AuthAlert variant="error" message={error} />}

          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="h-11 rounded-xl border-hairline bg-background/80"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
              className="h-11 rounded-xl border-hairline bg-background/80"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl btn-shimmer text-white border-0 bg-accent-gradient shadow-glow font-medium"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                Sign in
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            to={ROUTES.signup}
            className="text-violet-300 hover:text-violet-200 font-medium transition-colors"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
