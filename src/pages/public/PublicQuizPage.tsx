import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FileQuestion, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuizLivePreview } from "@/components/builder/QuizLivePreview";
import { usePageMeta } from "@/hooks/use-page-meta";
import { fetchPublishedQuiz } from "@/lib/quiz-published-store";
import { submitQuizResponse } from "@/lib/quiz-responses";
import { ROUTES } from "@/lib/routes";
import { isQuizPublished } from "@/lib/quiz-status";
import type { Quiz, QuizSubmission } from "@/types/quiz";

export function PublicQuizPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const [quiz, setQuiz] = useState<Quiz | null | undefined>(undefined);

  useEffect(() => {
    if (!quizId) {
      setQuiz(null);
      return;
    }
    let cancelled = false;
    setQuiz(undefined);
    fetchPublishedQuiz(quizId).then((result) => {
      if (!cancelled) setQuiz(result);
    });
    return () => {
      cancelled = true;
    };
  }, [quizId]);

  const published = quiz ? isQuizPublished(quiz) : false;

  usePageMeta({
    title: quiz?.title ?? "Quiz",
    description: quiz?.description ?? "Take this quiz",
    robots: "noindex, nofollow",
    canonical: undefined,
  });

  async function handleComplete(submission: QuizSubmission) {
    if (!quizId) return;
    await submitQuizResponse(quizId, submission);
  }

  if (quiz === undefined) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground mt-3">Loading quiz…</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-background">
        <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-xl font-semibold tracking-tight">Quiz not found</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm">
          This quiz may have been removed or the link is incorrect.
        </p>
        <Button asChild className="mt-6 rounded-xl">
          <Link to={ROUTES.landing}>Go to QuizFlow AI</Link>
        </Button>
      </div>
    );
  }

  if (!published) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-background">
        <h1 className="text-xl font-semibold tracking-tight">This quiz is not available</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm">
          The quiz owner has not published this quiz yet. Check back later.
        </p>
        <Button asChild className="mt-6 rounded-xl">
          <Link to={ROUTES.landing}>Go to QuizFlow AI</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-hairline px-4 py-3 text-center">
        <p className="text-xs text-muted-foreground">Powered by QuizFlow AI</p>
      </header>
      <main className="flex-1 min-h-0">
        <QuizLivePreview
          quiz={quiz}
          mode="public"
          frame="desktop"
          onComplete={handleComplete}
        />
      </main>
    </div>
  );
}
