import { useMemo } from "react";
import { Clock, Layers, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuizzes } from "@/context/QuizzesContext";

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const diffMs = date.getTime() - Date.now();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (Math.abs(diffDays) >= 1) return rtf.format(diffDays, "day");
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  if (Math.abs(diffHours) >= 1) return rtf.format(diffHours, "hour");
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  return rtf.format(diffMinutes, "minute");
}

export function DashboardStats() {
  const { quizzes } = useQuizzes();

  const stats = useMemo(() => {
    const funnelCount = quizzes.length;
    const totalSteps = quizzes.reduce((sum, q) => sum + q.questions.length, 0);
    const latest = quizzes.reduce<string | null>((acc, q) => {
      if (!acc) return q.updatedAt;
      return q.updatedAt > acc ? q.updatedAt : acc;
    }, null);

    return [
      {
        label: "Saved funnels",
        value: String(funnelCount),
        icon: Zap,
        detail: funnelCount === 1 ? "In your workspace" : "In your workspace",
      },
      {
        label: "Funnel steps",
        value: String(totalSteps),
        icon: Layers,
        detail: totalSteps === 0 ? "Add your first funnel" : "Questions across all funnels",
      },
      {
        label: "Last activity",
        value: latest ? formatRelativeTime(latest) : "—",
        icon: Clock,
        detail: latest ? "Most recent funnel update" : "No funnels yet",
      },
    ];
  }, [quizzes]);

  return (
    <div className="grid sm:grid-cols-3 gap-4">
      {stats.map((s) => (
        <Card
          key={s.label}
          className="glass border-hairline bg-card/40 hover-lift transition-all duration-300"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
            <s.icon className="h-4 w-4 text-violet-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tracking-tight">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.detail}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
