import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { AuthRequiredModal } from "@/components/auth/AuthRequiredModal";
import { BriefPreGenerationReview } from "@/components/app/BriefPreGenerationReview";
import { BriefReviewPanel } from "@/components/app/BriefReviewPanel";
import { FieldCoachHint, FieldExample } from "@/components/app/FieldCoachHint";
import { FieldHelpTooltip } from "@/components/app/FieldHelpTooltip";
import { LanguageChoiceModal } from "@/components/app/LanguageChoiceModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QuizResultCard } from "@/components/app/QuizResultCard";
import { useAuth } from "@/context/AuthContext";
import { useQuizzes } from "@/context/QuizzesContext";
import { loginLink } from "@/lib/auth-redirect";
import { saveFunnelBriefToSupabase } from "@/lib/funnel-brief-store";
import { analyzeBriefProtection } from "@/lib/brief-protection";
import { MIN_BRIEF_QUALITY_SCORE } from "@/lib/input-coach";
import { mockTranslateAndOptimize } from "@/lib/mock-translate";
import { AuthRequiredError, generateQuizFunnel } from "@/lib/quiz-generation";
import {
  createFunnelBrief,
  EMPTY_FUNNEL_BRIEF,
  FUNNEL_BRIEF_FIELDS,
  validateFunnelBrief,
  type FunnelBriefField,
  type FunnelBriefValues,
} from "@/lib/funnel-brief";
import type { LanguageMode } from "@/types/funnel-brief";
import { PRODUCT_COPY } from "@/lib/product-copy";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

interface QuizGeneratePanelProps {
  variant?: "hero" | "page";
  initialFunnelType?: string;
  wizardStep?: 2 | 3;
  onWizardContinue?: () => void;
}

const TEXT_FIELDS: FunnelBriefField[] = [
  "businessNiche",
  "productOffer",
  "targetAudience",
  "goal",
];

function CharacterCounter({ value, max }: { value: string; max: number }) {
  const count = value.length;
  const over = count > max;
  return (
    <span
      className={cn(
        "text-[11px] tabular-nums",
        over ? "text-red-400" : "text-muted-foreground/50"
      )}
      aria-live="polite"
    >
      {count}/{max}
    </span>
  );
}

