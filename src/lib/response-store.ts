import { supabase } from "@/lib/supabase";
import type { QuizPlayerAnswers } from "@/components/quiz/QuizPlayer";

export interface FunnelResponseRow {
  id: string;
  funnel_id: string;
  session_id: string;
  answers: QuizPlayerAnswers;
  completed_at: string;
  created_at: string;
}

export interface FunnelAnalytics {
  totalViews: number;
  totalStarts: number;
  totalCompletions: number;
  completionRate: number;
  responses: FunnelResponseRow[];
}

export async function recordFunnelEvent(
  funnelId: string,
  sessionId: string,
  eventType: "view" | "start"
): Promise<void> {
  const { error } = await supabase.from("funnel_events").insert({
    funnel_id: funnelId,
    session_id: sessionId,
    event_type: eventType,
  });

  if (error) {
    console.warn("[response-store] event insert failed:", error.message);
  }
}

export async function saveFunnelResponse(params: {
  funnelId: string;
  sessionId: string;
  answers: QuizPlayerAnswers;
  completedAt: string;
}): Promise<void> {
  const { error } = await supabase.from("funnel_responses").insert({
    funnel_id: params.funnelId,
    session_id: params.sessionId,
    answers: params.answers,
    completed_at: params.completedAt,
  });

  if (error) {
    console.warn("[response-store] response insert failed:", error.message);
  }
}

export async function fetchFunnelAnalytics(funnelDbId: string): Promise<FunnelAnalytics> {
  const [eventsResult, responsesResult] = await Promise.all([
    supabase.from("funnel_events").select("event_type").eq("funnel_id", funnelDbId),
    supabase
      .from("funnel_responses")
      .select("*")
      .eq("funnel_id", funnelDbId)
      .order("completed_at", { ascending: false }),
  ]);

  const events = eventsResult.data ?? [];
  const responses = (responsesResult.data ?? []) as FunnelResponseRow[];

  const totalViews = events.filter((e) => e.event_type === "view").length;
  const totalStarts = events.filter((e) => e.event_type === "start").length;
  const totalCompletions = responses.length;
  const completionRate =
    totalStarts > 0 ? Math.round((totalCompletions / totalStarts) * 100) : 0;

  return {
    totalViews,
    totalStarts,
    totalCompletions,
    completionRate,
    responses,
  };
}
