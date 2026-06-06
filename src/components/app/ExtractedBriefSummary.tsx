import { Sparkles } from "lucide-react";
import type { FunnelBriefValues } from "@/lib/funnel-brief";

const ROWS = [
  { key: "businessNiche" as const, label: "Business" },
  { key: "productOffer" as const, label: "Offer" },
  { key: "targetAudience" as const, label: "Audience" },
  { key: "goal" as const, label: "Goal" },
];

interface ExtractedBriefSummaryProps {
  values: Pick<FunnelBriefValues, "businessNiche" | "productOffer" | "targetAudience" | "goal">;
}

export function ExtractedBriefSummary({ values }: ExtractedBriefSummaryProps) {
  return (
    <div className="animate-fade-in space-y-4 pt-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
        <Sparkles className="h-3.5 w-3.5 text-violet-400/60" />
        Identified by AI
      </div>
      <div className="rounded-2xl border border-white/[0.06] divide-y divide-white/[0.06] overflow-hidden">
        {ROWS.map(({ key, label }) => {
          const text = values[key]?.trim();
          if (!text) return null;
          return (
            <div key={key} className="px-4 py-3.5 sm:px-5 sm:py-4">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground/45 mb-1">
                {label}
              </p>
              <p className="text-sm text-foreground/90 leading-relaxed">{text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
