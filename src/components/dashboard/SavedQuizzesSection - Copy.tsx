import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { BarChart3, Bookmark, ClipboardCheck, Pencil, Share2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QuizStatusBadge } from "@/components/quiz/QuizStatusBadge";
import { useQuizzes } from "@/context/QuizzesContext";
import { fetchResponseCount } from "@/lib/quiz-responses";
import { ROUTES } from "@/lib/routes";
import { isQuizPublished } from "@/lib/quiz-status";
import { PRODUCT_COPY } from "@/lib/product-copy";
import type { Quiz } from "@/types/quiz";

function useResponseCount(quizId: string, enabled: boolean) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      setCount(0);
      return;
    }
    let cancelled = false;
    fetchResponseCount(quizId).then((value) => {
      if (!cancelled) setCount(value);
    });
    return () => {
      cancelled = true;
    };
  }, [quizId, enabled]);

  return count;
}

function SavedQuizCard({
  quiz,
  index,
  onDelete,
}: {
  quiz: Quiz;
  index: number;
  onDelete: (id: string) => void;
}) {
  const published = isQuizPublished(quiz);
  const responseCount = useResponseCount(quiz.id, published);

  return (
    <article
      className="glass rounded-2xl p-5 sm:p-6 border border-hairline hover-lift transition-all duration-300"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold tracking-tight">{quiz.title}</h3>
            <QuizStatusBadge quiz={quiz} />
          </div>
          {quiz.brief?.funnelTypeLabel && (
            <p className="text-xs text-violet-300/80">{quiz.brief.funnelTypeLabel}</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            {quiz.questions.length} question{quiz.questions.length === 1 ? "" : "s"} ·{" "}
            {formatDistanceToNow(new Date(quiz.createdAt), { addSuffix: true })}
            {published && responseCount !== null && (
              <>
                {" "}
                · {responseCount} response{responseCount === 1 ? "" : "s"}
              </>
            )}
          </p>
          {!published && (
            <p className="text-xs text-amber-200/70 mt-2">
              Draft — review and publish to share with your audience.
            </p>
          )}
          {published && (
            <p className="text-xs text-emerald-300/80 mt-2">
              Published — share your link to collect leads and responses.
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 flex-wrap justify-end">
          <Button variant="outline" size="sm" asChild className="rounded-xl border-hairline">
            <Link to={ROUTES.quizEdit(quiz.id)}>
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Link>
          </Button>
          {published ? (
            <>
              <Button size="sm" asChild className="rounded-xl bg-white text-black hover:bg-white/90">
                <Link to={ROUTES.quizShare(quiz.id)}>
                  <Share2 className="h-3.5 w-3.5" />
                  Share
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="rounded-xl border-hairline">
                <Link to={ROUTES.quizResponses(quiz.id)}>
                  <BarChart3 className="h-3.5 w-3.5" />
                  Analytics
                </Link>
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" asChild className="rounded-xl border-hairline">
              <Link to={ROUTES.quizReview(quiz.id)}>
                <ClipboardCheck className="h-3.5 w-3.5" />
                {PRODUCT_COPY.quiz.review}
              </Link>
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-xl text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(quiz.id)}
            aria-label={`Delete ${quiz.title}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}

export function SavedQuizzesSection() {
  const { quizzes, removeQuiz } = useQuizzes();

  if (quizzes.length === 0) {
    return (
      <Card className="glass border-hairline border-dashed">
        <CardContent className="py-16 flex flex-col items-center text-center">
          <Bookmark className="h-10 w-10 text-muted-foreground/60 mb-4" />
          <p className="font-medium">No quizzes yet</p>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm">
            Generate your first AI quiz funnel to get started.
          </p>
          <Button asChild className="mt-6 rounded-xl btn-shimmer text-white border-0 bg-accent-gradient shadow-glow">
            <Link to={ROUTES.app}>Create Quiz Funnel</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {quizzes.map((quiz, i) => (
        <SavedQuizCard key={quiz.id} quiz={quiz} index={i} onDelete={removeQuiz} />
      ))}
    </div>
  );
}
