import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AIConfidenceResult } from "@/lib/ai-confidence";

interface AIConfidenceSummaryProps {
  result: AIConfidenceResult;
}

export function AIConfidenceSummary({ result }: AIConfidenceSummaryProps) {
  const isHigh = result.confidence >= 90;
  const isReady = result.canGenerate;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-baseline gap-3">
        <span
          className={cn(
            "text-3xl font-semibold tabular-nums tracking-tight",
            isHigh ? "text-foreground" : isReady ? "text-foreground/90" : "text-foreground/70"
          )}
        >
          {result.confidence}%
        </span>
        <span className="text-xs text-muted-foreground/45 uppercase tracking-wider">
          AI Confidence
        </span>
      </div>

      <p
        className={cn(
          "text-sm leading-relaxed",
          isReady ? "text-muted-foreground/70" : "text-muted-foreground/55"
        )}
      >
        {result.message}
      </p>

      {isReady && (
        <div className="rounded-xl border border-white/[0.06] overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
            <Sparkles className="h-3.5 w-3.5 text-violet-400/50" aria-hidden />
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground/45">
              AI Understanding
            </span>
          </div>
          <pre className="px-4 py-4 text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap font-sans">
            {result.understandingSummary}
          </pre>
        </div>
      )}
    </div>
  );
}
