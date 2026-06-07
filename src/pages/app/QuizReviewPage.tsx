import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileQuestion, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuizLivePreview } from "@/components/builder/QuizLivePreview";
import { QuizStatusBadge } from "@/components/quiz/QuizStatusBadge";
import { QuizValidationPanel } from "@/components/quiz/QuizValidationPanel";
import { QuizWorkflowSteps } from "@/components/quiz/QuizWorkflowSteps";
import { useQuizzes } from "@/context/QuizzesContext";
import { usePageMeta } from "@/hooks/use-page-meta";
import { validateQuizForPublish } from "@/lib/quiz-validation";
import { PAGE_META } from "@/lib/seo";
import { ROUTES } from "@/lib/routes";
import { PRODUCT_COPY } from "@/lib/product-copy";
import { isQuizPublished } from "@/lib/quiz-status";

export function QuizReviewPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { getQuiz } = useQuizzes();
  const quiz = quizId ? getQuiz(quizId) : undefined;
  const validation = quiz ? validateQuizForPublish(quiz) : null;

  usePageMeta({
    title: quiz ? `Review ${quiz.title} | ${PAGE_META.builder.title}` : PAGE_META.builder.title,
    description: "Review your quiz before publishing.",
    robots: PAGE_META.builder.robots,
    canonical: undefined,
  });

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

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          asChild
          className="self-start rounded-xl text-muted-foreground hover:text-foreground -ml-2"
        >
          <Link to={ROUTES.quizEdit(quiz.id)}>
            <ArrowLeft className="h-4 w-4" />
            Back to editor
          </Link>
        </Button>

        <QuizWorkflowSteps current="review" />

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/50 mb-1">
              {PRODUCT_COPY.quiz.review}
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{quiz.title}</h1>
            <p className="text-sm text-muted-foreground mt-2">
              {quiz.questions.length} question{quiz.questions.length === 1 ? "" : "s"} · Review
              before you publish
            </p>
          </div>
          <QuizStatusBadge quiz={quiz} />
        </div>
      </div>

      <QuizValidationPanel quiz={quiz} />

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        <section className="rounded-2xl border border-hairline bg-surface-subtle/20 overflow-hidden">
          <div className="px-4 py-3 border-b border-hairline">
            <h2 className="text-sm font-semibold">Mobile preview</h2>
            <p className="text-xs text-muted-foreground mt-0.5">How it looks on phones</p>
          </div>
          <div className="min-h-[480px]">
            <QuizLivePreview quiz={quiz} mode="review" frame="mobile" />
          </div>
        </section>

        <section className="rounded-2xl border border-hairline bg-surface-subtle/20 overflow-hidden">
          <div className="px-4 py-3 border-b border-hairline">
            <h2 className="text-sm font-semibold">Desktop preview</h2>
            <p className="text-xs text-muted-foreground mt-0.5">How it looks on larger screens</p>
          </div>
          <div className="min-h-[480px]">
            <QuizLivePreview quiz={quiz} mode="review" frame="desktop" />
          </div>
        </section>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-2">
        <Button variant="outline" asChild className="rounded-xl border-hairline">
          <Link to={ROUTES.quizEdit(quiz.id)}>Edit Quiz</Link>
        </Button>
        <Button
          className="rounded-xl btn-shimmer text-white border-0 bg-accent-gradient shadow-glow"
          disabled={!validation?.valid}
          onClick={() =>
            navigate(isQuizPublished(quiz) ? ROUTES.quizShare(quiz.id) : ROUTES.quizPublish(quiz.id))
          }
        >
          <Rocket className="h-4 w-4" />
          {isQuizPublished(quiz) ? "View Share Page" : "Continue to Publish"}
        </Button>
      </div>
    </div>
  );
}