export function QuizGeneratePanel({
  variant = "page",
  initialFunnelType,
  wizardStep,
  onWizardContinue,
}: QuizGeneratePanelProps) {
  const { user, isAuthenticated, getAccessToken, loading: authLoading } = useAuth();
  const { addQuiz, updateQuiz } = useQuizzes();
  const navigate = useNavigate();

  const [values, setValues] = useState<FunnelBriefValues>(EMPTY_FUNNEL_BRIEF);
  const [touched, setTouched] = useState<Partial<Record<FunnelBriefField, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Awaited<ReturnType<typeof generateQuizFunnel>> | null>(
    null
  );
  const [savedQuizId, setSavedQuizId] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [detectedLanguageLabel, setDetectedLanguageLabel] = useState("Portuguese");

  const validation = useMemo(() => validateFunnelBrief(values), [values]);
  const protection = useMemo(() => analyzeBriefProtection(values), [values]);
  const coach = protection.coach;
  const language = protection.language;

  const isWizard = wizardStep !== undefined;

  useEffect(() => {
    if (initialFunnelType) {
      setValues((prev) => ({ ...prev, funnelType: initialFunnelType }));
    }
  }, [initialFunnelType]);

  const isHero = variant === "hero";
  const generatorRedirect = ROUTES.appCreate;

  function updateField<K extends FunnelBriefField>(field: K, value: FunnelBriefValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }

  function markTouched(field: FunnelBriefField) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function showError(field: FunnelBriefField): boolean {
    return Boolean((touched[field] || submitAttempted) && validation.errors[field]);
  }

  function fieldClass(field: FunnelBriefField, base: string): string {
    const fieldCoach = coach.fields.find((f) => f.field === field);
    const coachWarning =
      fieldCoach?.isGeneric || (fieldCoach && fieldCoach.score < 40 && values[field].trim());
    return cn(
      base,
      showError(field) && "border-red-500/60 focus-visible:ring-red-500/30",
      !showError(field) &&
        coachWarning &&
        (touched[field] || submitAttempted) &&
        "border-amber-500/50 focus-visible:ring-amber-500/25"
    );
  }

  function showCoach(field: FunnelBriefField): boolean {
    const fieldCoach = coach.fields.find((f) => f.field === field);
    if (!fieldCoach) return false;
    return Boolean(
      (touched[field] || submitAttempted) &&
        (fieldCoach.isGeneric || fieldCoach.message || fieldCoach.score < 75)
    );
  }

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
    }
  }

  function proceedToGeneration() {
    setDetectedLanguageLabel(language.label);

    if (!language.isEnglish) {
      setLanguageModalOpen(true);
      return;
    }

    void runGeneration("original", values);
  }

  function handleWizardContinue() {
    if (authLoading) return;

    setSubmitAttempted(true);
    setTouched({
      businessNiche: true,
      productOffer: true,
      targetAudience: true,
      goal: true,
    });

    if (!validation.isValid) {
      setError("Please complete all fields to continue.");
      return;
    }

    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }

    setError(null);
    onWizardContinue?.();
  }

  function handleGenerate() {
    if (authLoading || loading) return;

    setSubmitAttempted(true);
    setTouched({
      funnelType: true,
      businessNiche: true,
      productOffer: true,
      targetAudience: true,
      goal: true,
    });

    if (!validation.isValid) {
      setError("Please complete all required fields before generating your funnel.");
      return;
    }

    if (!protection.canGenerate) {
      setError(protection.blockReasons[0] ?? "Please improve your brief before generating.");
      return;
    }

    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }

    setError(null);

    if (isWizard && wizardStep === 3) {
      proceedToGeneration();
      return;
    }

    setReviewModalOpen(true);
  }

  function proceedAfterReview() {
    setReviewModalOpen(false);
    proceedToGeneration();
  }

  function handleTranslateAndOptimize() {
    void runGeneration("translated", mockTranslateAndOptimize(values));
  }

  function handleContinueOriginal() {
    void runGeneration("original", values);
  }

  const canContinue = validation.isValid && !loading && !authLoading;
  const canGenerate = protection.canGenerate && !loading && !authLoading;

  const briefForm = (
    <div className="space-y-5">
      {TEXT_FIELDS.map((field) => {
        const config = FUNNEL_BRIEF_FIELDS[field];
        const isTextarea = field === "targetAudience" || field === "goal";
        const InputComponent = isTextarea ? Textarea : Input;
        const fieldCoach = coach.fields.find((f) => f.field === field);

        return (
          <div key={field} className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Label htmlFor={field} className="text-sm font-medium">
                  {config.label}
                </Label>
                <FieldHelpTooltip help={config.help} example={config.example} />
              </div>
              <CharacterCounter value={values[field]} max={config.maxLength} />
            </div>
            <InputComponent
              id={field}
              placeholder={config.placeholder}
              value={values[field]}
              onChange={(e) => updateField(field, e.target.value)}
              onBlur={() => markTouched(field)}
              disabled={loading}
              maxLength={config.maxLength}
              aria-invalid={showError(field)}
              aria-describedby={showError(field) ? `${field}-error` : undefined}
              className={fieldClass(
                field,
                cn(
                  "bg-background/40 border-hairline resize-none rounded-xl",
                  isTextarea ? "min-h-[88px]" : "h-11"
                )
              )}
            />
            {!isWizard && <FieldExample field={field} />}
            {showError(field) && (
              <p id={`${field}-error`} className="text-xs text-red-400" role="alert">
                {validation.errors[field]}
              </p>
            )}
            <FieldCoachHint analysis={fieldCoach} show={showCoach(field)} />
          </div>
        );
      })}
    </div>
  );

  return (
    <TooltipProvider delayDuration={200}>
      <AuthRequiredModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        redirectTo={generatorRedirect}
      />

      {!isWizard && (
        <BriefPreGenerationReview
          open={reviewModalOpen}
          onOpenChange={setReviewModalOpen}
          report={protection}
          onConfirm={proceedAfterReview}
        />
      )}

      <LanguageChoiceModal
        open={languageModalOpen}
        languageLabel={detectedLanguageLabel}
        onTranslateOptimize={handleTranslateAndOptimize}
        onContinueOriginal={handleContinueOriginal}
        onOpenChange={setLanguageModalOpen}
      />

      <div className={cn("w-full", isHero ? "max-w-xl mx-auto" : "")}>
        {isWizard && wizardStep === 2 && briefForm}

        {isWizard && wizardStep === 3 && (
          <BriefReviewPanel report={protection} />
        )}

        {!isWizard && !isHero && (
          <div className="glass rounded-2xl p-6 sm:p-8 mb-8 space-y-6">{briefForm}</div>
        )}

        <div
          className={cn(
            "flex gap-3 mt-8",
            isHero
              ? "flex-col sm:flex-row items-stretch sm:items-center justify-center"
              : "flex-col"
          )}
        >
          {isWizard && wizardStep === 2 && (
            <Button
              type="button"
              onClick={handleWizardContinue}
              disabled={!canContinue}
              className={cn(
                "h-12 w-full rounded-xl font-medium text-white border-0",
                canContinue
                  ? "btn-glow btn-shimmer bg-accent-gradient shadow-glow hover:-translate-y-0.5"
                  : "opacity-50 cursor-not-allowed bg-muted"
              )}
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}

          {(isWizard && wizardStep === 3) || (!isWizard && !isHero) ? (
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={isWizard ? !canGenerate : !canGenerate}
              aria-busy={loading}
              title={
                !protection.canGenerate
                  ? protection.blockReasons[0] ??
                    `Reach ${MIN_BRIEF_QUALITY_SCORE}% brief quality to generate`
                  : undefined
              }
              className={cn(
                "h-12 w-full rounded-xl font-medium text-white border-0",
                loading
                  ? "opacity-80 btn-shimmer bg-accent-gradient"
                  : canGenerate
                    ? "btn-glow btn-shimmer bg-accent-gradient shadow-glow hover:-translate-y-0.5"
                    : "opacity-50 cursor-not-allowed bg-muted"
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
          ) : null}

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

        {error && (
          <p className="mt-4 text-sm text-red-400/90" role="alert">
            {error}
          </p>
        )}

        {(isWizard || !isHero) && (
          <div className="min-h-[80px] mt-8">
            {loading && (
              <div
                className="flex flex-col items-center justify-center gap-4 py-12 animate-fade-in"
                role="status"
                aria-live="polite"
              >
                <Loader2 className="h-8 w-8 text-violet-400 animate-spin" />
                <p className="text-sm text-muted-foreground">Building your funnel…</p>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 text-sm text-emerald-400">
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
                        className="w-full rounded-xl btn-shimmer text-white border-0 bg-accent-gradient shadow-glow"
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
    </TooltipProvider>
  );
}
