import { AlertCircle, CheckCircle2 } from "lucide-react";
import { validateQuizForPublish } from "@/lib/quiz-validation";
import type { Quiz } from "@/types/quiz";
import { cn } from "@/lib/utils";

interface QuizValidationPanelProps {
  quiz: Quiz;
  className?: string;
}

export function QuizValidationPanel({ quiz, className }: QuizValidationPanelProps) {
  const result = validateQuizForPublish(quiz);

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 sm:p-5",
        result.valid
          ? "border-emerald-500/25 bg-emerald-500/5"
          : "border-amber-500/25 bg-amber-500/5",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        {result.valid ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold tracking-tight">
            {result.valid ? "Ready to publish" : "Needs attention before publishing"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {result.valid
              ? "Your quiz passed all required checks."
              : `${result.errorCount} error${result.errorCount === 1 ? "" : "s"}${result.warningCount > 0 ? ` and ${result.warningCount} warning${result.warningCount === 1 ? "" : "s"}` : ""} found.`}
          </p>
          {result.issues.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {result.issues.map((issue) => (
                <li
                  key={issue.id}
                  className={cn(
                    "text-xs",
                    issue.severity === "error" ? "text-amber-200/90" : "text-muted-foreground"
                  )}
                >
                  • {issue.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
