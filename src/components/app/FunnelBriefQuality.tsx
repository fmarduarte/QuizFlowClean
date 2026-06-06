import { Progress } from "@/components/ui/progress";
import { MIN_BRIEF_QUALITY_SCORE } from "@/lib/input-coach";
import type { BriefQualityResult } from "@/lib/funnel-brief";
import { cn } from "@/lib/utils";

interface FunnelBriefQualityProps {
  quality: BriefQualityResult;
}

const labelStyles: Record<BriefQualityResult["label"], string> = {
  Poor: "text-red-400",
  Basic: "text-amber-400",
  Good: "text-emerald-400",
  Excellent: "text-violet-400",
};

export function FunnelBriefQuality({ quality }: FunnelBriefQualityProps) {
  return (
    <div className="rounded-xl border border-hairline bg-background/40 p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Funnel brief quality</p>
          <p className="text-xs text-muted-foreground mt-0.5">{quality.hint}</p>
        </div>
        <span
          className={cn(
            "text-sm font-semibold tabular-nums shrink-0",
            labelStyles[quality.label]
          )}
        >
          {quality.label}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Progress value={quality.score} className="h-2 flex-1 bg-muted" />
        <span className="text-xs text-muted-foreground tabular-nums w-10 text-right">
          {quality.score}%
        </span>
      </div>
      {!quality.canGenerate && quality.score > 0 && (
        <p className="text-[11px] text-amber-400/90">
          Minimum {MIN_BRIEF_QUALITY_SCORE}% required to generate.
        </p>
      )}
    </div>
  );
}
