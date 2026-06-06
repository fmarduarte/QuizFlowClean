import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { AuthRequiredModal } from "@/components/auth/AuthRequiredModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { QuizResultCard } from "@/components/app/QuizResultCard";
import { useAuth } from "@/context/AuthContext";
import { useQuizzes } from "@/context/QuizzesContext";
import { loginLink } from "@/lib/auth-redirect";
import { AuthRequiredError, generateQuizFunnel } from "@/lib/quiz-generation";
import { PRODUCT_COPY } from "@/lib/product-copy";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

interface QuizGeneratePanelProps {
  variant?: "hero" | "page";
}

export function QuizGeneratePanel({ variant = "page" }: QuizGeneratePanelProps) {
  const { isAuthenticated, getAccessToken, loading: authLoading } = useAuth();
  const { addQuiz } = useQuizzes();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Awaited<ReturnType<typeof generateQuizFunnel>> | null>(
    null
  );
  const [savedQuizId, setSavedQuizId] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const isHero = variant === "hero";
  const generatorRedirect = `${ROUTES.app}${ROUTES.appSections.generator}`;

  function handleOpenBuilder() {
    if (!isAuthenticated) {
      navigate(loginLink(generatorRedirect));
      return;
    }
    navigate({ pathname: ROUTES.app, hash: ROUTES.appSections.generator });
  }

  async function handleGenerate() {
    if (authLoading) return;

    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }

    if (loading) return;

    setError(null);
    setResult(null);
    setSavedQuizId(null);
    setLoading(true);

    try {
      const generated = await generateQuizFunnel({
        title,
        description,
        accessToken: getAccessToken(),
      });

      const entry = addQuiz(generated);
      setResult(generated);
      setSavedQuizId(entry.id);
    } catch (err) {
      if (err instanceof AuthRequiredError) {
        setAuthModalOpen(true);
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "We couldn't generate your funnel. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AuthRequiredModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        redirectTo={generatorRedirect}
      />

      <div className={cn("w-full", isHero ? "max-w-xl mx-auto" : "max-w-2xl")}>
        {!isHero && (
          <div className="glass rounded-2xl p-6 sm:p-8 mb-8 space-y-5">
            <div className="space-y-2">
            <Label htmlFor="quiz-title">Funnel title</Label>
            <Input
              id="quiz-title"
              placeholder="e.g. Skincare Lead Gen Funnel"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
                className="bg-background/80 border-hairline h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quiz-desc">Describe your funnel</Label>
              <Textarea
                id="quiz-desc"
                placeholder="Audience, product, and goal for paid social…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                className="bg-background/80 border-hairline min-h-[120px] resize-none"
              />
            </div>
          </div>
        )}

        <div
          className={cn(
            "flex gap-3",
            isHero
              ? "flex-col sm:flex-row items-stretch sm:items-center justify-center"
              : "flex-col sm:flex-row"
          )}
        >
          <Button
            type="button"
            onClick={handleGenerate}
            disabled={loading || authLoading}
            aria-busy={loading}
            className={cn(
              "btn-glow h-12 px-6 rounded-xl font-medium text-white border-0 shadow-glow transition-all duration-300",
              loading
                ? "opacity-80 btn-shimmer"
                : "btn-shimmer hover:-translate-y-0.5 hover:shadow-elevated",
              isHero && "min-w-[220px]"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                {PRODUCT_COPY.funnel.generate}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
          {isHero ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleOpenBuilder}
              className="h-12 rounded-xl border-hairline glass"
            >
              Open {PRODUCT_COPY.funnel.builder.toLowerCase()}
            </Button>
          ) : null}
        </div>

        <div className={cn("min-h-[120px]", isHero ? "mt-8" : "mt-10")}>
          {error && (
            <div
              className="glass rounded-2xl p-5 border border-red-500/25 bg-red-500/10 text-sm text-red-200 animate-fade-in"
              role="alert"
            >
              {error}
            </div>
          )}

          {loading && (
            <div
              className="glass rounded-2xl p-8 flex flex-col items-center justify-center gap-4 animate-fade-in"
              role="status"
              aria-live="polite"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-accent-gradient opacity-30 blur-xl animate-pulse-glow" />
                <Loader2 className="relative h-10 w-10 text-violet-400 animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">AI is building your funnel…</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Writing steps, results & lead capture
                </p>
              </div>
              <div className="w-full max-w-xs h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-full bg-accent-gradient rounded-full origin-left quiz-progress-fill" />
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 justify-center sm:justify-start text-sm text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                Funnel generated and saved to your workspace
              </div>
              <QuizResultCard
                title={result.title}
                questions={result.questions}
                footer={
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      asChild
                      className="flex-1 rounded-xl border-hairline"
                    >
                      <a href={`${ROUTES.app}${ROUTES.appSections.saved}`}>
                        View {PRODUCT_COPY.funnel.myFunnels.toLowerCase()}
                      </a>
                    </Button>
                    {savedQuizId && (
                      <Button
                        type="button"
                        onClick={() => navigate(ROUTES.quizEdit(savedQuizId))}
                        className="flex-1 rounded-xl btn-shimmer text-white border-0 bg-accent-gradient shadow-glow"
                      >
                        Open in {PRODUCT_COPY.funnel.builder.toLowerCase()}
                      </Button>
                    )}
                  </div>
                }
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
