import { useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Copy,
  Languages,
  Shield,
  Sparkles,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MIN_BRIEF_QUALITY_SCORE } from "@/lib/input-coach";
import type { CoachStatus } from "@/lib/input-coach";
import { FUNNEL_BRIEF_FIELDS } from "@/lib/funnel-brief";
import type { FunnelBriefField } from "@/lib/funnel-brief";
import type { BriefProtectionReport } from "@/lib/brief-protection";
import { cn } from "@/lib/utils";

interface FunnelCoachPanelProps {
  report: BriefProtectionReport;
  onApplySuggestion?: (field: FunnelBriefField, value: string) => void;
  compact?: boolean;
  showFieldBreakdown?: boolean;
  collapsibleDetails?: boolean;
}

const statusStyles: Record<
  CoachStatus,
  { badge: string; ring: string; label: string }
> = {
  Weak: {
    badge: "bg-rose-500/15 text-rose-200 ring-rose-500/25",
    ring: "text-rose-300",
    label: "0–40",
  },
  Good: {
    badge: "bg-amber-500/15 text-amber-100 ring-amber-500/25",
    ring: "text-amber-300",
    label: "41–75",
  },
  Excellent: {
    badge: "bg-emerald-500/15 text-emerald-100 ring-emerald-500/25",
    ring: "text-emerald-300",
    label: "76–100",
  },
};

function ScoreRing({ score, status }: { score: number; status: CoachStatus }) {
  const styles = statusStyles[status];
  return (
    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 36 36" aria-hidden>
        <circle
          cx="18"
          cy="18"
          r="15.5"
          fill="none"
          className="stroke-muted/40"
          strokeWidth="2.5"
        />
        <circle
          cx="18"
          cy="18"
          r="15.5"
          fill="none"
          className={cn("stroke-current transition-all duration-500", styles.ring)}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={`${score} 100`}
        />
      </svg>
      <span className="text-lg font-semibold tabular-nums">{score}</span>
    </div>
  );
}

