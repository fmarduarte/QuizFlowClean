import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { AIConfidenceSummary } from "@/components/app/onboarding/AIConfidenceSummary";
import { OnboardingOptionGrid } from "@/components/app/onboarding/OnboardingOptionGrid";
import { OnboardingProgress } from "@/components/app/onboarding/OnboardingProgress";
import { AuthRequiredModal } from "@/components/auth/AuthRequiredModal";
import { LanguageChoiceModal } from "@/components/app/LanguageChoiceModal";
import { QuizResultCard } from "@/components/app/QuizResultCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useQuizzes } from "@/context/QuizzesContext";
import { computeAIConfidence } from "@/lib/ai-confidence";
import { saveFunnelBriefToSupabase } from "@/lib/funnel-brief-store";
import { createFunnelBrief, type FunnelBriefValues } from "@/lib/funnel-brief";
import { detectBriefLanguage } from "@/lib/language-detect";
import { mockTranslateAndOptimize, mockTranslateText } from "@/lib/mock-translate";
import {
  buildBriefFromOnboarding,
  buildOnboardingNarrative,
  EMPTY_ONBOARDING,
  ONBOARDING_ACTIONS,
  ONBOARDING_CUSTOMER_TYPES,
  ONBOARDING_FUNNEL_TYPES,
  ONBOARDING_PRODUCT_TYPES,
  type OnboardingAnswers,
} from "@/lib/onboarding-options";
import { AuthRequiredError, generateQuizFunnel } from "@/lib/quiz-generation";
import { PRODUCT_COPY } from "@/lib/product-copy";
import { ROUTES } from "@/lib/routes";
import type { LanguageMode } from "@/types/funnel-brief";
import { cn } from "@/lib/utils";

const STEP_TITLES = [
  "What do you want to create?",
  "What are you selling?",
  "Who is your customer?",
  "What do you want them to do?",
  "Optional details",
] as const;

