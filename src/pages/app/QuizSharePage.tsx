import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileQuestion, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuizSharePanel } from "@/components/quiz/QuizSharePanel";
import { QuizStatusBadge } from "@/components/quiz/QuizStatusBadge";
import { QuizWorkflowSteps } from "@/components/quiz/QuizWorkflowSteps";
import { useQuizzes } from "@/context/QuizzesContext";
import { usePageMeta } from "@/hooks/use-page-meta";
import { PAGE_META } from "@/lib/seo";
import { ROUTES } from "@/lib/routes";
import { PRODUCT_COPY } from "@/lib/product-copy";
import { isQuizPublished } from "@/lib/quiz-status";

export function QuizSharePage() {
  const { quizId } = useParams<{ quizId: string }>();
  const { getQuiz } = useQuizzes();
  const quiz = quizId ? getQuiz(quizId) : undefined;
  const published = quiz ? isQuizPublished(quiz) : false;

  usePageMeta({
    title: quiz ? `Share ${quiz.title} | ${PAGE_META.builder.title}` : PAGE_META.builder.title,
    description: "Share your published quiz and collect responses.",
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

  if (!published) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 px-4 space-y-4">
        <QuizStatusBadge quiz={quiz} className="mx-auto" />
        <h1 className="text-xl font-semibold tracking-tight">This quiz is not published yet</h1>
        <p className="text-sm text-muted-foreground">
          Review and publish your quiz before sharing it with your audience.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button asChild variant="outline" className="rounded-xl border-hairline">
            <Link to={ROUTES.quizReview(quiz.id)}>Review Quiz</Link>
          </Button>
          <Button asChild className="rounded-xl btn-shimmer text-white border-0 bg-accent-gradient shadow-glow">
            <Link to={ROUTES.quizPublish(quiz.id)}>{PRODUCT_COPY.quiz.publish}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          asChild
          className="self-start rounded-xl text-muted-foreground hover:text-foreground -ml-2"
        >
          <Link to={ROUTES.appFunnels}>
            <ArrowLeft className="h-4 w-4" />
            Back to My Quizzes
          </Link>
        </Button>

        <QuizWorkflowSteps current="share" />

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/50 mb-1">
              {PRODUCT_COPY.quiz.share}
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{quiz.title}</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Share your quiz link and start collecting responses
            </p>
          </div>
          <QuizStatusBadge quiz={quiz} />
        </div>
      </div>

      <QuizSharePanel quiz={quiz} />

      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
        <Button variant="outline" asChild className="rounded-xl border-hairline">
          <Link to={ROUTES.quizEdit(quiz.id)}>
            <Pencil className="h-4 w-4" />
            Edit Quiz
          </Link>
        </Button>
        <Button asChild className="rounded-xl btn-shimmer text-white border-0 bg-accent-gradient shadow-glow">
          <Link to={ROUTES.quizReview(quiz.id)}>View Review</Link>
        </Button>
      </div>
    </div>
  );
}
