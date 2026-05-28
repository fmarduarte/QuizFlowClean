import { formatDistanceToNow } from "date-fns";
import { Bookmark, Trash2 } from "lucide-react";
import { SectionHeading } from "@/components/app/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuizzes } from "@/context/QuizzesContext";
import { ROUTES } from "@/lib/routes";

export function SavedQuizzesSection() {
  const { quizzes, removeQuiz } = useQuizzes();

  return (
    <section id="saved" className="scroll-mt-24 pt-4 animate-fade-up">
      <SectionHeading
        title="Saved Quizzes"
        description="Your AI-generated quiz funnels — edit, duplicate, or publish to paid social."
      />

      {quizzes.length === 0 ? (
        <Card className="glass border-hairline border-dashed">
          <CardContent className="py-14 flex flex-col items-center text-center">
            <Bookmark className="h-11 w-11 text-muted-foreground mb-3" />
            <p className="font-medium">No saved quizzes yet</p>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
              Use the generator above to create your first funnel.
            </p>
            <a
              href={ROUTES.appSections.generator}
              className="mt-5 inline-flex items-center justify-center rounded-xl btn-shimmer text-white px-5 py-2.5 text-sm font-medium shadow-glow"
            >
              Go to generator
            </a>
          </CardContent>
        </Card>
      ) : (
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
                  {quiz.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{quiz.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-3">
                    {quiz.questions.length} questions · Saved{" "}
                    {formatDistanceToNow(new Date(quiz.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-xl text-muted-foreground hover:text-destructive flex-shrink-0"
                  onClick={() => removeQuiz(quiz.id)}
                  aria-label={`Delete ${quiz.title}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <ol className="mt-4 space-y-2">
                {quiz.questions.map((q, qi) => (
                  <li
                    key={q}
                    className="flex items-start gap-2 text-sm text-foreground/80 rounded-lg bg-surface-subtle/80 px-3 py-2"
                  >
                    <span className="text-violet-400 font-mono text-xs mt-0.5">{qi + 1}.</span>
                    {q}
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
