import { cn } from "@/lib/utils";

const STEPS = [
  { num: 1, label: "Funnel Type" },
  { num: 2, label: "Business Brief" },
  { num: 3, label: "Review & Generate" },
] as const;

interface WizardStepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

export function WizardStepIndicator({ currentStep }: WizardStepIndicatorProps) {
  return (
    <nav aria-label="Create funnel progress" className="flex items-center justify-center gap-2 sm:gap-4">
      {STEPS.map((step, i) => {
        const done = step.num < currentStep;
        const active = step.num === currentStep;

        return (
          <div key={step.num} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium tabular-nums transition-colors",
                  active && "bg-violet-500/20 text-violet-200 ring-1 ring-violet-500/30",
                  done && "bg-violet-500/10 text-violet-300/80",
                  !active && !done && "bg-muted/40 text-muted-foreground/50"
                )}
              >
                {step.num}
              </span>
              <span
                className={cn(
                  "text-xs sm:text-sm hidden sm:inline",
                  active ? "text-foreground font-medium" : "text-muted-foreground/60"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-px w-6 sm:w-10",
                  done ? "bg-violet-500/25" : "bg-hairline"
                )}
                aria-hidden
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
