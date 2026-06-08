import type { OnboardingOption } from "@/lib/onboarding-options";
import { cn } from "@/lib/utils";

interface OnboardingOptionGridProps {
  options: OnboardingOption[];
  selected: string | null;
  onSelect: (id: string) => void;
  columns?: 2 | 3;
}

export function OnboardingOptionGrid({
  options,
  selected,
  onSelect,
  columns = 2,
}: OnboardingOptionGridProps) {
  return (
    <div
      className={cn(
        "grid gap-2.5",
        columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
      )}
    >
      {options.map((option) => {
        const isSelected = selected === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className={cn(
              "group text-left rounded-xl border px-4 py-3.5 transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20",
              isSelected
                ? "border-white/20 bg-white/[0.06] shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
                : "border-white/[0.06] bg-transparent hover:border-white/12 hover:bg-white/[0.02]"
            )}
          >
            <span
              className={cn(
                "text-sm font-medium tracking-tight transition-colors",
                isSelected ? "text-foreground" : "text-foreground/80 group-hover:text-foreground"
              )}
            >
              {option.label}
            </span>
            {option.description && (
              <span className="mt-1 block text-xs text-muted-foreground/50 leading-relaxed">
                {option.description}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
