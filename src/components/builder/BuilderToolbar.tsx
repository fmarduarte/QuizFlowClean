import { ArrowLeft, Check, ClipboardCheck, Loader2, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuizStatusBadge } from "@/components/quiz/QuizStatusBadge";
import type { AutosaveStatus } from "@/hooks/use-autosave";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { PRODUCT_COPY } from "@/lib/product-copy";
import { isQuizPublished } from "@/lib/quiz-status";
import type { Quiz } from "@/types/quiz";

interface BuilderToolbarProps {
  quiz: Pick<Quiz, "id" | "status" | "published">;
  title: string;
  onTitleChange: (title: string) => void;
  saveStatus: AutosaveStatus;
  canReview?: boolean;
}

export function BuilderToolbar({
  quiz,
  title,
  onTitleChange,
  saveStatus,
  canReview = true,
}: BuilderToolbarProps) {
  const saveLabel =
    saveStatus === "pending"
      ? "Unsaved changes"
      : saveStatus === "saving"
        ? "Saving…"
        : saveStatus === "saved"
          ? "Saved"
          : null;

  const published = isQuizPublished(quiz);

  return (
    <header className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 border-b border-hairline bg-surface-subtle/40 backdrop-blur-xl sticky top-0 z-20">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="rounded-xl flex-shrink-0 h-9 w-9 text-muted-foreground hover:text-foreground"
        >
          <Link to={ROUTES.appFunnels} aria-label="Back to my quizzes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/40 mb-0.5">
            {PRODUCT_COPY.quiz.editor}
          </p>
          <label htmlFor="quiz-builder-title" className="sr-only">
            Quiz title
          </label>
          <Input
            id="quiz-builder-title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="h-9 border-transparent bg-transparent hover:bg-surface-elevated/50 focus-visible:bg-surface-elevated/80 focus-visible:border-hairline text-base sm:text-lg font-semibold tracking-tight px-2"
            placeholder="Untitled quiz"
            aria-label="Quiz title"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
        <QuizStatusBadge quiz={quiz} />

        {saveLabel && (
          <div
            className={cn(
              "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors",
              saveStatus === "saved"
                ? "text-emerald-400 border-emerald-500/25 bg-emerald-500/10"
                : saveStatus === "saving"
                  ? "text-violet-300 border-violet-500/25 bg-violet-500/10"
                  : "text-amber-200/80 border-amber-500/25 bg-amber-500/10"
            )}
            role="status"
            aria-live="polite"
          >
            {saveStatus === "saved" ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Loader2
                className={cn("h-3.5 w-3.5", saveStatus === "saving" && "animate-spin")}
              />
            )}
            {saveLabel}
          </div>
        )}

        {published ? (
          <Button
            asChild
            className="h-9 rounded-xl bg-white text-black hover:bg-white/90 text-xs font-medium px-4"
          >
            <Link to={ROUTES.quizShare(quiz.id)}>
              <Share2 className="h-3.5 w-3.5" />
              Share Quiz
            </Link>
          </Button>
        ) : canReview ? (
          <Button
            asChild
            className="h-9 rounded-xl bg-white text-black hover:bg-white/90 text-xs font-medium px-4"
          >
            <Link to={ROUTES.quizReview(quiz.id)}>
              <ClipboardCheck className="h-3.5 w-3.5" />
              {PRODUCT_COPY.quiz.review}
            </Link>
          </Button>
        ) : (
          <Button
            type="button"
            disabled
            className="h-9 rounded-xl bg-white/50 text-black/50 text-xs font-medium px-4"
          >
            <ClipboardCheck className="h-3.5 w-3.5" />
            {PRODUCT_COPY.quiz.review}
          </Button>
        )}
      </div>
    </header>
  );
}
