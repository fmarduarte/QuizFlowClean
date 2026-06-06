import { Lightbulb } from "lucide-react";
import type { FieldCoachAnalysis } from "@/lib/input-coach";
import { FUNNEL_BRIEF_FIELDS } from "@/lib/funnel-brief";
import { cn } from "@/lib/utils";

interface FieldCoachHintProps {
  analysis?: FieldCoachAnalysis;
  show: boolean;
}

export function FieldCoachHint({ analysis, show }: FieldCoachHintProps) {
  if (!show || !analysis) return null;

  const hasCoach =
    analysis.message || analysis.suggestion || analysis.coachQuestions.length > 0;

  if (!hasCoach) return null;

  const isWarning = analysis.isGeneric || analysis.isVague || analysis.isInvalidGoal || analysis.score < 40;

  return (
    <div
      className={cn(
        "rounded-xl px-3.5 py-3 text-xs space-y-2 border",
        isWarning
          ? "border-amber-500/30 bg-amber-500/8 text-amber-100/90"
          : "border-violet-500/20 bg-violet-500/5 text-muted-foreground"
      )}
      role="status"
    >
      {analysis.message && (
        <p className={cn(isWarning && "font-medium text-amber-200/95")}>{analysis.message}</p>
      )}

      {analysis.coachQuestions.length > 0 && (
        <ul className="space-y-1">
          {analysis.coachQuestions.map((q) => (
            <li key={q} className="flex items-start gap-1.5">
              <Lightbulb className="h-3 w-3 mt-0.5 shrink-0 opacity-70" />
              <span>{q}</span>
            </li>
          ))}
        </ul>
      )}

      {analysis.suggestion && (analysis.isGeneric || analysis.score < 75) && (
        <p className="pt-1 border-t border-hairline/60">
          <span className="font-medium text-foreground/80">Suggested: </span>
          {analysis.suggestion}
        </p>
      )}
    </div>
  );
}

export function FieldExample({ field }: { field: keyof typeof FUNNEL_BRIEF_FIELDS }) {
  const example = FUNNEL_BRIEF_FIELDS[field].example;
  return (
    <p className="text-[11px] text-muted-foreground/55 leading-relaxed">
      <span className="text-muted-foreground/70">Example: </span>
      {example}
    </p>
  );
}
