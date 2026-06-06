import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { AuthAlert } from "@/components/auth/AuthAlert";
import { AuthShell } from "@/components/auth/AuthShell";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { usePageMeta } from "@/hooks/use-page-meta";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { PAGE_META } from "@/lib/seo";
import { parseRedirectTarget } from "@/lib/auth-redirect";
import { ROUTES } from "@/lib/routes";

export function LoginPage() {
  usePageMeta({ ...PAGE_META.login, canonical: ROUTES.login });
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: string } | null)?.from ??
    `${ROUTES.app}${ROUTES.appSections.generator}`;

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
      setError(getAuthErrorMessage(authError));
      return;
    }

    navigate(parseRedirectTarget(from), { replace: true });
  }

  return (
    <AuthShell
      badge="Welcome back"
      title="Sign in to QuizFlow AI"
      description="Access your funnels and AI workspace"
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            to={ROUTES.signup}
            className="text-violet-300 hover:text-violet-200 font-medium transition-colors"
          >
            Create account
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" aria-busy={loading}>
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
            autoFocus
            className="h-11 rounded-xl border-hairline bg-background/80"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="login-password">Password</Label>
            <Link
              to={ROUTES.forgotPassword}
              className="text-xs text-muted-foreground hover:text-violet-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="login-password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            disabled={loading}
            minLength={6}
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading || !email.trim() || !password}
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
    </AuthShell>
  );
}
