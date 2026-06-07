import { CheckCircle2 } from "lucide-react";
import type { FunnelResultScreen } from "@/types/quiz";
import { cn } from "@/lib/utils";

interface FunnelResultScreenProps {
  result: FunnelResultScreen;
  showRestart?: boolean;
  onRestart?: () => void;
  className?: string;
}

export function FunnelResultScreenView({
  result,
  showRestart,
  onRestart,
  className,
}: FunnelResultScreenProps) {
  const hasCta = Boolean(result.ctaLabel.trim() && result.ctaUrl.trim());

  return (
    <div
      className={cn(
        "flex flex-col flex-1 items-center justify-center text-center py-8 sm:py-12 px-2 gap-4 sm:gap-5",
        className
      )}
    >
      <CheckCircle2 className="h-10 w-10 sm:h-12 sm:w-12 text-emerald-400/80" />
      <div className="space-y-2 max-w-md">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-foreground">
          {result.thankYouTitle}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {result.thankYouMessage}
        </p>
      </div>

      {hasCta && (
        <a
          href={result.ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex w-full sm:w-auto min-w-[200px] items-center justify-center py-3 px-6 rounded-xl text-sm sm:text-base font-semibold btn-glow btn-shimmer text-white shadow-glow"
        >
          {result.ctaLabel}
        </a>
      )}

      {showRestart && onRestart && (
        <button
          type="button"
          onClick={onRestart}
          className="mt-2 text-xs text-violet-300 hover:text-violet-200 transition-colors"
        >
          Restart preview
        </button>
      )}
    </div>
  );
}
