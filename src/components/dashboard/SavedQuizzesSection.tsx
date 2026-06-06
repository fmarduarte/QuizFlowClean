import { formatDistanceToNow } from "date-fns";
import { Bookmark, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuizzes } from "@/context/QuizzesContext";
import { ROUTES } from "@/lib/routes";

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
        <article
          key={quiz.id}
          className="glass rounded-2xl p-5 sm:p-6 border border-hairline hover-lift transition-all duration-300"
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold tracking-tight">{quiz.title}</h3>
              {quiz.brief?.funnelTypeLabel && (
                <p className="text-xs text-violet-300/80 mt-1">{quiz.brief.funnelTypeLabel}</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                {quiz.questions.length} steps ·{" "}
                {formatDistanceToNow(new Date(quiz.createdAt), { addSuffix: true })}
              </p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="rounded-xl border-hairline"
              >
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
        </article>
      ))}
    </div>
  );
}
