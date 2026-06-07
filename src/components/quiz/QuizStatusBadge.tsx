import { Archive, FileEdit, Rocket } from "lucide-react";
import { QUIZ_STATUS_LABELS, resolveQuizStatus } from "@/lib/quiz-status";
import type { Quiz } from "@/types/quiz";
import { cn } from "@/lib/utils";

interface QuizStatusBadgeProps {
  quiz: Pick<Quiz, "status" | "published">;
  className?: string;
}

const STATUS_STYLES = {
  draft: {
    icon: FileEdit,
    className: "text-amber-200/90 border-amber-500/25 bg-amber-500/10",
  },
  published: {
    icon: Rocket,
    className: "text-emerald-300 border-emerald-500/25 bg-emerald-500/10",
  },
  archived: {
    icon: Archive,
    className: "text-muted-foreground border-hairline bg-surface-subtle/60",
  },
} as const;

export function QuizStatusBadge({ quiz, className }: QuizStatusBadgeProps) {
  const status = resolveQuizStatus(quiz);
  const config = STATUS_STYLES[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border",
        config.className,
        className
      )}
      role="status"
      aria-label={`Quiz status: ${QUIZ_STATUS_LABELS[status]}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {QUIZ_STATUS_LABELS[status]}
    </span>
  );
}
