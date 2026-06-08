import { useEffect, useMemo, useRef, useState } from "react";
import type { FunnelResultScreen, Question, Quiz, QuizLeadInfo } from "@/types/quiz";
import { DEFAULT_FUNNEL_RESULT } from "@/types/quiz";
import {
  canContinuePreview,
  getPreviewQuestion,
  nextPreviewStep,
  previewProgressPercent,
} from "@/lib/quiz-preview-flow";
import { FunnelResultScreenView } from "@/components/funnel/FunnelResultScreen";
import { QuizLeadCaptureForm } from "@/components/quiz/QuizLeadCaptureForm";
import { cn } from "@/lib/utils";

export interface QuizPlayerAnswers {
  [questionId: string]: string;
}

export interface QuizPlayerCompletePayload {
  answers: QuizPlayerAnswers;
  completedAt: string;
  lead?: QuizLeadInfo;
  sessionId?: string;
  funnelId?: string;
}

interface QuizPlayerProps {
  quiz: Pick<Quiz, "title" | "questions">;
  result?: FunnelResultScreen;
  funnelId?: string;
  sessionId?: string;
  /** When true, ask for the respondent's email/name before completing. */
  collectLead?: boolean;
  onStart?: () => void;
  onComplete?: (payload: QuizPlayerCompletePayload) => void;
  showRestart?: boolean;
  className?: string;
}

export function QuizPlayer({
  quiz,
  result = DEFAULT_FUNNEL_RESULT,
  funnelId,
  sessionId,
  collectLead = false,
  onStart,
  onComplete,
  showRestart = true,
  className,
}: QuizPlayerProps) {
  const [previewIndex, setPreviewIndex] = useState(0);
  const [selectedByQuestion, setSelectedByQuestion] = useState<QuizPlayerAnswers>({});
  const [pendingAnswers, setPendingAnswers] = useState<QuizPlayerAnswers | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const startedRef = useRef(false);

  const questionIds = useMemo(
    () => quiz.questions.map((q) => q.id).join("|"),
    [quiz.questions]
  );

  useEffect(() => {
    setPreviewIndex(0);
    setSelectedByQuestion({});
    setPendingAnswers(null);
    setShowLeadForm(false);
    setIsComplete(false);
    startedRef.current = false;
  }, [questionIds]);

  const total = quiz.questions.length;
  const question = getPreviewQuestion(quiz.questions, previewIndex);
  const selectedOptionId = question ? (selectedByQuestion[question.id] ?? null) : null;
  const canContinue = canContinuePreview(question, selectedOptionId);

  function markStarted() {
    if (startedRef.current) return;
    startedRef.current = true;
    onStart?.();
  }

  function handleSelectOption(optionId: string) {
    if (!question) return;
    markStarted();
    setSelectedByQuestion((prev) => ({ ...prev, [question.id]: optionId }));
  }

  function complete(answers: QuizPlayerAnswers, lead?: QuizLeadInfo) {
    setIsComplete(true);
    onComplete?.({
      answers,
      completedAt: new Date().toISOString(),
      lead,
      sessionId,
      funnelId,
    });
  }

  function handleContinue() {
    if (!canContinue) return;
    markStarted();
    const next = nextPreviewStep(previewIndex, total);
    if (next === "complete") {
      const finalAnswers =
        question && selectedOptionId
          ? { ...selectedByQuestion, [question.id]: selectedOptionId }
          : selectedByQuestion;
      if (collectLead) {
        setPendingAnswers(finalAnswers);
        setShowLeadForm(true);
        return;
      }
      complete(finalAnswers);
      return;
    }
    setPreviewIndex(next);
  }

  function handleLeadSubmit(lead: QuizLeadInfo) {
    complete(pendingAnswers ?? selectedByQuestion, lead);
  }

  function handleRestart() {
    setPreviewIndex(0);
    setSelectedByQuestion({});
    setPendingAnswers(null);
    setShowLeadForm(false);
    setIsComplete(false);
    startedRef.current = false;
  }

  if (isComplete) {
    return (
      <div className={cn("flex flex-col flex-1 min-h-0 w-full", className)}>
        <FunnelResultScreenView
          result={result}
          showRestart={showRestart}
          onRestart={handleRestart}
        />
      </div>
    );
  }

  if (showLeadForm) {
    return (
      <div className={cn("flex flex-col flex-1 min-h-0 w-full", className)}>
        <QuizLeadCaptureForm onSubmit={handleLeadSubmit} />
      </div>
    );
  }

  if (!question) {
    return (
      <div className={cn("flex flex-1 items-center justify-center text-center py-12 px-4", className)}>
        <p className="text-sm text-muted-foreground">Add a question to preview</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col flex-1 min-h-0 w-full", className)}>
      <h3 className="text-base sm:text-lg md:text-xl font-semibold tracking-tight leading-snug mb-1 sm:mb-2">
        {question.title || "Untitled question"}
      </h3>
      {question.description && (
        <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">{question.description}</p>
      )}
      <p className="text-[10px] sm:text-xs text-muted-foreground mb-4 tabular-nums">
        Question {previewIndex + 1} of {total || 1}
      </p>

      <OptionList
        question={question}
        selectedOptionId={selectedOptionId}
        onSelect={handleSelectOption}
      />

      {total > 0 && (
        <div className="mt-4 sm:mt-6 flex items-center gap-2">
          <div className="flex-1 h-1 sm:h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-accent-gradient rounded-full transition-all duration-300"
              style={{ width: `${previewProgressPercent(previewIndex, total)}%` }}
            />
          </div>
          <span className="text-[10px] sm:text-xs font-mono text-muted-foreground tabular-nums">
            {previewIndex + 1}/{total}
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={handleContinue}
        disabled={!canContinue}
        aria-label="Continue to next question"
        className={cn(
          "mt-4 sm:mt-6 w-full py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-semibold transition-all",
          canContinue
            ? "btn-glow btn-shimmer text-white shadow-glow"
            : "bg-muted/40 text-muted-foreground cursor-not-allowed"
        )}
      >
        Continue →
      </button>
    </div>
  );
}

interface OptionListProps {
  question: Question;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
}

function OptionList({ question, selectedOptionId, onSelect }: OptionListProps) {
  return (
    <div className="space-y-2 sm:space-y-2.5 flex-1">
      {question.options.map((opt) => {
        const isSelected = selectedOptionId === opt.id;
        const label = opt.label || "Empty option";
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id)}
            aria-label={label}
            aria-pressed={isSelected}
            className={cn(
              "w-full text-left rounded-xl px-3.5 sm:px-4 py-3 sm:py-3.5 text-sm sm:text-base font-medium transition-all border",
              isSelected
                ? "bg-accent-gradient text-white shadow-glow border-transparent"
                : "glass border-hairline text-foreground/90 hover:border-white/15 active:scale-[0.99]"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
