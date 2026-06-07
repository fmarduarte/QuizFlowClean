import type { FunnelStatus, Quiz } from "@/types/quiz";
import { cn } from "@/lib/utils";

export function getFunnelStatus(quiz: Pick<Quiz, "status" | "published">): FunnelStatus {
  if (quiz.status) return quiz.status;
  return quiz.published ? "published" : "draft";
}

export function isPublishedFunnel(quiz: Pick<Quiz, "status" | "published">): boolean {
  return getFunnelStatus(quiz) === "published";
}

export const STATUS_LABELS: Record<FunnelStatus, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

export function statusBadgeClass(status: FunnelStatus): string {
  return cn(
    "inline-flex text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full border",
    status === "published" && "text-emerald-300 border-emerald-500/25 bg-emerald-500/10",
    status === "draft" && "text-muted-foreground border-hairline bg-surface-subtle/60",
    status === "archived" && "text-amber-200/80 border-amber-500/25 bg-amber-500/10"
  );
}
