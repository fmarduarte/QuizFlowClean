import { supabase } from "@/lib/supabase";
import type { QuizPlayerAnswers } from "@/components/quiz/QuizPlayer";
import type { QuizLeadInfo } from "@/types/quiz";

export interface FunnelResponseRow {
  id: string;
  funnel_id: string;
  session_id: string;
  answers: QuizPlayerAnswers;
  lead_email: string | null;
  lead_name: string | null;
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

interface PendingResponse {
  funnelId: string;
  sessionId: string;
  answers: QuizPlayerAnswers;
  lead?: QuizLeadInfo;
  completedAt: string;
}

const PENDING_RESPONSES_KEY = "qf_pending_responses";

function readPendingQueue(): PendingResponse[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(PENDING_RESPONSES_KEY);
    return raw ? (JSON.parse(raw) as PendingResponse[]) : [];
  } catch {
    return [];
  }
}

function writePendingQueue(queue: PendingResponse[]): void {
  if (typeof localStorage === "undefined") return;
  try {
    if (queue.length === 0) localStorage.removeItem(PENDING_RESPONSES_KEY);
    else localStorage.setItem(PENDING_RESPONSES_KEY, JSON.stringify(queue));
  } catch {
    // Storage unavailable (private mode / quota) — best effort only.
  }
}

function enqueuePendingResponse(payload: PendingResponse): void {
  const queue = readPendingQueue();
  // Cap the queue so a persistent failure can't grow storage unbounded.
  writePendingQueue([...queue, payload].slice(-25));
}

async function insertResponse(payload: PendingResponse): Promise<boolean> {
  const { error } = await supabase.from("funnel_responses").insert({
    funnel_id: payload.funnelId,
    session_id: payload.sessionId,
    answers: payload.answers,
    lead_email: payload.lead?.email ?? null,
    lead_name: payload.lead?.name ?? null,
    completed_at: payload.completedAt,
  });
  if (error) {
    console.warn("[response-store] response insert failed:", error.message);
    return false;
  }
  return true;
}

/**
 * Persists a completed response. On failure (network blip / transient RLS),
 * the payload is queued in localStorage and retried via flushPendingResponses()
 * on the next public-page load, so a captured lead is never silently lost.
 * Returns true if the response reached Supabase on this attempt.
 */
export async function saveFunnelResponse(params: PendingResponse): Promise<boolean> {
  const ok = await insertResponse(params);
  if (!ok) enqueuePendingResponse(params);
  return ok;
}

/** Retries any responses that previously failed to persist. Safe to call on load. */
export async function flushPendingResponses(): Promise<void> {
  const queue = readPendingQueue();
  if (queue.length === 0) return;

  const stillPending: PendingResponse[] = [];
  for (const payload of queue) {
    const ok = await insertResponse(payload);
    if (!ok) stillPending.push(payload);
  }
  writePendingQueue(stillPending);
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

  if (eventsResult.error || responsesResult.error) {
    const message = eventsResult.error?.message ?? responsesResult.error?.message ?? "unknown";
    console.warn("[response-store] analytics fetch failed:", message);
    throw new Error("Could not load analytics. Please try again.");
  }

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
