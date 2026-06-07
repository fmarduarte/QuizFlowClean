import { ArrowLeft, Check, Loader2, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AutosaveStatus } from "@/hooks/use-autosave";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { PRODUCT_COPY } from "@/lib/product-copy";

interface BuilderToolbarProps {
  title: string;
  onTitleChange: (title: string) => void;
  saveStatus: AutosaveStatus;
  onPublish?: () => void;
  isPublished?: boolean;
  canPublish?: boolean;
}

export function BuilderToolbar({
  title,
  onTitleChange,
  saveStatus,
  onPublish,
  isPublished,
  canPublish = true,
}: BuilderToolbarProps) {
  const saveLabel =
    saveStatus === "pending"
      ? "Unsaved changes"
      : saveStatus === "saving"
        ? "Saving…"
        : saveStatus === "saved"
          ? "Saved"
          : null;

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

      <div className="flex items-center gap-2 self-start sm:self-auto">
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

        {isPublished ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border text-emerald-300 border-emerald-500/25 bg-emerald-500/10">
            <Rocket className="h-3.5 w-3.5" />
            Published
          </span>
        ) : onPublish ? (
          <Button
            type="button"
            onClick={onPublish}
            disabled={!canPublish}
            className="h-9 rounded-xl bg-white text-black hover:bg-white/90 text-xs font-medium px-4"
          >
            <Rocket className="h-3.5 w-3.5" />
            {PRODUCT_COPY.quiz.publish}
          </Button>
        ) : null}
      </div>
    </header>
  );
}
