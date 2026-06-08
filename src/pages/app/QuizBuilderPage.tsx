import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FileQuestion } from "lucide-react";
import { QuizBuilder } from "@/components/builder/QuizBuilder";
import { Button } from "@/components/ui/button";
import { FunnelStoreError, useQuizzes } from "@/context/QuizzesContext";
import { usePageMeta } from "@/hooks/use-page-meta";
import { isPublishedFunnel } from "@/lib/funnel-status";
import { buildPublicQuizUrl, validateQuizForPublish } from "@/lib/quiz-publish";
import { PAGE_META } from "@/lib/seo";
import { ROUTES } from "@/lib/routes";
import type { Quiz } from "@/types/quiz";

export function QuizBuilderPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const { getQuiz, updateQuiz, publishQuiz } = useQuizzes();
  const quiz = quizId ? getQuiz(quizId) : undefined;

  const [publishErrors, setPublishErrors] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [copied, setCopied] = useState(false);

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
      status: draft.status,
      result: draft.result,
      published: draft.published,
      publishedAt: draft.publishedAt,
      publicSlug: draft.publicSlug,
      publishedSnapshot: draft.publishedSnapshot,
    });
  }

  async function handlePublish(draft: Quiz) {
    if (!quizId) return;

    const validation = validateQuizForPublish(draft);
    if (!validation.valid) {
      setPublishErrors(validation.errors);
      return;
    }

    setPublishErrors([]);
    setIsPublishing(true);

    try {
      await publishQuiz(quizId, draft);
    } catch (err) {
      setPublishErrors([
        err instanceof FunnelStoreError
          ? err.message
          : "Could not publish your funnel. Please try again.",
      ]);
    } finally {
      setIsPublishing(false);
    }
  }

  async function handleCopyLink() {
    if (!quiz || !isPublishedFunnel(quiz)) return;
    try {
      await navigator.clipboard.writeText(buildPublicQuizUrl(quiz));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
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
          <Link to={ROUTES.appFunnels}>Back to my funnels</Link>
        </Button>
      </div>
    );
  }

  return (
    <QuizBuilder
      key={`${quiz.id}-${quiz.publishedAt ?? "draft"}`}
      quiz={quiz}
      onSave={handleSave}
      onPublish={(draft) => void handlePublish(draft)}
      onCopyLink={isPublishedFunnel(quiz) ? () => void handleCopyLink() : undefined}
      isPublishing={isPublishing}
      publishErrors={publishErrors}
      copied={copied}
    />
  );
}
