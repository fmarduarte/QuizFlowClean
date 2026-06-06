import { cn } from "@/lib/utils";

const TOTAL_STEPS = 5;

interface OnboardingProgressProps {
  currentStep: number;
}

export function OnboardingProgress({ currentStep }: OnboardingProgressProps) {
  return (
    <div
      className="flex items-center justify-center gap-1.5"
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={TOTAL_STEPS}
      aria-label={`Step ${currentStep} of ${TOTAL_STEPS}`}
    >
      {Array.from({ length: TOTAL_STEPS }, (_, i) => {
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
  );
}
