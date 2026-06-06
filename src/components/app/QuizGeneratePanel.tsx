import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { AIBriefInput } from "@/components/app/AIBriefInput";
import { ExtractedBriefSummary } from "@/components/app/ExtractedBriefSummary";
import { AuthRequiredModal } from "@/components/auth/AuthRequiredModal";
import { LanguageChoiceModal } from "@/components/app/LanguageChoiceModal";
import { QuizResultCard } from "@/components/app/QuizResultCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useQuizzes } from "@/context/QuizzesContext";
import { loginLink } from "@/lib/auth-redirect";
import { extractBriefFromNarrative } from "@/lib/brief-extract";
import { analyzeFunnelReadiness } from "@/lib/funnel-readiness";
import { saveFunnelBriefToSupabase } from "@/lib/funnel-brief-store";
import { detectBriefLanguage } from "@/lib/language-detect";
import { mockTranslateAndOptimize, mockTranslateText } from "@/lib/mock-translate";
import { AuthRequiredError, generateQuizFunnel } from "@/lib/quiz-generation";
import {
  createFunnelBrief,
  EMPTY_FUNNEL_BRIEF,
  type FunnelBriefValues,
} from "@/lib/funnel-brief";
import type { LanguageMode } from "@/types/funnel-brief";
import { PRODUCT_COPY } from "@/lib/product-copy";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

interface QuizGeneratePanelProps {
  variant?: "hero" | "page";
  initialFunnelType?: string;
  aiBriefOnly?: boolean;
}

