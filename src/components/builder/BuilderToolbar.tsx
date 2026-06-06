import { ArrowLeft, Check, Cloud, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AutosaveStatus } from "@/hooks/use-autosave";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

interface BuilderToolbarProps {
  title: string;
  onTitleChange: (title: string) => void;
  saveStatus: AutosaveStatus;
}

export function BuilderToolbar({ title, onTitleChange, saveStatus }: BuilderToolbarProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 border-b border-hairline bg-surface-subtle/40 backdrop-blur-xl sticky top-0 z-20">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="rounded-xl flex-shrink-0 h-9 w-9 text-muted-foreground hover:text-foreground"
        >
          <Link to={ROUTES.app} aria-label="Back to dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
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

      <div
        className={cn(
          "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors self-start sm:self-auto",
          saveStatus === "saved"
            ? "text-emerald-400 border-emerald-500/25 bg-emerald-500/10"
            : saveStatus === "saving" || saveStatus === "pending"
              ? "text-violet-300 border-violet-500/25 bg-violet-500/10"
              : "text-muted-foreground border-hairline bg-surface-subtle/50"
        )}
        role="status"
        aria-live="polite"
      >
        {saveStatus === "saved" ? (
          <>
            <Check className="h-3.5 w-3.5" />
            Saved
          </>
        ) : saveStatus === "saving" || saveStatus === "pending" ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Saving…
          </>
        ) : (
          <>
            <Cloud className="h-3.5 w-3.5" />
            Autosave on
          </>
        )}
      </div>
    </header>
  );
}
