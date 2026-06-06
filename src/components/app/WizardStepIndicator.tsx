import { cn } from "@/lib/utils";

const STEPS = [
  { num: 1, label: "Funnel Type" },
  { num: 2, label: "AI Brief" },
] as const;

interface WizardStepIndicatorProps {
  currentStep: 1 | 2;
}

export function WizardStepIndicator({ currentStep }: WizardStepIndicatorProps) {
  return (
    <nav
      aria-label="Create funnel progress"
      className="flex items-center justify-center gap-2 sm:gap-4"
    >
      {STEPS.map((step, i) => {
        const done = step.num < currentStep;
        const active = step.num === currentStep;

        return (
          <div key={step.num} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-medium tabular-nums transition-colors",
                  active && "bg-white/10 text-foreground ring-1 ring-white/15",
                  done && "bg-white/5 text-muted-foreground",
                  !active && !done && "bg-white/[0.03] text-muted-foreground/40"
                )}
              >
                {step.num}
              </span>
              <span
                className={cn(
                  "text-xs hidden sm:inline",
                  active ? "text-foreground/90" : "text-muted-foreground/50"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn("h-px w-8 sm:w-12", done ? "bg-white/15" : "bg-white/[0.06]")}
                aria-hidden
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
