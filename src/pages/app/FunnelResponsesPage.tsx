import { useEffect, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { ArrowLeft, BarChart3, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuizzes } from "@/context/QuizzesContext";
import { fetchFunnelAnalytics, type FunnelAnalytics } from "@/lib/response-store";
import { usePageMeta } from "@/hooks/use-page-meta";
import { ROUTES } from "@/lib/routes";

export function FunnelResponsesPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const { getQuiz } = useQuizzes();
  const quiz = quizId ? getQuiz(quizId) : undefined;

  const [analytics, setAnalytics] = useState<FunnelAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  usePageMeta({
    title: quiz ? `Responses · ${quiz.title} | QuizFlow` : "Responses | QuizFlow",
    robots: "noindex, nofollow",
    canonical: undefined,
  });

  useEffect(() => {
    if (!quiz?.supabaseId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    void fetchFunnelAnalytics(quiz.supabaseId).then((data) => {
      if (!cancelled) {
        setAnalytics(data);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [quiz?.supabaseId]);

  if (!quiz) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center px-4">
        <p className="text-muted-foreground">Funnel not found.</p>
        <Button asChild variant="outline" className="mt-4 rounded-xl">
          <Link to={ROUTES.appFunnels}>Back to my funnels</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full py-8 sm:py-12 px-4 sm:px-0">
      <Link
        to={ROUTES.appFunnels}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        My funnels
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-2 text-violet-300/70 mb-2">
          <BarChart3 className="h-4 w-4" />
          <span className="text-xs uppercase tracking-wider">Responses</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">{quiz.title}</h1>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
          <span className="text-sm text-muted-foreground">Loading analytics…</span>
        </div>
      ) : analytics ? (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard label="Total views" value={analytics.totalViews} />
            <StatCard label="Total starts" value={analytics.totalStarts} />
            <StatCard label="Total completions" value={analytics.totalCompletions} />
            <StatCard label="Completion rate" value={`${analytics.completionRate}%`} />
          </div>

          <section>
            <h2 className="text-sm font-medium mb-3">Recent responses</h2>
            {analytics.responses.length === 0 ? (
              <Card className="glass border-hairline border-dashed">
                <CardContent className="py-12 text-center text-sm text-muted-foreground">
                  No completions yet. Share your public URL to collect responses.
                </CardContent>
              </Card>
            ) : (
              <div className="rounded-xl border border-hairline overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-hairline bg-surface-subtle/50 text-left">
                        <th className="px-4 py-3 font-medium text-muted-foreground">Completed</th>
                        <th className="px-4 py-3 font-medium text-muted-foreground">Session</th>
                        <th className="px-4 py-3 font-medium text-muted-foreground">Answers</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.responses.map((row) => (
                        <tr key={row.id} className="border-b border-hairline/60 last:border-0">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="block">{format(new Date(row.completed_at), "MMM d, yyyy HH:mm")}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(row.completed_at), { addSuffix: true })}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                            {row.session_id.slice(0, 8)}…
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {Object.keys(row.answers ?? {}).length} answers
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Could not load analytics.</p>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="glass border-hairline">
      <CardContent className="p-4 sm:p-5">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold tabular-nums mt-1">{value}</p>
      </CardContent>
    </Card>
  );
}