export function OnboardingWizard() {
  const { user, isAuthenticated, getAccessToken, loading: authLoading } = useAuth();
  const { addQuiz, updateQuiz } = useQuizzes();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<OnboardingAnswers>(EMPTY_ONBOARDING);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Awaited<ReturnType<typeof generateQuizFunnel>> | null>(null);
  const [savedQuizId, setSavedQuizId] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [detectedLanguageLabel, setDetectedLanguageLabel] = useState("Portuguese");
  const [pendingGeneration, setPendingGeneration] = useState<FunnelBriefValues | null>(null);

  const confidence = useMemo(() => computeAIConfidence(answers), [answers]);

  const briefValues = useMemo(() => buildBriefFromOnboarding(answers), [answers]);

  const language = useMemo(
    () => detectBriefLanguage(briefValues),
    [briefValues]
  );

  function updateAnswers(patch: Partial<OnboardingAnswers>) {
    setAnswers((prev) => ({ ...prev, ...patch }));
    setError(null);
  }

  function canAdvanceFromStep(current: number): boolean {
    switch (current) {
      case 1:
        return Boolean(answers.funnelType);
      case 2:
        if (!answers.productType) return false;
        if (answers.productType === "other") return answers.productOther.trim().length >= 2;
        return true;
      case 3:
        if (!answers.customerType) return false;
        if (answers.customerType === "other") return answers.customerOther.trim().length >= 2;
        return true;
      case 4:
        return Boolean(answers.action);
      case 5:
        return confidence.canGenerate;
      default:
        return false;
    }
  }

  function handleBack() {
    if (step > 1) {
      setStep((s) => s - 1);
      setError(null);
    }
  }

  function handleContinue() {
    if (!canAdvanceFromStep(step)) return;
    if (step < 5) {
      setStep((s) => s + 1);
      return;
    }
    handleGenerate();
  }

  async function runGeneration(languageMode: LanguageMode, generationValues: FunnelBriefValues) {
    setLanguageModalOpen(false);
    setError(null);
    setResult(null);
    setSavedQuizId(null);
    setLoading(true);

    try {
      const brief = createFunnelBrief({
        originalValues: briefValues,
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

    if (!confidence.canGenerate) {
      setError(confidence.missingHint ?? confidence.message);
      return;
    }

    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }

    proceedToGeneration(briefValues);
  }

  function handleTranslateAndOptimize() {
    if (!pendingGeneration) return;
    const narrative = buildOnboardingNarrative(answers);
    const translated = mockTranslateText(narrative);
    updateAnswers({ details: translated });
    void runGeneration("translated", mockTranslateAndOptimize(pendingGeneration));
  }

  function handleContinueOriginal() {
    if (!pendingGeneration) return;
    void runGeneration("original", pendingGeneration);
  }

  if (result && !loading) {
    return (
      <div className="max-w-lg mx-auto w-full space-y-6 animate-fade-in">
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
    );
  }

  return (
    <>
      <AuthRequiredModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        redirectTo={ROUTES.app}
      />

      <LanguageChoiceModal
        open={languageModalOpen}
        languageLabel={detectedLanguageLabel}
        onTranslateOptimize={handleTranslateAndOptimize}
        onContinueOriginal={handleContinueOriginal}
        onOpenChange={setLanguageModalOpen}
      />

      <div className="max-w-lg mx-auto w-full">
        <div className="mb-10 sm:mb-14">
          <OnboardingProgress currentStep={step} />
        </div>

        {step > 1 && (
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/45 hover:text-muted-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
        )}

        <header className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-[1.65rem] font-semibold tracking-tight text-foreground/95">
            {STEP_TITLES[step - 1]}
          </h1>
          {step === 5 && (
            <p className="mt-2 text-sm text-muted-foreground/50 leading-relaxed">
              Add anything that helps — your offer name, price point, or unique angle.
            </p>
          )}
        </header>

        <div className="space-y-8">
          {step === 1 && (
            <OnboardingOptionGrid
              options={ONBOARDING_FUNNEL_TYPES}
              selected={answers.funnelType}
              onSelect={(id) => updateAnswers({ funnelType: id })}
            />
          )}

          {step === 2 && (
            <>
              <OnboardingOptionGrid
                options={ONBOARDING_PRODUCT_TYPES}
                selected={answers.productType}
                onSelect={(id) => updateAnswers({ productType: id, productOther: "" })}
                columns={3}
              />
              {answers.productType === "other" && (
                <Input
                  value={answers.productOther}
                  onChange={(e) => updateAnswers({ productOther: e.target.value })}
                  placeholder="e.g. Membership community"
                  className="h-11 rounded-xl border-white/[0.08] bg-transparent text-sm"
                  autoFocus
                />
              )}
            </>
          )}

          {step === 3 && (
            <>
              <OnboardingOptionGrid
                options={ONBOARDING_CUSTOMER_TYPES}
                selected={answers.customerType}
                onSelect={(id) => updateAnswers({ customerType: id, customerOther: "" })}
                columns={3}
              />
              {answers.customerType === "other" && (
                <Input
                  value={answers.customerOther}
                  onChange={(e) => updateAnswers({ customerOther: e.target.value })}
                  placeholder="e.g. Real estate investors"
                  className="h-11 rounded-xl border-white/[0.08] bg-transparent text-sm"
                  autoFocus
                />
              )}
            </>
          )}

          {step === 4 && (
            <OnboardingOptionGrid
              options={ONBOARDING_ACTIONS}
              selected={answers.action}
              onSelect={(id) => updateAnswers({ action: id })}
              columns={3}
            />
          )}

          {step === 5 && (
            <>
              <Textarea
                value={answers.details}
                onChange={(e) => updateAnswers({ details: e.target.value })}
                placeholder="e.g. AI Hook Generator — $29/mo free trial for new users"
                rows={3}
                className={cn(
                  "min-h-[88px] text-sm leading-relaxed resize-none",
                  "bg-transparent border border-white/[0.08] rounded-xl",
                  "focus-visible:ring-1 focus-visible:ring-white/15 placeholder:text-muted-foreground/35"
                )}
              />
              <AIConfidenceSummary result={confidence} />
            </>
          )}

          {error && (
            <p className="text-sm text-muted-foreground/60 text-center" role="alert">
              {error}
            </p>
          )}

          <Button
            type="button"
            onClick={handleContinue}
            disabled={!canAdvanceFromStep(step) || loading || authLoading}
            aria-busy={loading}
            className={cn(
              "h-12 w-full rounded-xl font-medium border-0 transition-all",
              canAdvanceFromStep(step) && !loading
                ? "bg-white text-black hover:bg-white/90"
                : "bg-white/10 text-white/40 cursor-not-allowed"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating…
              </>
            ) : step === 5 ? (
              <>
                <Sparkles className="h-4 w-4" />
                {PRODUCT_COPY.funnel.generate}
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
