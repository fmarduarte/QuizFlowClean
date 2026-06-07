import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileQuestion, Loader2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuizStatusBadge } from "@/components/quiz/QuizStatusBadge";
import { QuizValidationPanel } from "@/components/quiz/QuizValidationPanel";
import { QuizWorkflowSteps } from "@/components/quiz/QuizWorkflowSteps";
import { useAuth } from "@/context/AuthContext";
import { useQuizzes } from "@/context/QuizzesContext";
import { usePageMeta } from "@/hooks/use-page-meta";
import { validateQuizForPublish } from "@/lib/quiz-validation";
import { PAGE_META } from "@/lib/seo";
import { ROUTES } from "@/lib/routes";
import { PRODUCT_COPY } from "@/lib/product-copy";
import { publishQuizToServer } from "@/lib/quiz-published-store";
import { isQuizPublished, statusToPublishedFields } from "@/lib/quiz-status";

export function QuizPublishPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getQuiz, updateQuiz } = useQuizzes();
  const quiz = quizId ? getQuiz(quizId) : undefined;
  const validation = quiz ? validateQuizForPublish(quiz) : null;
  const published = quiz ? isQuizPublished(quiz) : false;
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  usePageMeta({
    title: quiz ? `Publish ${quiz.title} | ${PAGE_META.builder.title}` : PAGE_META.builder.title,
    description: "Publish your quiz and make it live.",
    robots: PAGE_META.builder.robots,
    canonical: undefined,
  });

  useEffect(() => {
    if (quiz && published) {
      navigate(ROUTES.quizShare(quiz.id), { replace: true });
    }
  }, [quiz, published, navigate]);

  async function handlePublish() {
    if (!quizId || !quiz || !validation?.valid || !user?.id) return;
    setPublishing(true);
    setPublishError(null);

    const publishedQuiz = updateQuiz(quizId, statusToPublishedFields("published"));
    if (publishedQuiz) {
      const ok = await publishQuizToServer(publishedQuiz, user.id);
      if (!ok) {
        setPublishError(
          "Quiz saved locally but cloud publish failed. Run the Supabase migration and try again."
        );
        setPublishing(false);
        return;
      }
    }

    navigate(ROUTES.quizShare(quizId));
  }

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

  if (published) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          asChild
          className="self-start rounded-xl text-muted-foreground hover:text-foreground -ml-2"
        >
          <Link to={ROUTES.quizReview(quiz.id)}>
            <ArrowLeft className="h-4 w-4" />
            Back to review
          </Link>
        </Button>

        <QuizWorkflowSteps current="publish" />

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/50 mb-1">
              {PRODUCT_COPY.quiz.publish}
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{quiz.title}</h1>
            <p className="text-sm text-muted-foreground mt-2">
              {quiz.questions.length} question{quiz.questions.length === 1 ? "" : "s"} · Ready to
              go live
            </p>
          </div>
          <QuizStatusBadge quiz={quiz} />
        </div>
      </div>

      <QuizValidationPanel quiz={quiz} />

      <div className="rounded-2xl border border-hairline bg-surface-subtle/30 p-5 sm:p-6 space-y-4">
        <h2 className="text-sm font-semibold">What happens when you publish?</h2>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>• Your quiz gets a public link you can share anywhere</li>
          <li>• Anyone with the link can take the quiz and submit their lead details</li>
          <li>• Responses and analytics appear on your share and responses pages</li>
        </ul>
      </div>

      {publishError && (
        <p className="text-sm text-amber-300" role="alert">
          {publishError}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
        <Button variant="outline" asChild className="rounded-xl border-hairline">
          <Link to={ROUTES.quizReview(quiz.id)}>Back to Review</Link>
        </Button>
        <Button
          className="rounded-xl btn-shimmer text-white border-0 bg-accent-gradient shadow-glow"
          disabled={!validation?.valid || publishing || !user?.id}
          onClick={handlePublish}
        >
          {publishing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Rocket className="h-4 w-4" />
          )}
          {publishing ? "Publishing…" : PRODUCT_COPY.quiz.publish}
        </Button>
      </div>
    </div>
  );
}
