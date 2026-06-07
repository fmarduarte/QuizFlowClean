import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileQuestion, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuizAnalyticsPanel } from "@/components/quiz/QuizAnalyticsPanel";
import { QuizStatusBadge } from "@/components/quiz/QuizStatusBadge";
import { useQuizzes } from "@/context/QuizzesContext";
import { usePageMeta } from "@/hooks/use-page-meta";
import { getAnswerLabel } from "@/lib/quiz-analytics";
import { fetchResponsesForQuiz } from "@/lib/quiz-responses";
import { PAGE_META } from "@/lib/seo";
import { ROUTES } from "@/lib/routes";
import { isQuizPublished } from "@/lib/quiz-status";
import type { QuizResponse } from "@/types/quiz";

export function QuizResponsesPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const { getQuiz } = useQuizzes();
  const quiz = quizId ? getQuiz(quizId) : undefined;
  const [responses, setResponses] = useState<QuizResponse[] | null>(null);

  usePageMeta({
    title: quiz ? `Responses · ${quiz.title}` : "Quiz Responses",
    description: "View quiz responses and analytics.",
    robots: PAGE_META.builder.robots,
    canonical: undefined,
  });

  useEffect(() => {
    if (!quizId) return;
    let cancelled = false;
    fetchResponsesForQuiz(quizId).then((data) => {
      if (!cancelled) setResponses(data);
    });
    return () => {
      cancelled = true;
    };
  }, [quizId]);

  if (!quiz) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-xl font-semibold tracking-tight">Quiz not found</h1>
        <Button asChild className="mt-6 rounded-xl">
          <Link to={ROUTES.appFunnels}>Back to My Quizzes</Link>
        </Button>
      </div>
    );
  }

  if (responses === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground mt-3">Loading responses…</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          asChild
          className="self-start rounded-xl text-muted-foreground hover:text-foreground -ml-2"
        >
          <Link to={isQuizPublished(quiz) ? ROUTES.quizShare(quiz.id) : ROUTES.quizEdit(quiz.id)}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/50 mb-1">
              Responses & Analytics
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{quiz.title}</h1>
            <p className="text-sm text-muted-foreground mt-2">
              {responses.length} response{responses.length === 1 ? "" : "s"} collected
            </p>
          </div>
          <QuizStatusBadge quiz={quiz} />
        </div>
      </div>

      <QuizAnalyticsPanel quiz={quiz} responses={responses} />

      <div className="rounded-2xl border border-hairline overflow-hidden">
        <div className="px-4 py-3 border-b border-hairline bg-surface-subtle/30">
          <h2 className="text-sm font-semibold">All responses</h2>
        </div>

        {responses.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No responses yet. Share your quiz link to start collecting leads.
          </div>
        ) : (
          <div className="divide-y divide-hairline">
            {responses.map((response) => (
              <article key={response.id} className="p-4 sm:p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">
                      {response.leadName || "Anonymous"}{" "}
                      {response.leadEmail && (
                        <span className="text-muted-foreground font-normal">
                          · {response.leadEmail}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDistanceToNow(new Date(response.completedAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <ul className="space-y-1">
                  {quiz.questions.map((question) => {
                    const optionId = response.answers[question.id];
                    if (!optionId) return null;
                    return (
                      <li key={question.id} className="text-xs text-muted-foreground">
                        <span className="text-foreground/80">{question.title}:</span>{" "}
                        {getAnswerLabel(quiz, question.id, optionId)}
                      </li>
                    );
                  })}
                </ul>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
