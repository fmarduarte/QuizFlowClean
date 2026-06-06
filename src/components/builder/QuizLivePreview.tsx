import { Sparkles } from "lucide-react";
import type { Question, Quiz } from "@/types/quiz";
import { cn } from "@/lib/utils";

interface QuizLivePreviewProps {
  quiz: Quiz;
  activeQuestion: Question | null;
  activeIndex: number;
}

export function QuizLivePreview({ quiz, activeQuestion, activeIndex }: QuizLivePreviewProps) {
  const question = activeQuestion ?? quiz.questions[0] ?? null;
  const index = activeQuestion ? activeIndex : 0;
  const total = quiz.questions.length;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-hairline flex-shrink-0">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Live preview
        </h2>
        <p className="text-[11px] text-muted-foreground/70 mt-0.5">Updates as you edit</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex items-start justify-center">
        <div className="w-full max-w-[300px]">
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-6 bg-accent-gradient opacity-20 blur-2xl rounded-full pointer-events-none"
            />

            <div className="relative rounded-[2rem] border-2 border-hairline bg-surface-elevated p-2.5 shadow-hero">
              <div className="rounded-[1.5rem] overflow-hidden border border-hairline bg-background">
                <div className="px-4 pt-2.5 pb-1.5 flex justify-center">
                  <div className="h-1 w-14 rounded-full bg-muted" />
                </div>

                <div className="px-4 pb-5 pt-1 min-h-[380px] flex flex-col">
                  <div className="inline-flex self-start items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-violet-500/15 text-violet-300 border border-violet-500/25 mb-3">
                    <Sparkles className="h-3 w-3" />
                    {quiz.title || "Untitled quiz"}
                  </div>

                  {question ? (
                    <>
                      <h3 className="text-base font-semibold tracking-tight leading-snug mb-1">
                        {question.title || "Untitled question"}
                      </h3>
                      {question.description && (
                        <p className="text-xs text-muted-foreground mb-2">{question.description}</p>
                      )}
                      <p className="text-[10px] text-muted-foreground mb-4 tabular-nums">
                        Question {index + 1} of {total || 1}
                      </p>

                      <div className="space-y-2 flex-1">
                        {question.options.map((opt, i) => (
                          <div
                            key={opt.id}
                            className={cn(
                              "w-full text-left rounded-xl px-3.5 py-3 text-sm font-medium transition-all border",
                              i === 0
                                ? "bg-accent-gradient text-white shadow-glow border-transparent"
                                : "glass border-hairline text-foreground/90"
                            )}
                          >
                            {opt.label || "Empty option"}
                          </div>
                        ))}
                      </div>

                      {total > 0 && (
                        <div className="mt-4 flex items-center gap-2">
                          <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full bg-accent-gradient rounded-full transition-all duration-300"
                              style={{ width: `${((index + 1) / total) * 100}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground tabular-nums">
                            {index + 1}/{total}
                          </span>
                        </div>
                      )}

                      <button
                        type="button"
                        className="mt-4 w-full py-3 rounded-xl text-sm font-semibold btn-glow btn-shimmer text-white shadow-glow pointer-events-none"
                        tabIndex={-1}
                      >
                        Continue →
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
