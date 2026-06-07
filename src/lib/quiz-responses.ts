import { supabase } from "@/lib/supabase";
import type { QuizLeadInfo, QuizResponse, QuizSubmission } from "@/types/quiz";

const LOCAL_KEY = "quizflow_responses";

interface ResponseRow {
  id: string;
  quiz_id: string;
  answers: Record<string, string>;
  lead_email: string | null;
  lead_name: string | null;
  completed_at: string;
}

function rowToResponse(row: ResponseRow): QuizResponse {
  return {
    id: row.id,
    quizId: row.quiz_id,
    answers: row.answers ?? {},
    leadEmail: row.lead_email ?? undefined,
    leadName: row.lead_name ?? undefined,
    completedAt: row.completed_at,
  };
}

function loadLocal(): QuizResponse[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown[];
    return parsed.filter(
      (item): item is QuizResponse =>
        !!item &&
        typeof item === "object" &&
        typeof (item as QuizResponse).id === "string" &&
        typeof (item as QuizResponse).quizId === "string"
    );
  } catch {
    return [];
  }
}

function saveLocal(responses: QuizResponse[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(responses));
}

function saveLocalResponse(entry: QuizResponse) {
  const all = loadLocal();
  all.unshift(entry);
  saveLocal(all);
}

export async function submitQuizResponse(
  quizId: string,
  submission: QuizSubmission
): Promise<QuizResponse> {
  const localEntry: QuizResponse = {
    id: crypto.randomUUID(),
    quizId,
    answers: submission.answers,
    leadEmail: submission.lead.email,
    leadName: submission.lead.name,
    completedAt: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("quiz_responses")
    .insert({
      quiz_id: quizId,
      answers: submission.answers,
      lead_email: submission.lead.email,
      lead_name: submission.lead.name ?? null,
    })
    .select("id, quiz_id, answers, lead_email, lead_name, completed_at")
    .single();

  if (!error && data) {
    const entry = rowToResponse(data as ResponseRow);
    saveLocalResponse(entry);
    return entry;
  }

  console.warn("[quiz-responses] Supabase insert failed:", error?.message);
  saveLocalResponse(localEntry);
  return localEntry;
}

/** @deprecated Use submitQuizResponse */
export function addQuizResponse(
  quizId: string,
  answers: Record<string, string>
): QuizResponse {
  const entry: QuizResponse = {
    id: crypto.randomUUID(),
    quizId,
    answers,
    completedAt: new Date().toISOString(),
  };
  saveLocalResponse(entry);
  return entry;
}

export async function fetchResponsesForQuiz(quizId: string): Promise<QuizResponse[]> {
  const { data, error } = await supabase
    .from("quiz_responses")
    .select("id, quiz_id, answers, lead_email, lead_name, completed_at")
    .eq("quiz_id", quizId)
    .order("completed_at", { ascending: false });

  if (!error && data?.length) {
    return (data as ResponseRow[]).map(rowToResponse);
  }

  if (error) {
    console.warn("[quiz-responses] Supabase fetch failed:", error.message);
  }

  return loadLocal().filter((r) => r.quizId === quizId);
}

export async function fetchResponseCount(quizId: string): Promise<number> {
  const { count, error } = await supabase
    .from("quiz_responses")
    .select("id", { count: "exact", head: true })
    .eq("quiz_id", quizId);

  if (!error && typeof count === "number") {
    return count;
  }

  return loadLocal().filter((r) => r.quizId === quizId).length;
}

/** @deprecated Use fetchResponsesForQuiz */
export function getResponsesForQuiz(quizId: string): QuizResponse[] {
  return loadLocal().filter((r) => r.quizId === quizId);
}

/** @deprecated Use fetchResponseCount */
export function getResponseCount(quizId: string): number {
  return getResponsesForQuiz(quizId).length;
}

export function removeResponsesForQuiz(quizId: string) {
  saveLocal(loadLocal().filter((r) => r.quizId !== quizId));
}
