import type { AIQuizUnderstanding } from "@/lib/ai-quiz-understanding";

interface AIUnderstandingStepProps {
  understanding: AIQuizUnderstanding;
}

const ROWS: Array<{ key: keyof AIQuizUnderstanding; label: string }> = [
  { key: "business", label: "Business" },
  { key: "audience", label: "Audience" },
  { key: "goal", label: "Goal" },
  { key: "recommendedQuizType", label: "Recommended Quiz Type" },
  { key: "estimatedQuestions", label: "Estimated Questions" },
];

export function AIUnderstandingStep({ understanding }: AIUnderstandingStepProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
        <div className="px-4 py-3 sm:px-5 border-b border-white/[0.06] bg-white/[0.02]">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground/45">
            AI Understanding
          </p>
          <p className="text-sm text-muted-foreground/55 mt-1">
            I understand your business and will generate a quiz funnel — not a generic marketing
            funnel.
          </p>
        </div>

        <div className="divide-y divide-white/[0.06]">
          {ROWS.map(({ key, label }) => (
            <div key={key} className="px-4 py-3.5 sm:px-5">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground/45 mb-1">
                {label}
              </p>
              <p className="text-sm text-foreground/90 leading-relaxed">
                {key === "estimatedQuestions"
                  ? `${understanding.estimatedQuestions} questions`
                  : String(understanding[key])}
              </p>
            </div>
          ))}

          <div className="px-4 py-3.5 sm:px-5">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground/45 mb-1">
              Recommendation Logic
            </p>
            <p className="text-sm text-muted-foreground/70 leading-relaxed">
              {understanding.recommendationLogic}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
