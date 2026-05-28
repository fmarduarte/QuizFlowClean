import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { QuizResultCard } from "@/components/app/QuizResultCard";
import { useQuizzes } from "@/context/QuizzesContext";
import { DEMO_QUIZ } from "@/types/quiz";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

interface QuizGeneratePanelProps {
  variant?: "hero" | "page";
}

export function QuizGeneratePanel({ variant = "page" }: QuizGeneratePanelProps) {
  const { addQuiz } = useQuizzes();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<typeof DEMO_QUIZ | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setResult(null);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const generated = {
      title: title.trim() || DEMO_QUIZ.title,
      questions: DEMO_QUIZ.questions,
      description: description.trim() || undefined,
    };

    addQuiz(generated);
    setResult(generated);
    setLoading(false);
  }

  const isHero = variant === "hero";

  return (
    <div className={cn("w-full", isHero ? "max-w-xl mx-auto" : "max-w-2xl")}>
      {!isHero && (
        <div className="glass rounded-2xl p-6 sm:p-8 mb-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="quiz-title">Quiz title</Label>
            <Input
              id="quiz-title"
              placeholder="e.g. Fitness Motivation Quiz"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-background/80 border-hairline h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quiz-desc">Describe your quiz</Label>
            <Textarea
              id="quiz-desc"
              placeholder="Audience, product, and goal for paid social…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-background/80 border-hairline min-h-[120px] resize-none"
            />
          </div>
        </div>
      )}

      <div
        className={cn(
          "flex gap-3",
          isHero ? "flex-col sm:flex-row items-stretch sm:items-center justify-center" : "flex-col sm:flex-row"
        )}
      >
        <Button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          aria-busy={loading}
          className={cn(
            "btn-glow h-12 px-6 rounded-xl font-medium text-white border-0 shadow-glow transition-all duration-300",
            loading ? "opacity-80 btn-shimmer" : "btn-shimmer hover:-translate-y-0.5 hover:shadow-elevated",
            isHero && "min-w-[220px]"
          )}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate AI Quiz
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
        {isHero ? (
          <Button variant="outline" asChild className="h-12 rounded-xl border-hairline glass">
            <a href={`${ROUTES.app}${ROUTES.appSections.generator}`}>Open full builder</a>
          </Button>
        ) : null}
      </div>

      <div className={cn("min-h-[120px]", isHero ? "mt-8" : "mt-10")}>
        {loading && (
          <div
            className="glass rounded-2xl p-8 flex flex-col items-center justify-center gap-4 animate-fade-in"
            role="status"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-accent-gradient opacity-30 blur-xl animate-pulse-glow" />
              <Loader2 className="relative h-10 w-10 text-violet-400 animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">AI is building your quiz funnel…</p>
              <p className="text-xs text-muted-foreground mt-1">Writing questions & branching logic</p>
            </div>
            <div className="w-full max-w-xs h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full w-full bg-accent-gradient rounded-full origin-left quiz-progress-fill" />
            </div>
          </div>
        )}

        {result && !loading && (
          <QuizResultCard
            title={result.title}
            questions={result.questions}
            footer={
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" asChild className="flex-1 rounded-xl border-hairline">
                  <a href={`${ROUTES.app}${ROUTES.appSections.saved}`}>View saved quizzes</a>
                </Button>
                <Button
                  asChild
                  className="flex-1 rounded-xl btn-shimmer text-white border-0 bg-accent-gradient shadow-glow"
                >
                  <a href={`${ROUTES.app}${ROUTES.appSections.generator}`}>Generate another</a>
                </Button>
              </div>
            }
          />
        )}
      </div>
    </div>
  );
}
