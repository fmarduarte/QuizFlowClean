import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, Check, Copy, ExternalLink, List, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuizAnalyticsPanel } from "@/components/quiz/QuizAnalyticsPanel";
import { copyQuizLink, getPublicQuizUrl, shareQuizLink } from "@/lib/quiz-url";
import { fetchResponseCount, fetchResponsesForQuiz } from "@/lib/quiz-responses";
import { ROUTES } from "@/lib/routes";
import { PRODUCT_COPY } from "@/lib/product-copy";
import type { Quiz, QuizResponse } from "@/types/quiz";

interface QuizSharePanelProps {
  quiz: Quiz;
}

export function QuizSharePanel({ quiz }: QuizSharePanelProps) {
  const [copied, setCopied] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [responseCount, setResponseCount] = useState<number | null>(null);
  const [responses, setResponses] = useState<QuizResponse[]>([]);
  const publicUrl = getPublicQuizUrl(quiz.id);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchResponseCount(quiz.id), fetchResponsesForQuiz(quiz.id)]).then(
      ([count, data]) => {
        if (!cancelled) {
          setResponseCount(count);
          setResponses(data);
        }
      }
    );
    return () => {
      cancelled = true;
    };
  }, [quiz.id]);

  async function handleCopy() {
    const ok = await copyQuizLink(quiz.id);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleShare() {
    const result = await shareQuizLink(quiz.id, quiz.title);
    if (result === "shared") {
      setShareMessage("Shared successfully");
    } else if (result === "copied") {
      setShareMessage("Link copied to clipboard");
    } else {
      setShareMessage("Could not share — try copying the link");
    }
    setTimeout(() => setShareMessage(null), 2500);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-5 sm:p-6">
        <p className="text-sm font-semibold text-emerald-300">Quiz published</p>
        <p className="text-xs text-muted-foreground mt-1">
          Share your public link to start collecting responses and leads.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="public-quiz-url" className="text-xs font-medium text-muted-foreground">
          Public URL
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            id="public-quiz-url"
            readOnly
            value={publicUrl}
            className="rounded-xl border-hairline bg-surface-subtle/40 font-mono text-xs"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleCopy}
            className="rounded-xl border-hairline shrink-0"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy Link"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button asChild className="rounded-xl btn-shimmer text-white border-0 bg-accent-gradient shadow-glow flex-1">
          <a href={ROUTES.publicQuiz(quiz.id)} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
            Open Quiz
          </a>
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleShare}
          className="rounded-xl border-hairline flex-1"
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>

      {shareMessage && (
        <p className="text-xs text-muted-foreground" role="status">
          {shareMessage}
        </p>
      )}

      <div className="rounded-2xl border border-hairline bg-surface-subtle/30 p-4 sm:p-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground/60">
          {PRODUCT_COPY.quiz.workflow.collect}
        </p>
        <p className="text-2xl font-semibold tracking-tight mt-2 tabular-nums">
          {responseCount ?? "—"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {responseCount === 1 ? "response collected" : "responses collected"}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button asChild variant="outline" className="rounded-xl border-hairline flex-1">
            <Link to={ROUTES.quizResponses(quiz.id)}>
              <List className="h-4 w-4" />
              View Responses
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl border-hairline flex-1">
            <Link to={ROUTES.quizResponses(quiz.id)}>
              <BarChart3 className="h-4 w-4" />
              View Analytics
            </Link>
          </Button>
        </div>
      </div>

      {responses.length > 0 && <QuizAnalyticsPanel quiz={quiz} responses={responses} />}
    </div>
  );
}
