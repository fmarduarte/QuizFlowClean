import { Check } from "lucide-react";
import { PRODUCT_COPY } from "@/lib/product-copy";
import { cn } from "@/lib/utils";

export type QuizWorkflowStep = "create" | "edit" | "review" | "publish" | "share";

const STEPS: { id: QuizWorkflowStep; label: string }[] = [
  { id: "create", label: PRODUCT_COPY.quiz.workflow.create },
  { id: "edit", label: PRODUCT_COPY.quiz.workflow.edit },
  { id: "review", label: PRODUCT_COPY.quiz.workflow.review },
  { id: "publish", label: PRODUCT_COPY.quiz.workflow.publish },
  { id: "share", label: PRODUCT_COPY.quiz.workflow.share },
];

interface QuizWorkflowStepsProps {
  current: QuizWorkflowStep;
  className?: string;
}

export function QuizWorkflowSteps({ current, className }: QuizWorkflowStepsProps) {
  const currentIndex = STEPS.findIndex((step) => step.id === current);

  return (
    <nav aria-label="Quiz publication workflow" className={cn("w-full", className)}>
      <ol className="flex flex-wrap items-center gap-2 sm:gap-3">
        {STEPS.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = step.id === current;

          return (
            <li key={step.id} className="flex items-center gap-2 sm:gap-3">
              <div
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                  isCurrent
                    ? "border-violet-500/30 bg-violet-500/15 text-violet-200"
                    : isComplete
                      ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
                      : "border-hairline bg-surface-subtle/40 text-muted-foreground"
                )}
              >
                {isComplete ? (
                  <Check className="h-3 w-3" aria-hidden />
                ) : (
                  <span className="h-4 w-4 rounded-full border border-current/30 flex items-center justify-center text-[9px]">
                    {index + 1}
                  </span>
                )}
                {step.label}
              </div>
              {index < STEPS.length - 1 && (
                <span className="hidden sm:inline text-muted-foreground/40" aria-hidden>
                  →
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
