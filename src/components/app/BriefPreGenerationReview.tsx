import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BriefReviewPanel } from "@/components/app/BriefReviewPanel";
import type { BriefProtectionReport } from "@/lib/brief-protection";

interface BriefPreGenerationReviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: BriefProtectionReport;
  onConfirm: () => void;
}

export function BriefPreGenerationReview({
  open,
  onOpenChange,
  report,
  onConfirm,
}: BriefPreGenerationReviewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl border-hairline glass-strong sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-xl bg-violet-500/15 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-violet-400" />
            </div>
            <DialogTitle>Review & generate</DialogTitle>
          </div>
          <DialogDescription className="text-left pt-1">
            Confirm your brief before AI generation.
          </DialogDescription>
        </DialogHeader>

        <BriefReviewPanel report={report} />

        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button
            type="button"
            onClick={onConfirm}
            disabled={!report.canGenerate}
            className="w-full rounded-xl btn-shimmer text-white border-0 bg-accent-gradient shadow-glow"
          >
            Generate funnel
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full rounded-xl border-hairline"
          >
            Edit brief
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
