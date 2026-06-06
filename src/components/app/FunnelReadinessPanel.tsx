import { AlertCircle, Check, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { FunnelReadinessAnalysis } from "@/lib/funnel-readiness";
import { cn } from "@/lib/utils";

interface FunnelReadinessPanelProps {
  analysis: FunnelReadinessAnalysis;
}

const STATUS_STYLES = {
  "Not Ready": "text-rose-300/90 bg-rose-500/10 ring-rose-500/20",
  "Almost Ready": "text-amber-200/90 bg-amber-500/10 ring-amber-500/20",
  Ready: "text-emerald-300/90 bg-emerald-500/10 ring-emerald-500/20",
} as const;

const DETECTION_ITEMS = [
  { key: "business" as const, label: "Business" },
  { key: "offer" as const, label: "Offer" },
  { key: "audience" as const, label: "Audience" },
  { key: "goal" as const, label: "Goal" },
  { key: "painPoint" as const, label: "Pain point" },
];

export function FunnelReadinessPanel({ analysis }: FunnelReadinessPanelProps) {
  const hasInput =
    analysis.score > 0 ||
    analysis.offer.value ||
    analysis.audience.value ||
    analysis.goal.value;

  if (!hasInput) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <p className="text-xs text-muted-foreground/50 tracking-wide">
              Funnel Readiness
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-2xl font-semibold tabular-nums text-foreground/95">
                {analysis.score}
              </span>
              <span className="text-sm text-muted-foreground/50">/ 100</span>
              <span
                className={cn(
                  "text-[11px] font-medium px-2 py-0.5 rounded-full ring-1",
                  STATUS_STYLES[analysis.status]
                )}
              >
                {analysis.status}
              </span>
            </div>
          </div>
          <Sparkles className="h-4 w-4 text-violet-400/50 shrink-0 mt-1" aria-hidden />
        </div>

        <Progress value={analysis.score} className="h-1.5 bg-white/[0.06]" />
      </div>

      <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
        <div className="px-4 py-3 sm:px-5 border-b border-white/[0.06] bg-white/[0.02]">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground/45">
            AI Understanding
          </p>
        </div>
        <pre className="px-4 py-4 sm:px-5 text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap font-sans">
          {analysis.understandingSummary}
        </pre>
      </div>

      <div className="space-y-3">
        <p className="text-xs text-muted-foreground/50 tracking-wide">
          Funnel viability signals
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {DETECTION_ITEMS.map(({ key, label }) => {
            const detection = analysis[key];
            const isOptional = key === "painPoint";
            const isStrong = detection.detected && detection.confidence >= 55;

            return (
              <li
                key={key}
                className={cn(
                  "flex items-center gap-2 text-xs",
                  isStrong
                    ? "text-emerald-400/80"
                    : detection.detected
                      ? "text-amber-300/70"
                      : "text-muted-foreground/45"
                )}
              >
                <Check
                  className={cn(
                    "h-3.5 w-3.5",
                    isStrong
                      ? "text-emerald-400/70"
                      : detection.detected
                        ? "text-amber-400/60"
                        : "text-muted-foreground/25"
                  )}
                  strokeWidth={2}
                />
                {label}
                {isOptional && !detection.detected && (
                  <span className="text-muted-foreground/35">(optional)</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {analysis.viabilityWarnings.length > 0 && (
        <div className="space-y-2">
          {analysis.viabilityWarnings.map((warning) => (
            <p
              key={warning}
              className="flex items-start gap-2 text-sm text-amber-200/80 leading-relaxed"
              role="alert"
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-400/70" aria-hidden />
              {warning}
            </p>
          ))}
        </div>
      )}

      {analysis.missingInfo.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground/50 tracking-wide">
            What&apos;s missing
          </p>
          <ul className="space-y-3">
            {analysis.missingInfo.map((item) => (
              <li
                key={item.dimension}
                className="rounded-xl border border-white/[0.05] bg-white/[0.015] px-4 py-3.5 space-y-1.5"
              >
                <p className="text-sm font-medium text-foreground/85">{item.label}</p>
                <p className="text-sm text-muted-foreground/60 leading-relaxed">
                  {item.whyItMatters}
                </p>
                <p className="text-xs text-muted-foreground/45 leading-relaxed">
                  Try: {item.suggestion}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
