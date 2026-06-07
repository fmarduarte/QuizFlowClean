import { FunnelCoachPanel } from "@/components/app/FunnelCoachPanel";
import type { BriefProtectionReport } from "@/lib/brief-protection";
import type { FunnelBriefField } from "@/lib/funnel-brief";

interface BriefReviewPanelProps {
  report: BriefProtectionReport;
  onApplySuggestion?: (field: FunnelBriefField, value: string) => void;
}

export function BriefReviewPanel({ report, onApplySuggestion }: BriefReviewPanelProps) {
  if (report.blockReasons.length > 0 && !report.canGenerate) {
    return (
      <div className="space-y-4">
        <div className="coach-glass rounded-2xl p-4 sm:p-5 space-y-2">
          <p className="text-sm font-medium">Almost there</p>
          <p className="text-xs text-muted-foreground/80 leading-relaxed">
            Fix the items below, then generate your funnel.
          </p>
          <ul className="space-y-2 pt-1">
            {report.blockReasons.map((reason) => (
              <li
                key={reason}
                className="text-xs text-muted-foreground/90 leading-relaxed rounded-xl bg-white/[0.03] border border-white/5 px-3 py-2.5"
              >
                {reason}
              </li>
            ))}
          </ul>
        </div>
        <FunnelCoachPanel
          report={report}
          onApplySuggestion={onApplySuggestion}
          showFieldBreakdown
        />
      </div>
    );
  }

  return (
    <FunnelCoachPanel
      report={report}
      onApplySuggestion={onApplySuggestion}
      showFieldBreakdown
    />
  );
}
