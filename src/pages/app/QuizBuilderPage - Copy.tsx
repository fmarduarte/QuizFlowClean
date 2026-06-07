import { Link, useParams } from "react-router-dom";
import { FileQuestion } from "lucide-react";
import { QuizBuilder } from "@/components/builder/QuizBuilder";
import { Button } from "@/components/ui/button";
import { useQuizzes } from "@/context/QuizzesContext";
import { usePageMeta } from "@/hooks/use-page-meta";
import { PAGE_META } from "@/lib/seo";
import { ROUTES } from "@/lib/routes";
import type { Quiz } from "@/types/quiz";

export function QuizBuilderPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const { getQuiz, updateQuiz } = useQuizzes();
  const quiz = quizId ? getQuiz(quizId) : undefined;

  usePageMeta({
    title: quiz ? `${quiz.title} | ${PAGE_META.builder.title}` : PAGE_META.builder.title,
    description: PAGE_META.builder.description,
    robots: PAGE_META.builder.robots,
    canonical: undefined,
  });

  function handleSave(draft: Quiz) {
    if (!quizId) return;
    updateQuiz(quizId, {
      title: draft.title,
      description: draft.description,
      questions: draft.questions,
      published: draft.published,
      publishedAt: draft.publishedAt,
    });
  }

  function handlePublish(draft: Quiz) {
    if (!quizId || draft.questions.length === 0) return;
    updateQuiz(quizId, {
      title: draft.title,
      description: draft.description,
      questions: draft.questions,
      published: true,
      publishedAt: new Date().toISOString(),
    });
  }

  if (!quiz) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-xl font-semibold tracking-tight">Funnel not found</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm">
          This funnel may have been deleted or the link is incorrect.
        </p>
        <Button asChild className="mt-6 rounded-xl">
          <Link to={ROUTES.app}>Back to dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <QuizBuilder
      key={quiz.id}
      quiz={quiz}
      onSave={handleSave}
      onPublish={handlePublish}
      isPublished={Boolean(quiz.published)}
    />
  );
}
