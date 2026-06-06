import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2, Mail } from "lucide-react";
import { AuthAlert } from "@/components/auth/AuthAlert";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { usePageMeta } from "@/hooks/use-page-meta";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { PAGE_META } from "@/lib/seo";
import { ROUTES } from "@/lib/routes";

export function ForgotPasswordPage() {
  usePageMeta({ ...PAGE_META.forgotPassword, canonical: ROUTES.forgotPassword });
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = await resetPassword(email.trim());

    setLoading(false);

    if (authError) {
      setError(getAuthErrorMessage(authError));
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <AuthShell
        badge="Check your inbox"
        title="Reset link sent"
        description="If an account exists for this email, you'll receive a password reset link shortly."
        footer={
          <p className="text-center text-sm text-muted-foreground">
            <Link
              to={ROUTES.login}
              className="inline-flex items-center gap-1.5 text-violet-300 hover:text-violet-200 font-medium transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to sign in
            </Link>
          </p>
        }
      >
        <div className="rounded-xl border border-hairline bg-surface-subtle/50 p-5 text-center space-y-3">
          <div className="mx-auto h-10 w-10 rounded-xl bg-violet-500/15 flex items-center justify-center">
            <Mail className="h-5 w-5 text-violet-300" aria-hidden />
          </div>
          <p className="text-sm text-foreground/90">
            We sent a reset link to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The link expires in 1 hour. Check spam if you don&apos;t see it. Click the link in the
            email to create a new password.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={loading}
          onClick={() => {
            setSent(false);
            setError(null);
          }}
          className="w-full mt-5 h-11 rounded-xl border-hairline"
        >
          Use a different email
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      badge="Account recovery"
      title="Reset your password"
      description="Enter your email and we'll send you a link to create a new password."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link
            to={ROUTES.login}
            className="text-violet-300 hover:text-violet-200 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" aria-busy={loading}>
        {error && <AuthAlert variant="error" message={error} />}

        <div className="space-y-2">
          <Label htmlFor="forgot-email">Email</Label>
          <Input
            id="forgot-email"
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

        <Button
          type="submit"
          disabled={loading || !email.trim()}
          className="w-full h-11 rounded-xl btn-shimmer text-white border-0 bg-accent-gradient shadow-glow font-medium"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending reset link…
            </>
          ) : (
            <>
              Send reset link
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </AuthShell>
  );
}
