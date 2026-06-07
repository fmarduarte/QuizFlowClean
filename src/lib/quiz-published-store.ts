import { supabase } from "@/lib/supabase";
import { normalizeQuiz } from "@/lib/quiz-utils";
import type { Quiz } from "@/types/quiz";

const LOCAL_KEY = "quizflow_published";

function loadLocalMap(): Record<string, unknown> {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveLocalMap(map: Record<string, unknown>) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(map));
}

export function savePublishedQuizSnapshot(quiz: Quiz) {
  const map = loadLocalMap();
  map[quiz.id] = quiz;
  saveLocalMap(map);
}

export function getPublishedQuizSnapshot(quizId: string): Quiz | null {
  const map = loadLocalMap();
  return normalizeQuiz(map[quizId]);
}

export function removePublishedQuizSnapshot(quizId: string) {
  const map = loadLocalMap();
  delete map[quizId];
  saveLocalMap(map);
}

export async function publishQuizToServer(quiz: Quiz, userId: string): Promise<boolean> {
  savePublishedQuizSnapshot(quiz);

  const { error } = await supabase.from("published_quizzes").upsert(
    {
      quiz_id: quiz.id,
      user_id: userId,
      title: quiz.title,
      quiz_json: quiz,
      status: "published",
      published_at: quiz.publishedAt ?? new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "quiz_id" }
  );

  if (error) {
    console.warn("[quiz-published-store] Supabase publish failed:", error.message);
    return false;
  }

  return true;
}

export async function fetchPublishedQuiz(quizId: string): Promise<Quiz | null> {
  const { data, error } = await supabase
    .from("published_quizzes")
    .select("quiz_json, status")
    .eq("quiz_id", quizId)
    .eq("status", "published")
    .maybeSingle();

  if (!error && data?.quiz_json) {
    const quiz = normalizeQuiz(data.quiz_json);
    if (quiz) {
      savePublishedQuizSnapshot(quiz);
      return quiz;
    }
  }

  return getPublishedQuizSnapshot(quizId);
}

export async function syncPublishedQuizIfLive(quiz: Quiz, userId: string): Promise<void> {
  if (quiz.status !== "published" && quiz.published !== true) return;
  await publishQuizToServer(quiz, userId);
}
