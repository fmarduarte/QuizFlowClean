import { BarChart3, Mail, Users } from "lucide-react";
import { computeQuizAnalytics } from "@/lib/quiz-analytics";
import type { Quiz, QuizResponse } from "@/types/quiz";

interface QuizAnalyticsPanelProps {
  quiz: Quiz;
  responses: QuizResponse[];
}

export function QuizAnalyticsPanel({ quiz, responses }: QuizAnalyticsPanelProps) {
  const analytics = computeQuizAnalytics(quiz, responses);

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-hairline bg-surface-subtle/30 p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Users className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wider">Completions</span>
          </div>
          <p className="text-2xl font-semibold tabular-nums">{analytics.totalResponses}</p>
        </div>
        <div className="rounded-2xl border border-hairline bg-surface-subtle/30 p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Mail className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wider">Leads captured</span>
          </div>
          <p className="text-2xl font-semibold tabular-nums">{analytics.leadsCaptured}</p>
        </div>
        <div className="rounded-2xl border border-hairline bg-surface-subtle/30 p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <BarChart3 className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wider">Lead rate</span>
          </div>
          <p className="text-2xl font-semibold tabular-nums">{analytics.leadCaptureRate}%</p>
        </div>
      </div>

      {analytics.questionBreakdown.length > 0 && (
        <div className="rounded-2xl border border-hairline bg-surface-subtle/20 p-4 sm:p-5 space-y-4">
          <h3 className="text-sm font-semibold">Answer breakdown</h3>
          {analytics.questionBreakdown.map((question) => (
            <div key={question.questionId} className="space-y-2">
              <p className="text-xs font-medium text-foreground/90">{question.questionTitle}</p>
              <div className="space-y-1.5">
                {question.options.map((option) => (
                  <div key={option.optionId} className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-accent-gradient rounded-full transition-all"
                        style={{ width: `${option.percent}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-muted-foreground w-28 truncate">
                      {option.label}
                    </span>
                    <span className="text-[11px] font-mono tabular-nums text-muted-foreground w-12 text-right">
                      {option.count} ({option.percent}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
