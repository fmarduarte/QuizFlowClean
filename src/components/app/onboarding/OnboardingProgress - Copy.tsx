import { cn } from "@/lib/utils";

export const ONBOARDING_TOTAL_STEPS = 6;

const STEP_LABELS = [
  "Quiz Type",
  "Business",
  "Audience",
  "Goal",
  "Details",
  "Review",
] as const;

interface OnboardingProgressProps {
  currentStep: number;
}

export function OnboardingProgress({ currentStep }: OnboardingProgressProps) {
  return (
    <div className="space-y-3">
      <div
        className="flex items-center justify-center gap-1.5"
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={ONBOARDING_TOTAL_STEPS}
        aria-label={`Step ${currentStep} of ${ONBOARDING_TOTAL_STEPS}`}
      >
        {Array.from({ length: ONBOARDING_TOTAL_STEPS }, (_, i) => {
          const step = i + 1;
          const active = step === currentStep;
          const done = step < currentStep;
          return (
            <span
              key={step}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                active ? "w-6 bg-white/50" : done ? "w-1.5 bg-white/25" : "w-1.5 bg-white/[0.08]"
              )}
            />
          );
        })}
      </div>
      <p className="text-center text-[11px] text-muted-foreground/45 tracking-wide">
        Step {currentStep} · {STEP_LABELS[currentStep - 1]}
      </p>
    </div>
  );
}
