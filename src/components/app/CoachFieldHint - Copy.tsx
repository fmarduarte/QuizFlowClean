import { Copy, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FieldCoachAnalysis } from "@/lib/input-coach";
import { FUNNEL_BRIEF_FIELDS, type FunnelBriefField } from "@/lib/funnel-brief";
import { cn } from "@/lib/utils";

interface CoachFieldHintProps {
  analysis?: FieldCoachAnalysis;
  show: boolean;
  onApply?: (field: FunnelBriefField, value: string) => void;
}

export function CoachFieldHint({ analysis, show, onApply }: CoachFieldHintProps) {
  if (!show || !analysis) return null;

  const hasContent =
    analysis.message ||
    analysis.improvement ||
    analysis.suggestion ||
    analysis.isDuplicate;

  if (!hasContent) return null;

  const needsAttention =
    analysis.isDuplicate ||
    analysis.isGeneric ||
    analysis.isVague ||
    analysis.isInvalidGoal ||
    analysis.score < 60;

  return (
    <div
      className={cn(
        "coach-glass rounded-xl px-3.5 py-3 text-xs space-y-2.5 animate-fade-in",
        needsAttention && "ring-1 ring-violet-500/15"
      )}
      role="status"
    >
      {analysis.isDuplicate && (
        <p className="flex items-start gap-2 text-amber-200/90">
          <Copy className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>{analysis.improvement}</span>
        </p>
      )}

      {analysis.improvement && !analysis.isDuplicate && (
        <p className="text-muted-foreground/90 leading-relaxed">{analysis.improvement}</p>
      )}

      {analysis.message && !analysis.improvement && (
        <p className="text-muted-foreground/90 leading-relaxed">{analysis.message}</p>
      )}

      {analysis.applyValue && analysis.score < 75 && onApply && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onApply(analysis.field, analysis.applyValue!)}
          className="h-8 w-full justify-start rounded-lg text-xs text-violet-200/90 hover:bg-violet-500/10 hover:text-violet-100 px-2"
        >
          <Wand2 className="h-3.5 w-3.5" />
          Use: {analysis.applyValue}
        </Button>
      )}
    </div>
  );
}

export function FieldScoreBadge({ score, status }: { score: number; status: string }) {
  return (
    <span
      className={cn(
        "text-[10px] font-medium tabular-nums px-1.5 py-0.5 rounded-md",
        status === "Excellent" && "bg-emerald-500/10 text-emerald-300/90",
        status === "Good" && "bg-amber-500/10 text-amber-200/90",
        status === "Weak" && "bg-rose-500/10 text-rose-200/90"
      )}
    >
      {score}%
    </span>
  );
}

export function FieldExample({ field }: { field: keyof typeof FUNNEL_BRIEF_FIELDS }) {
  const example = FUNNEL_BRIEF_FIELDS[field].example;
  return (
    <p className="text-[11px] text-muted-foreground/50 leading-relaxed">
      <span className="text-muted-foreground/65">Example: </span>
      {example}
    </p>
  );
}
