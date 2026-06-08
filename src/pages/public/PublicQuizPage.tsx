import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FileQuestion, Loader2 } from "lucide-react";
import { QuizPlayer } from "@/components/quiz/QuizPlayer";
import { Button } from "@/components/ui/button";
import { fetchPublishedFunnelBySlug, type PublishedFunnelPublic } from "@/lib/funnel-store";
import { flushPendingResponses, recordFunnelEvent, saveFunnelResponse } from "@/lib/response-store";
import type { QuizPlayerCompletePayload } from "@/components/quiz/QuizPlayer";
import {
  getRespondentSessionId,
  hasRecordedEvent,
  markEventRecorded,
} from "@/lib/session-id";
import { ROUTES } from "@/lib/routes";
import { usePageMeta } from "@/hooks/use-page-meta";

export function PublicQuizPage() {
  const { slug } = useParams<{ slug: string }>();
  const [published, setPublished] = useState<PublishedFunnelPublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const sessionId = useMemo(() => getRespondentSessionId(), []);

  // Retry any response that failed to persist on a previous visit.
  useEffect(() => {
    void flushPendingResponses();
  }, []);

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    void fetchPublishedFunnelBySlug(slug).then((result) => {
      if (cancelled) return;
      if (!result) {
        setNotFound(true);
        setPublished(null);
      } else {
        setPublished(result);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!published?.id || hasRecordedEvent(published.id, "view")) return;

    void recordFunnelEvent(published.id, sessionId, "view").then(() => {
      markEventRecorded(published.id, "view");
    });
  }, [published?.id, sessionId]);

  usePageMeta({
    title: published ? `${published.title} | QuizFlow` : "Funnel not found | QuizFlow",
    description: published?.description ?? "Take this interactive funnel.",
    robots: "index, follow",
    canonical: undefined,
  });

  function handleStart() {
    if (!published?.id || hasRecordedEvent(published.id, "start")) return;
    void recordFunnelEvent(published.id, sessionId, "start").then(() => {
      markEventRecorded(published.id, "start");
    });
  }

  function handleComplete(payload: QuizPlayerCompletePayload) {
    if (!published?.id) return;
    void saveFunnelResponse({
      funnelId: published.id,
      sessionId,
      answers: payload.answers,
      lead: payload.lead,
      completedAt: payload.completedAt,
    });
  }

  if (loading) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-3 bg-background px-4">
        <Loader2 className="h-8 w-8 text-violet-400 animate-spin" />
        <p className="text-sm text-muted-foreground">Loading funnel…</p>
      </div>
    );
  }

  if (notFound || !published) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-4 text-center bg-background">
        <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-xl font-semibold tracking-tight">Funnel not found</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm">
          This link may be invalid or the funnel is no longer published.
        </p>
        <Button asChild variant="outline" className="mt-6 rounded-xl">
          <Link to={ROUTES.landing}>Go to QuizFlow</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <header className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-hairline">
        <div className="max-w-xl lg:max-w-2xl mx-auto w-full">
          <p className="text-xs uppercase tracking-wider text-muted-foreground/50 mb-1">QuizFlow</p>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold tracking-tight">
            {published.title}
          </h1>
          {published.description && (
            <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
              {published.description}
            </p>
          )}
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
        <div className="max-w-xl lg:max-w-2xl mx-auto w-full min-h-[min(560px,70dvh)] flex flex-col">
          <QuizPlayer
            quiz={{ title: published.title, questions: published.questions }}
            result={published.result}
            funnelId={published.id}
            sessionId={sessionId}
            collectLead
            onStart={handleStart}
            onComplete={handleComplete}
            showRestart={false}
          />
        </div>
      </main>
    </div>
  );
}