export function FunnelCoachPanel({
  report,
  onApplySuggestion,
  compact = false,
  showFieldBreakdown = true,
  collapsibleDetails = false,
}: FunnelCoachPanelProps) {
  const { coach, language, moderation } = report;
  const textFields = coach.fields.filter((f) => f.field !== "funnelType");
  const styles = statusStyles[coach.status];
  const [detailsOpen, setDetailsOpen] = useState(!collapsibleDetails);

  const primaryInsight =
    coach.recommendations[0] ??
    coach.duplicatePairs[0]?.message ??
    coach.hint;

  return (
    <div className="space-y-4">
      <div className="coach-glass rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-violet-500/15 flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5 text-violet-300" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium tracking-tight">AI Funnel Coach</p>
            <p className="text-xs text-muted-foreground/80 mt-0.5 leading-relaxed">
              {primaryInsight}
            </p>
          </div>
          {!compact && <ScoreRing score={coach.score} status={coach.status} />}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {compact && <ScoreRing score={coach.score} status={coach.status} />}
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
              styles.badge
            )}
          >
            {coach.status}
          </span>
          <span className="text-xs text-muted-foreground/70">{styles.label}</span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground/80">Funnel quality</span>
            <span className="tabular-nums text-muted-foreground">
              {coach.score}/100 · {MIN_BRIEF_QUALITY_SCORE}+ to generate
            </span>
          </div>
          <Progress
            value={coach.score}
            className="h-2 bg-white/5 [&>div]:bg-gradient-to-r [&>div]:from-violet-500 [&>div]:to-fuchsia-500 [&>div]:transition-all"
          />
        </div>
      </div>

      {collapsibleDetails && (
        <button
          type="button"
          onClick={() => setDetailsOpen((o) => !o)}
          className="coach-glass w-full rounded-2xl px-4 py-3 flex items-center justify-between text-xs text-muted-foreground/80"
        >
          Validation details
          <ChevronDown className={cn("h-4 w-4 transition-transform", detailsOpen && "rotate-180")} />
        </button>
      )}

      {(!collapsibleDetails || detailsOpen) && (
        <>
          {(language.isReliable || moderation.issues.length > 0) && (
            <div className="coach-glass rounded-2xl p-4 space-y-3">
              {language.isReliable && (
                <div className="flex items-start gap-3">
                  <Languages className="h-4 w-4 text-violet-300/80 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium">Language</p>
                    <p className="text-xs text-muted-foreground/80 mt-0.5 leading-relaxed">
                      {language.isEnglish
                        ? "English detected — optimal for generation."
                        : `${language.label} detected. English produces higher-quality funnels.`}
                    </p>
                  </div>
                </div>
              )}
              {moderation.issues.length > 0 && (
                <div className="flex items-start gap-3 pt-2 border-t border-white/5">
                  <Shield className="h-4 w-4 text-rose-300/80 mt-0.5 shrink-0" />
                  <ul className="space-y-1.5 min-w-0">
                    {moderation.issues.map((issue) => (
                      <li
                        key={`${issue.category}-${issue.field}`}
                        className="text-xs text-muted-foreground/85 leading-relaxed"
                      >
                        {issue.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {coach.duplicatePairs.length > 0 && (
            <div className="coach-glass rounded-2xl p-4 flex gap-3">
              <Copy className="h-4 w-4 text-violet-300/80 mt-0.5 shrink-0" />
              <div className="space-y-1">
                {coach.duplicatePairs.map((pair) => (
                  <p
                    key={pair.fields.join("-")}
                    className="text-xs text-muted-foreground/85 leading-relaxed"
                  >
                    {pair.message}
                  </p>
                ))}
              </div>
            </div>
          )}

          {coach.recommendations.length > 1 && (
            <div className="coach-glass rounded-2xl p-4 space-y-3">
              <p className="text-xs font-medium flex items-center gap-2 text-muted-foreground/80">
                <Wand2 className="h-3.5 w-3.5 text-violet-300/80" />
                More suggestions
              </p>
              <ul className="space-y-2">
                {coach.recommendations.slice(1, compact ? 3 : 4).map((rec) => (
                  <li
                    key={rec}
                    className="text-xs text-muted-foreground/85 leading-relaxed rounded-xl bg-white/[0.03] border border-white/5 px-3 py-2.5"
                  >
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {showFieldBreakdown && (
            <div className="coach-glass rounded-2xl p-4 space-y-3">
              <p className="text-xs font-medium text-muted-foreground/70">Field scores</p>
              <div className="grid gap-2">
                {textFields.map((field) => (
                  <div
                    key={field.field}
                    className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.03] border border-white/5 px-3 py-2"
                  >
                    <span className="text-xs text-muted-foreground truncate">
                      {FUNNEL_BRIEF_FIELDS[field.field].label}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      {field.isDuplicate && (
                        <Copy className="h-3 w-3 text-violet-400/60" aria-label="Duplicate" />
                      )}
                      <span
                        className={cn(
                          "text-xs font-medium tabular-nums",
                          statusStyles[field.status].ring
                        )}
                      >
                        {field.score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {onApplySuggestion &&
            textFields
              .filter((f) => f.applyValue && f.score < 75)
              .slice(0, compact ? 1 : 2)
              .map((field) => (
                <div key={field.field} className="coach-glass rounded-2xl p-4 space-y-3">
                  <p className="text-xs text-muted-foreground/80 leading-relaxed">
                    {field.improvement ?? field.message}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onApplySuggestion(field.field, field.applyValue!)}
                    className="w-full rounded-xl border-violet-500/20 bg-violet-500/5 hover:bg-violet-500/10 text-xs h-9"
                  >
                    <Wand2 className="h-3.5 w-3.5" />
                    Apply to {FUNNEL_BRIEF_FIELDS[field.field].label}
                  </Button>
                </div>
              ))}
        </>
      )}

      {report.canGenerate && (
        <div className="coach-glass rounded-2xl px-4 py-3 flex items-center gap-2 text-xs text-emerald-300/90">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Brief looks strong — ready to generate your funnel.
        </div>
      )}
    </div>
  );
}
