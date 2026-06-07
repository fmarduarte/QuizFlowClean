import { useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Bookmark, Copy, ExternalLink, Pencil, Trash2, BarChart3, Archive } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQuizzes } from "@/context/QuizzesContext";
import { getFunnelStatus, isPublishedFunnel, STATUS_LABELS, statusBadgeClass } from "@/lib/funnel-status";
import { buildPublicQuizUrl } from "@/lib/quiz-publish";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function SavedQuizzesSection() {
  const { quizzes, loading, removeQuiz, archiveQuiz } = useQuizzes();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function copyLink(quizId: string, url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(quizId);
      window.setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(null);
    }
  }

  if (loading) {
    return (
      <Card className="glass border-hairline border-dashed">
        <CardContent className="py-16 flex flex-col items-center text-center">
          <p className="text-sm text-muted-foreground">Loading your funnels…</p>
        </CardContent>
      </Card>
    );
  }

  if (quizzes.length === 0) {
    return (
      <Card className="glass border-hairline border-dashed">
        <CardContent className="py-16 flex flex-col items-center text-center">
          <Bookmark className="h-10 w-10 text-muted-foreground/60 mb-4" />
          <p className="font-medium">No funnels yet</p>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm">
            Create your first funnel to get started.
          </p>
          <Button asChild className="mt-6 rounded-xl btn-shimmer text-white border-0 bg-accent-gradient shadow-glow">
            <Link to={ROUTES.app}>Create funnel</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {quizzes.map((quiz, i) => {
        const status = getFunnelStatus(quiz);
        const published = isPublishedFunnel(quiz);
        const publicUrl = published ? buildPublicQuizUrl(quiz) : null;

        return (
          <article
            key={quiz.id}
            className="glass rounded-2xl p-5 sm:p-6 border border-hairline hover-lift transition-all duration-300"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-semibold tracking-tight">{quiz.title}</h3>
                    <span className={statusBadgeClass(status)}>{STATUS_LABELS[status]}</span>
                  </div>
                  {quiz.brief?.funnelTypeLabel && (
                    <p className="text-xs text-violet-300/80 mt-1">{quiz.brief.funnelTypeLabel}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {quiz.questions.length} steps · Updated{" "}
                    {formatDistanceToNow(new Date(quiz.updatedAt), { addSuffix: true })}
                  </p>
                  <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                    Last updated {format(new Date(quiz.updatedAt), "MMM d, yyyy · HH:mm")}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button variant="outline" size="sm" asChild className="rounded-xl border-hairline">
                    <Link to={ROUTES.quizEdit(quiz.id)}>
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-xl text-muted-foreground hover:text-destructive"
                    onClick={() => removeQuiz(quiz.id)}
                    aria-label={`Delete ${quiz.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {publicUrl && (
                <div className="space-y-3 pt-3 border-t border-hairline/60">
                  <div className="space-y-1.5">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground/50">
                      Public URL
                    </p>
                    <div className="flex gap-2">
                      <Input
                        readOnly
                        value={publicUrl}
                        className="h-9 text-xs font-mono bg-surface-subtle/40 border-hairline"
                        aria-label="Public funnel URL"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => void copyLink(quiz.id, publicUrl)}
                        className={cn(
                          "rounded-xl border-hairline shrink-0",
                          copiedId === quiz.id && "text-emerald-400 border-emerald-500/30"
                        )}
                      >
                        <Copy className="h-3.5 w-3.5" />
                        {copiedId === quiz.id ? "Copied" : "Copy link"}
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      asChild
                      className="rounded-xl border-hairline"
                    >
                      <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3.5 w-3.5" />
                        Open funnel
                      </a>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      asChild
                      className="rounded-xl border-hairline"
                    >
                      <Link to={ROUTES.funnelResponses(quiz.id)}>
                        <BarChart3 className="h-3.5 w-3.5" />
                        View responses
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void archiveQuiz(quiz.id)}
                      className="rounded-xl border-hairline"
                    >
                      <Archive className="h-3.5 w-3.5" />
                      Archive
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
