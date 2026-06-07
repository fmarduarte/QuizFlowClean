import { Sparkles } from "lucide-react";
import { QuizPlayer } from "@/components/quiz/QuizPlayer";
import type { Quiz } from "@/types/quiz";

interface QuizLivePreviewProps {
  quiz: Quiz;
}

export function QuizLivePreview({ quiz }: QuizLivePreviewProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-hairline flex-shrink-0">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-violet-300/90 px-2 py-0.5 rounded-full border border-violet-500/25 bg-violet-500/10">
          Live Preview
        </span>
        <p className="text-[11px] text-muted-foreground/70 mt-1.5">
          Test the full funnel flow as your audience sees it
        </p>
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
                    {quiz.title || "Untitled funnel"}
                  </div>

                  <QuizPlayer quiz={quiz} result={quiz.result} showRestart />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
