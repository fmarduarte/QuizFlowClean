import type { OnboardingOption } from "@/lib/onboarding-options";
import { cn } from "@/lib/utils";

interface GoalOptionListProps {
  options: OnboardingOption[];
  selected: string | null;
  onSelect: (id: string) => void;
  guidance?: string | null;
}

export function GoalOptionList({ options, selected, onSelect, guidance }: GoalOptionListProps) {
  return (
    <div className="space-y-3 animate-fade-in">
      {guidance && (
        <p className="text-sm sm:text-base text-muted-foreground/60 leading-relaxed mb-6">{guidance}</p>
      )}

      <div className="flex flex-col gap-2.5">
        {options.map((option) => {
          const isSelected = selected === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              className={cn(
                "group w-full text-left rounded-2xl border px-5 py-4 sm:py-5 transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20",
                isSelected
                  ? "border-white/25 bg-white/[0.07] shadow-[0_0_24px_rgba(255,255,255,0.04)]"
                  : "border-white/[0.06] bg-transparent hover:border-white/15 hover:bg-white/[0.03]"
              )}
            >
              <span
                className={cn(
                  "block text-base sm:text-lg font-medium tracking-tight transition-colors",
                  isSelected ? "text-foreground" : "text-foreground/85 group-hover:text-foreground"
                )}
              >
                {option.label}
              </span>
              {option.description && (
                <span className="mt-1 block text-sm text-muted-foreground/50 leading-relaxed">
                  {option.description}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
