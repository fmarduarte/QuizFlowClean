import { FunnelCoachPanel } from "@/components/app/FunnelCoachPanel";
import type { BriefProtectionReport } from "@/lib/brief-protection";
import type { FunnelBriefField } from "@/lib/funnel-brief";

interface FunnelBriefQualityProps {
  report: BriefProtectionReport;
  onApplySuggestion?: (field: FunnelBriefField, value: string) => void;
}

/** @deprecated Use FunnelCoachPanel directly */
export function FunnelBriefQuality({ report, onApplySuggestion }: FunnelBriefQualityProps) {
  return (
    <FunnelCoachPanel
      report={report}
      onApplySuggestion={onApplySuggestion}
      compact
      showFieldBreakdown={false}
    />
  );
}
