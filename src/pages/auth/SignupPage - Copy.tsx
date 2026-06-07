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
import { ROUTES } from "@/lib/routes";

export function SignupPage() {
  usePageMeta({ ...PAGE_META.signup, canonical: ROUTES.signup });
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: string } | null)?.from ??
    ROUTES.app;

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
      setError("Passwords do not match. Please try again.");
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
      setError(getAuthErrorMessage(authError));
      return;
    }

    setSuccess(
      "Account created! Check your email to confirm your address, then sign in to start building."
    );

    setTimeout(() => {
      navigate(ROUTES.login, { replace: true, state: { from } });
    }, 2800);
  }

  return (
    <AuthShell
      badge="Get started free"
      title="Create your account"
      description="Start building AI funnels for paid social in minutes"
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to={{ pathname: ROUTES.login, state: { from } }}
            className="text-violet-300 hover:text-violet-200 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" aria-busy={loading}>
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
            autoFocus
            className="h-11 rounded-xl border-hairline bg-background/80"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <PasswordInput
            id="signup-password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            placeholder="Min. 6 characters"
            disabled={loading || !!success}
            minLength={6}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-confirm">Confirm password</Label>
          <PasswordInput
            id="signup-confirm"
            value={confirmPassword}
            onChange={setConfirmPassword}
            autoComplete="new-password"
            placeholder="Repeat password"
            disabled={loading || !!success}
            minLength={6}
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading || !!success || !email.trim() || !password || !confirmPassword}
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
    </AuthShell>
  );
}
