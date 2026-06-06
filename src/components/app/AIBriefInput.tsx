import { Textarea } from "@/components/ui/textarea";
import { FunnelReadinessPanel } from "@/components/app/FunnelReadinessPanel";
import type { FunnelReadinessAnalysis } from "@/lib/funnel-readiness";
import { cn } from "@/lib/utils";

const PLACEHOLDER =
  "I sell an AI Hook Generator for TikTok Shop creators who struggle to write viral product hooks. My goal is to generate leads for a free trial.";

interface AIBriefInputProps {
  value: string;
  onChange: (value: string) => void;
  readiness: FunnelReadinessAnalysis;
  disabled?: boolean;
}

export function AIBriefInput({ value, onChange, readiness, disabled }: AIBriefInputProps) {
  return (
    <div className="space-y-8">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={PLACEHOLDER}
        rows={7}
        aria-describedby="funnel-readiness-panel"
        className={cn(
          "min-h-[180px] sm:min-h-[220px] text-[15px] sm:text-base leading-[1.7]",
          "bg-transparent border border-white/[0.08] rounded-2xl resize-none",
          "focus-visible:ring-1 focus-visible:ring-white/15 focus-visible:border-white/15",
          "placeholder:text-muted-foreground/35 shadow-none",
          "transition-colors duration-200"
        )}
      />

      <div id="funnel-readiness-panel">
        <FunnelReadinessPanel analysis={readiness} />
      </div>
    </div>
  );
}
