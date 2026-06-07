import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { AuthAlert } from "@/components/auth/AuthAlert";
import { AuthShell } from "@/components/auth/AuthShell";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { usePageMeta } from "@/hooks/use-page-meta";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { PAGE_META } from "@/lib/seo";
import { ROUTES } from "@/lib/routes";

export function ResetPasswordPage() {
  usePageMeta({ ...PAGE_META.resetPassword, canonical: ROUTES.resetPassword });
  const { session, loading: authLoading, updatePassword } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    const hash = window.location.hash;
    const hasRecoveryToken =
      hash.includes("type=recovery") || hash.includes("access_token");

    if (session || hasRecoveryToken) {
      setReady(true);
      return;
    }

    setReady(false);
  }, [authLoading, session]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    setLoading(true);
    const { error: authError } = await updatePassword(password);
    setLoading(false);

    if (authError) {
      setError(getAuthErrorMessage(authError));
      return;
    }

    navigate(ROUTES.app, { replace: true });
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 text-violet-400 animate-spin" aria-label="Loading" />
      </div>
    );
  }

  if (!ready) {
    return (
      <AuthShell
        badge="Link expired"
        title="Reset link invalid"
        description="This password reset link has expired or has already been used."
        footer={
          <p className="text-center text-sm text-muted-foreground">
            <Link
              to={ROUTES.forgotPassword}
              className="text-violet-300 hover:text-violet-200 font-medium transition-colors"
            >
              Request a new reset link
            </Link>
          </p>
        }
      >
        <AuthAlert
          variant="error"
          message="For your security, reset links expire after a short time. Request a new one to continue."
        />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      badge="Almost done"
      title="Create new password"
      description="Choose a strong password for your QuizFlow AI account."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          <Link
            to={ROUTES.login}
            className="text-violet-300 hover:text-violet-200 font-medium transition-colors"
          >
            Back to sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" aria-busy={loading}>
        {error && <AuthAlert variant="error" message={error} />}

        <div className="space-y-2">
          <Label htmlFor="reset-password">New password</Label>
          <PasswordInput
            id="reset-password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            placeholder="Min. 6 characters"
            disabled={loading}
            minLength={6}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reset-confirm">Confirm new password</Label>
          <PasswordInput
            id="reset-confirm"
            value={confirmPassword}
            onChange={setConfirmPassword}
            autoComplete="new-password"
            placeholder="Repeat password"
            disabled={loading}
            minLength={6}
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading || !password || !confirmPassword}
          className="w-full h-11 rounded-xl btn-shimmer text-white border-0 bg-accent-gradient shadow-glow font-medium"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Updating password…
            </>
          ) : (
            <>
              Update password
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </AuthShell>
  );
}
