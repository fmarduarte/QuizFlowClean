import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { AuthRequiredModal } from "@/components/auth/AuthRequiredModal";
import { FieldHelpTooltip } from "@/components/app/FieldHelpTooltip";
import { FunnelBriefQuality } from "@/components/app/FunnelBriefQuality";
import { LanguageChoiceModal } from "@/components/app/LanguageChoiceModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QuizResultCard } from "@/components/app/QuizResultCard";
import { useAuth } from "@/context/AuthContext";
import { useQuizzes } from "@/context/QuizzesContext";
import { loginLink } from "@/lib/auth-redirect";
import { saveFunnelBriefToSupabase } from "@/lib/funnel-brief-store";
import { detectBriefLanguage } from "@/lib/language-detect";
import { mockTranslateAndOptimize } from "@/lib/mock-translate";
import { AuthRequiredError, generateQuizFunnel } from "@/lib/quiz-generation";
import {
  computeBriefQuality,
  createFunnelBrief,
  EMPTY_FUNNEL_BRIEF,
  FUNNEL_BRIEF_FIELDS,
  validateFunnelBrief,
  type FunnelBriefField,
  type FunnelBriefValues,
} from "@/lib/funnel-brief";
import type { LanguageMode } from "@/types/funnel-brief";
import { FUNNEL_TYPES } from "@/lib/funnel-types";
import { PRODUCT_COPY } from "@/lib/product-copy";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

interface QuizGeneratePanelProps {
  variant?: "hero" | "page";
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
        over ? "text-red-400" : "text-muted-foreground/60"
      )}
      aria-live="polite"
    >
      {count}/{max}
    </span>
  );
}

export function QuizGeneratePanel({ variant = "page" }: QuizGeneratePanelProps) {
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
  const [detectedLanguageLabel, setDetectedLanguageLabel] = useState("Portuguese");

  const validation = useMemo(() => validateFunnelBrief(values), [values]);
  const quality = useMemo(() => computeBriefQuality(values), [values]);

  const isHero = variant === "hero";
  const generatorRedirect = `${ROUTES.app}${ROUTES.appSections.generator}`;

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
    return cn(base, showError(field) && "border-red-500/60 focus-visible:ring-red-500/30");
  }

  function handleOpenBuilder() {
    if (!isAuthenticated) {
      navigate(loginLink(generatorRedirect));
      return;
    }
    navigate({ pathname: ROUTES.app, hash: ROUTES.appSections.generator });
  }

  async function runGeneration(languageMode: LanguageMode, generationValues: FunnelBriefValues) {
    setLanguageModalOpen(false);
    setError(null);
    setResult(null);
    setSavedQuizId(null);
    setLoading(true);

    try {
      const detected = detectBriefLanguage(values);
      const brief = createFunnelBrief({
        originalValues: values,
        generationValues,
        languageMode,
        detectedLanguage: detected,
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

    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }

    const detected = detectBriefLanguage(values);
    if (!detected.isEnglish) {
      setDetectedLanguageLabel(detected.label);
      setLanguageModalOpen(true);
      return;
    }

    void runGeneration("original", values);
  }

  function handleTranslateAndOptimize() {
    void runGeneration("translated", mockTranslateAndOptimize(values));
  }

  function handleContinueOriginal() {
    void runGeneration("original", values);
  }

  const canGenerate = validation.isValid && !loading && !authLoading;

  return (
    <TooltipProvider delayDuration={200}>
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

      <div className={cn("w-full", isHero ? "max-w-xl mx-auto" : "max-w-2xl")}>
        {!isHero && (
          <div className="glass rounded-2xl p-6 sm:p-8 mb-8 space-y-6">
            <FunnelBriefQuality quality={quality} />

            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="funnel-type">{FUNNEL_BRIEF_FIELDS.funnelType.label}</Label>
                <FieldHelpTooltip
                  help={FUNNEL_BRIEF_FIELDS.funnelType.help}
                  example={FUNNEL_BRIEF_FIELDS.funnelType.example}
                />
              </div>
              <Select
                value={values.funnelType || undefined}
                onValueChange={(v) => updateField("funnelType", v)}
                disabled={loading}
                onOpenChange={(open) => {
                  if (!open) markTouched("funnelType");
                }}
              >
                <SelectTrigger
                  id="funnel-type"
                  aria-invalid={showError("funnelType")}
                  aria-describedby={showError("funnelType") ? "funnel-type-error" : undefined}
                  className={fieldClass(
                    "funnelType",
                    "bg-background/80 border-hairline h-11 rounded-xl"
                  )}
                >
                  <SelectValue placeholder={FUNNEL_BRIEF_FIELDS.funnelType.placeholder} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-hairline">
                  {FUNNEL_TYPES.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.shortTitle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {showError("funnelType") && (
                <p id="funnel-type-error" className="text-xs text-red-400" role="alert">
                  {validation.errors.funnelType}
                </p>
              )}
            </div>

            {TEXT_FIELDS.map((field) => {
              const config = FUNNEL_BRIEF_FIELDS[field];
              const isTextarea = field === "targetAudience" || field === "goal";
              const InputComponent = isTextarea ? Textarea : Input;

              return (
                <div key={field} className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <Label htmlFor={field}>{config.label}</Label>
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
                        "bg-background/80 border-hairline resize-none",
                        isTextarea ? "min-h-[96px]" : "h-11"
                      )
                    )}
                  />
                  {showError(field) && (
                    <p id={`${field}-error`} className="text-xs text-red-400" role="alert">
                      {validation.errors[field]}
                    </p>
                  )}
                </div>
              );
            })}
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
            disabled={!canGenerate}
            aria-busy={loading}
            title={
              !validation.isValid
                ? "Complete all required fields to generate your funnel"
                : undefined
            }
            className={cn(
              "btn-glow h-12 px-6 rounded-xl font-medium text-white border-0 shadow-glow transition-all duration-300",
              loading
                ? "opacity-80 btn-shimmer"
                : canGenerate
                  ? "btn-shimmer hover:-translate-y-0.5 hover:shadow-elevated"
                  : "opacity-50 cursor-not-allowed",
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

        {!isHero && submitAttempted && !validation.isValid && (
          <p className="mt-3 text-sm text-amber-400/90" role="status">
            Complete the highlighted fields above — each one helps the AI build a sharper funnel.
          </p>
        )}

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
                brief={result.brief}
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
    </TooltipProvider>
  );
}