export function QuizGeneratePanel({
  variant = "page",
  initialFunnelType,
  aiBriefOnly = false,
}: QuizGeneratePanelProps) {
  const { user, isAuthenticated, getAccessToken, loading: authLoading } = useAuth();
  const { addQuiz, updateQuiz } = useQuizzes();
  const navigate = useNavigate();

  const [narrative, setNarrative] = useState("");
  const [values, setValues] = useState<FunnelBriefValues>(EMPTY_FUNNEL_BRIEF);
  const [showExtracted, setShowExtracted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Awaited<ReturnType<typeof generateQuizFunnel>> | null>(
    null
  );
  const [savedQuizId, setSavedQuizId] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [detectedLanguageLabel, setDetectedLanguageLabel] = useState("Portuguese");
  const [pendingGeneration, setPendingGeneration] = useState<FunnelBriefValues | null>(null);

  const isHero = variant === "hero";
  const generatorRedirect = ROUTES.appCreate;

  useEffect(() => {
    if (initialFunnelType) {
      setValues((prev) => ({ ...prev, funnelType: initialFunnelType }));
    }
  }, [initialFunnelType]);

  const readiness = useMemo(
    () => analyzeFunnelReadiness(narrative, values.funnelType),
    [narrative, values.funnelType]
  );

  const language = useMemo(
    () =>
      detectBriefLanguage({
        ...values,
        businessNiche: narrative,
        productOffer: narrative,
        targetAudience: narrative,
        goal: narrative,
      }),
    [narrative, values]
  );

  function handleOpenBuilder() {
    if (!isAuthenticated) {
      navigate(loginLink(generatorRedirect));
      return;
    }
    navigate(ROUTES.appCreate);
  }

  async function runGeneration(languageMode: LanguageMode, generationValues: FunnelBriefValues) {
    setLanguageModalOpen(false);
    setError(null);
    setResult(null);
    setSavedQuizId(null);
    setLoading(true);

    try {
      const brief = createFunnelBrief({
        originalValues: values,
        generationValues,
        languageMode,
        detectedLanguage: language,
      });

      const generated = await generateQuizFunnel({
        brief,
        accessToken: getAccessToken(),
      });

      const entry = addQuiz(generated);
      let finalResult = generated;

      if (user?.id) {
        const supabaseId = await saveFunnelBriefToSupabase({
          brief: generated.brief,
          userId: user.id,
          quizId: entry.id,
        });
        if (supabaseId) {
          const briefWithId = { ...generated.brief, supabaseId };
          updateQuiz(entry.id, { brief: briefWithId });
          finalResult = { ...generated, brief: briefWithId };
        }
      }

      setResult(finalResult);
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
      setPendingGeneration(null);
    }
  }

  function proceedToGeneration(generationValues: FunnelBriefValues) {
    setDetectedLanguageLabel(language.label);

    if (!language.isEnglish && language.isReliable) {
      setPendingGeneration(generationValues);
      setLanguageModalOpen(true);
      return;
    }

    void runGeneration("original", generationValues);
  }

  function handleGenerate() {
    if (authLoading || loading) return;

    if (!readiness.canGenerate) {
      const firstMissing = readiness.missingInfo[0];
      const firstWarning = readiness.viabilityWarnings[0];
      setError(
        firstWarning ??
          firstMissing?.whyItMatters ??
          "Add more detail about your offer, audience, and goal before generating."
      );
      return;
    }

    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }

    setError(null);

    const trimmed = narrative.trim();
    const extracted = extractBriefFromNarrative(trimmed, values.funnelType);
    const merged: FunnelBriefValues = {
      ...values,
      businessNiche: extracted.businessNiche || readiness.business.value || trimmed.slice(0, 80),
      productOffer: extracted.productOffer || readiness.offer.value || trimmed.slice(0, 200),
      targetAudience: extracted.targetAudience || readiness.audience.value || "",
      goal: extracted.goal || readiness.goal.value || "",
    };

    setValues(merged);
    setShowExtracted(true);
    proceedToGeneration(merged);
  }

  function handleTranslateAndOptimize() {
    if (!pendingGeneration) return;
    const translatedNarrative = mockTranslateText(narrative);
    setNarrative(translatedNarrative);
    const extracted = extractBriefFromNarrative(translatedNarrative, values.funnelType);
    const merged = { ...pendingGeneration, ...extracted };
    setValues(merged);
    void runGeneration("translated", mockTranslateAndOptimize(merged));
  }

  function handleContinueOriginal() {
    if (!pendingGeneration) return;
    void runGeneration("original", pendingGeneration);
  }

  const canGenerate = readiness.canGenerate && !loading && !authLoading;

  if (aiBriefOnly) {
    return (
      <>
        <AuthRequiredModal
          open={authModalOpen}
          onOpenChange={setAuthModalOpen}
          redirectTo={generatorRedirect}
        />

        <LanguageChoiceModal
          open={languageModalOpen}
          languageLabel={detectedLanguageLabel}
          onTranslateOptimize={handleTranslateAndOptimize}
          onContinueOriginal={handleContinueOriginal}
          onOpenChange={setLanguageModalOpen}
        />

        <div className="space-y-8">
          {!showExtracted && (
            <AIBriefInput
              value={narrative}
              readiness={readiness}
              onChange={(v) => {
                setNarrative(v);
                setError(null);
              }}
              disabled={loading}
            />
          )}

          {showExtracted && !result && (
            <ExtractedBriefSummary
              values={{
                businessNiche: values.businessNiche,
                productOffer: values.productOffer,
                targetAudience: values.targetAudience,
                goal: values.goal,
              }}
            />
          )}

          {!showExtracted && (
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={!canGenerate}
              aria-busy={loading}
              className={cn(
                "h-12 w-full rounded-xl font-medium text-white border-0 transition-all",
                canGenerate
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-white/10 text-white/40 cursor-not-allowed"
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
                </>
              )}
            </Button>
          )}

          {error && (
            <p className="text-sm text-muted-foreground/70 text-center" role="alert">
              {error}
            </p>
          )}

          {(loading || result) && (
            <div className="space-y-6 pt-4 animate-fade-in">
              {loading && (
                <div className="flex flex-col items-center gap-4 py-8" role="status" aria-live="polite">
                  <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
                  <p className="text-sm text-muted-foreground/60">Building your funnel…</p>
                </div>
              )}

              {result && !loading && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 text-sm text-emerald-400/90">
                    <CheckCircle2 className="h-4 w-4" />
                    Funnel ready
                  </div>
                  <QuizResultCard
                    title={result.title}
                    questions={result.questions}
                    brief={result.brief}
                    footer={
                      savedQuizId ? (
                        <Button
                          type="button"
                          onClick={() => navigate(ROUTES.quizEdit(savedQuizId))}
                          className="w-full rounded-xl bg-white text-black hover:bg-white/90 h-11 font-medium"
                        >
                          Open in builder
                        </Button>
                      ) : undefined
                    }
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <AuthRequiredModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        redirectTo={generatorRedirect}
      />

      <div className={cn("w-full", isHero ? "max-w-xl mx-auto" : "")}>
        <AIBriefInput
          value={narrative}
          readiness={readiness}
          onChange={setNarrative}
          disabled={loading}
        />

        <div className="flex gap-3 mt-8 flex-col sm:flex-row items-stretch sm:items-center justify-center">
          <Button
            type="button"
            onClick={handleGenerate}
            disabled={!canGenerate}
            className={cn(
              "h-12 px-6 rounded-xl font-medium",
              canGenerate
                ? "bg-white text-black hover:bg-white/90"
                : "bg-muted text-muted-foreground"
            )}
          >
            <Sparkles className="h-4 w-4" />
            {PRODUCT_COPY.funnel.generate}
          </Button>
          {isHero && (
            <Button
              type="button"
              variant="outline"
              onClick={handleOpenBuilder}
              className="h-12 rounded-xl border-hairline"
            >
              Open {PRODUCT_COPY.funnel.builder.toLowerCase()}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
