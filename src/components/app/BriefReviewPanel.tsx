import { AlertTriangle, CheckCircle2, Languages, ShieldAlert } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { FUNNEL_BRIEF_FIELDS } from "@/lib/funnel-brief";
import type { BriefProtectionReport } from "@/lib/brief-protection";
import { cn } from "@/lib/utils";

const tierStyles = {
  Poor: "text-red-400",
  Basic: "text-amber-400",
  Good: "text-emerald-400",
  Excellent: "text-violet-400",
} as const;

interface BriefReviewPanelProps {
  report: BriefProtectionReport;
}

export function BriefReviewPanel({ report }: BriefReviewPanelProps) {
  const { coach, language, moderation, blockReasons } = report;
  const textFields = coach.fields.filter((f) => f.field !== "funnelType");

  return (
    <div className="space-y-5">
      {blockReasons.length > 0 && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 space-y-2">
          <p className="text-sm font-medium text-red-200 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Issues to fix
          </p>
          <ul className="text-xs text-red-200/85 space-y-1 list-disc pl-4">
            {blockReasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-xl border border-hairline/80 bg-background/20 p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium">Quality score</p>
          <span className={cn("text-sm font-semibold tabular-nums", tierStyles[coach.tier])}>
            {coach.label} · {coach.score}%
          </span>
        </div>
        <Progress value={coach.score} className="h-1.5 bg-muted" />
      </div>

      <div className="flex items-start gap-3 text-sm">
        <Languages className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
        <div>
          <p className="font-medium text-sm">Language</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {language.isReliable ? language.label : "Inconclusive — add more detail"}
          </p>
        </div>
      </div>

      {moderation.issues.length > 0 && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 space-y-2">
          <p className="text-sm font-medium text-amber-200 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" />
            Content check
          </p>
          <ul className="text-xs text-amber-100/90 space-y-1">
            {moderation.issues.map((issue) => (
              <li key={`${issue.category}-${issue.field}`}>{issue.message}</li>
            ))}
          </ul>
        </div>
      )}

      {coach.recommendations.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Suggestions</p>
          <ul className="space-y-2">
            {coach.recommendations.slice(0, 4).map((rec) => (
              <li
                key={rec}
                className="text-xs text-muted-foreground rounded-lg border border-hairline/80 px-3 py-2 leading-relaxed"
              >
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-2">
        {textFields.map((field) => (
          <div
            key={field.field}
            className="flex items-center justify-between gap-3 rounded-lg border border-hairline/80 px-3 py-2 text-xs"
          >
            <span className="text-muted-foreground">{FUNNEL_BRIEF_FIELDS[field.field].label}</span>
            <span className={cn("font-medium tabular-nums", tierStyles[field.tier])}>
              {field.score}%
            </span>
          </div>
        ))}
      </div>

      {report.canGenerate && (
        <div className="flex items-center gap-2 text-xs text-emerald-400">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Ready to generate
        </div>
      )}
    </div>
  );
}
