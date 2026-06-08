import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { QuizLeadCaptureForm } from "@/components/quiz/QuizLeadCaptureForm";
import type { Quiz, QuizLeadInfo, QuizSubmission } from "@/types/quiz";
import {
  canContinuePreview,
  getContinueButtonAriaLabel,
  getContinueButtonLabel,
  getPreviewQuestion,
  isLastPreviewQuestion,
  nextPreviewStep,
  previewProgressPercent,
} from "@/lib/quiz-preview-flow";
import { cn } from "@/lib/utils";

export type QuizPreviewMode = "editor" | "review" | "public";

type PublicPhase = "questions" | "lead" | "done";

interface QuizLivePreviewProps {
  quiz: Quiz;
  mode?: QuizPreviewMode;
  frame?: "mobile" | "desktop";
  onReviewQuiz?: () => void;
  onComplete?: (submission: QuizSubmission) => void | Promise<void>;
}

export function QuizLivePreview({
  quiz,
  mode = "editor",
  frame = "mobile",
  onReviewQuiz,
  onComplete,
}: QuizLivePreviewProps) {
  const [previewIndex, setPreviewIndex] = useState(0);
  const [selectedByQuestion, setSelectedByQuestion] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [publicPhase, setPublicPhase] = useState<PublicPhase>("questions");
  const [submitting, setSubmitting] = useState(false);

  const questionIds = useMemo(
    () => quiz.questions.map((q) => q.id).join("|"),
    [quiz.questions]
  );

  useEffect(() => {
    setPreviewIndex(0);
    setSelectedByQuestion({});
    setIsComplete(false);
    setPublicPhase("questions");
    setSubmitting(false);
  }, [questionIds]);

  const total = quiz.questions.length;
  const question = getPreviewQuestion(quiz.questions, previewIndex);
  const selectedOptionId = question ? (selectedByQuestion[question.id] ?? null) : null;
  const canContinue = canContinuePreview(question, selectedOptionId);
  const isLastQuestion = isLastPreviewQuestion(previewIndex, total);
  const continueLabel =
    mode === "public" && isLastQuestion
      ? "Continue"
      : getContinueButtonLabel(previewIndex, total);
  const continueAriaLabel =
    mode === "public" && isLastQuestion
      ? "Continue to lead capture"
      : getContinueButtonAriaLabel(previewIndex, total);

  function handleSelectOption(optionId: string) {
    if (!question) return;
    setSelectedByQuestion((prev) => ({ ...prev, [question.id]: optionId }));
  }

  function handleContinue() {
    if (!canContinue) return;

    if (isLastQuestion && mode === "editor" && onReviewQuiz) {
      onReviewQuiz();
      return;
    }

    if (isLastQuestion && mode === "public") {
      setPublicPhase("lead");
      return;
    }

    const next = nextPreviewStep(previewIndex, total);
    if (next === "complete") {
      setIsComplete(true);
      return;
    }
    setPreviewIndex(next);
  }

  async function handleLeadSubmit(lead: QuizLeadInfo) {
    if (!onComplete) {
      setPublicPhase("done");
      setIsComplete(true);
      return;
    }

    setSubmitting(true);
    try {
      await onComplete({ answers: selectedByQuestion, lead });
      setPublicPhase("done");
      setIsComplete(true);
    } finally {
      setSubmitting(false);
    }
  }

  function handleRestart() {
    setPreviewIndex(0);
    setSelectedByQuestion({});
    setIsComplete(false);
    setPublicPhase("questions");
  }

  const maxWidth = frame === "desktop" ? "max-w-[520px]" : "max-w-[300px]";
  const minHeight = frame === "desktop" ? "min-h-[420px]" : "min-h-[380px]";
  const showLeadForm = mode === "public" && publicPhase === "lead";
  const showDone = isComplete || publicPhase === "done";

  return (
    <div className="flex flex-col h-full">
      {mode === "editor" && (
        <div className="px-4 py-3 border-b border-hairline flex-shrink-0 flex items-center justify-between gap-2">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-violet-300/90 px-2 py-0.5 rounded-full border border-violet-500/25 bg-violet-500/10">
              Live Preview
            </span>
            <p className="text-[11px] text-muted-foreground/70 mt-1.5">
              Test the quiz flow as your audience sees it
            </p>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex items-start justify-center">
        <div className={cn("w-full", maxWidth)}>
          <div className="relative">
            {frame === "mobile" && (
              <div
                aria-hidden
                className="absolute -inset-6 bg-accent-gradient opacity-20 blur-2xl rounded-full pointer-events-none"
              />
            )}

            <div
              className={cn(
                "relative border-2 border-hairline bg-surface-elevated shadow-hero",
                frame === "mobile" ? "rounded-[2rem] p-2.5" : "rounded-2xl p-4"
              )}
            >
              <div
                className={cn(
                  "overflow-hidden border border-hairline bg-background",
                  frame === "mobile" ? "rounded-[1.5rem]" : "rounded-xl"
                )}
              >
                {frame === "mobile" && (
                  <div className="px-4 pt-2.5 pb-1.5 flex justify-center">
                    <div className="h-1 w-14 rounded-full bg-muted" />
                  </div>
                )}

                <div className={cn("px-4 pb-5 pt-1 flex flex-col", minHeight)}>
                  <div className="inline-flex self-start items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-violet-500/15 text-violet-300 border border-violet-500/25 mb-3">
                    <Sparkles className="h-3 w-3" />
                    {quiz.title || "Untitled quiz"}
                  </div>

                  {showDone ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-10 gap-3">
                      <CheckCircle2 className="h-10 w-10 text-emerald-400/80" />
                      <p className="text-sm font-medium text-foreground/90">
                        {mode === "public" ? "Thanks for completing the quiz!" : "Quiz complete"}
                      </p>
                      <p className="text-xs text-muted-foreground max-w-[240px]">
                        {mode === "public"
                          ? "Your answers and contact details have been submitted."
                          : "You reached the end of the preview flow."}
                      </p>
                      {mode !== "public" && (
                        <button
                          type="button"
                          onClick={handleRestart}
                          className="mt-2 text-xs text-violet-300 hover:text-violet-200 transition-colors"
                        >
                          Restart preview
                        </button>
                      )}
                    </div>
                  ) : showLeadForm ? (
                    <QuizLeadCaptureForm onSubmit={handleLeadSubmit} submitting={submitting} />
                  ) : question ? (
                    <>
                      <h3 className="text-base font-semibold tracking-tight leading-snug mb-1">
                        {question.title || "Untitled question"}
                      </h3>
                      {question.description && (
                        <p className="text-xs text-muted-foreground mb-2">{question.description}</p>
                      )}
                      <p className="text-[10px] text-muted-foreground mb-4 tabular-nums">
                        Question {previewIndex + 1} of {total || 1}
                      </p>

                      <div className="space-y-2 flex-1">
                        {question.options.map((opt) => {
                          const isSelected = selectedOptionId === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => handleSelectOption(opt.id)}
                              className={cn(
                                "w-full text-left rounded-xl px-3.5 py-3 text-sm font-medium transition-all border",
                                isSelected
                                  ? "bg-accent-gradient text-white shadow-glow border-transparent"
                                  : "glass border-hairline text-foreground/90 hover:border-white/15"
                              )}
                            >
                              {opt.label || "Empty option"}
                            </button>
                          );
                        })}
                      </div>

                      {total > 0 && (
                        <div className="mt-4 flex items-center gap-2">
                          <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full bg-accent-gradient rounded-full transition-all duration-300"
                              style={{
                                width: `${previewProgressPercent(previewIndex, total)}%`,
                              }}
                            />
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground tabular-nums">
                            {previewIndex + 1}/{total}
                          </span>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={handleContinue}
                        disabled={!canContinue}
                        aria-label={continueAriaLabel}
                        className={cn(
                          "mt-4 w-full py-3 rounded-xl text-sm font-semibold transition-all",
                          canContinue
                            ? "btn-glow btn-shimmer text-white shadow-glow"
                            : "bg-muted/40 text-muted-foreground cursor-not-allowed"
                        )}
                      >
                        {continueLabel}
                      </button>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-center py-12">
                      <p className="text-xs text-muted-foreground">Add a question to preview</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
