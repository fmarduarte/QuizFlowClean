import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LanguageChoiceModalProps {
  open: boolean;
  languageLabel: string;
  onTranslateOptimize: () => void;
  onContinueOriginal: () => void;
  onOpenChange: (open: boolean) => void;
}

export function LanguageChoiceModal({
  open,
  languageLabel,
  onTranslateOptimize,
  onContinueOriginal,
  onOpenChange,
}: LanguageChoiceModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl border-hairline glass-strong sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-xl bg-violet-500/15 flex items-center justify-center">
              <Languages className="h-5 w-5 text-violet-400" />
            </div>
            <DialogTitle>Input language detected</DialogTitle>
          </div>
          <DialogDescription className="text-left leading-relaxed pt-2">
            Your input language was detected as <strong>{languageLabel}</strong>.
            <br />
            <br />
            For best results, QuizFlow AI can automatically translate and optimize your input for
            AI generation.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-col gap-2 sm:gap-2">
          <Button
            type="button"
            onClick={onTranslateOptimize}
            className="w-full rounded-xl btn-shimmer text-white border-0 bg-accent-gradient shadow-glow"
          >
            Translate &amp; Optimize
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onContinueOriginal}
            className="w-full rounded-xl border-hairline"
          >
            Continue in Original Language
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
