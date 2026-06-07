import { supabase } from "@/lib/supabase";
import { createPublishedSnapshot } from "@/lib/quiz-publish";
import { normalizeResult } from "@/lib/quiz-publish";
import type { FunnelResultScreen, FunnelStatus, PublishedQuizSnapshot, Quiz, QuizInput } from "@/types/quiz";
import { DEFAULT_FUNNEL_RESULT } from "@/types/quiz";
import type { FunnelBrief } from "@/types/funnel-brief";

export interface FunnelDraftData {
  title: string;
  description?: string;
  questions: Quiz["questions"];
  brief?: FunnelBrief;
  result?: FunnelResultScreen;
}

export interface FunnelRow {
  id: string;
  user_id: string;
  client_quiz_id: string;
  public_slug: string;
  title: string;
  description: string | null;
  draft_data: FunnelDraftData;
  published_snapshot: PublishedQuizSnapshot | null;
  published_at: string | null;
  status: FunnelStatus;
  created_at: string;
  updated_at: string;
}

export interface PublishedFunnelPublic {
  id: string;
  title: string;
  description?: string;
  questions: Quiz["questions"];
  result: FunnelResultScreen;
  publishedAt?: string;
  publicSlug: string;
}

export class FunnelStoreError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FunnelStoreError";
  }
}

function quizToDraftData(
  quiz: Pick<Quiz, "title" | "description" | "questions" | "brief" | "result">
): FunnelDraftData {
  return {
    title: quiz.title,
    description: quiz.description,
    questions: quiz.questions,
    brief: quiz.brief,
    result: normalizeResult(quiz.result),
  };
}

export function funnelRowToQuiz(row: FunnelRow): Quiz {
  const draft = row.draft_data ?? ({} as FunnelDraftData);
  const status = row.status ?? "draft";

  return {
    id: row.client_quiz_id,
    supabaseId: row.id,
    title: draft.title ?? row.title,
    description: draft.description ?? row.description ?? undefined,
    questions: draft.questions ?? [],
    brief: draft.brief,
    status,
    published: status === "published",
    publishedAt: row.published_at ?? undefined,
    publicSlug: row.public_slug,
    publishedSnapshot: row.published_snapshot ?? undefined,
    result: normalizeResult(draft.result),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function fetchFunnelsForUser(userId: string): Promise<Quiz[]> {
  const { data, error } = await supabase
    .from("funnels")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    console.warn("[funnel-store] fetch failed:", error.message);
    throw new FunnelStoreError("Could not load your funnels. Please try again.");
  }

  return (data as FunnelRow[]).map(funnelRowToQuiz);
}

export async function insertFunnel(userId: string, quiz: Quiz): Promise<Quiz> {
  const now = new Date().toISOString();
  const row = {
    user_id: userId,
    client_quiz_id: quiz.id,
    public_slug: quiz.publicSlug ?? quiz.id,
    title: quiz.title,
    description: quiz.description ?? null,
    draft_data: quizToDraftData(quiz),
    status: quiz.status ?? "draft",
    published_snapshot: quiz.publishedSnapshot ?? null,
    published_at: quiz.publishedAt ?? null,
    created_at: quiz.createdAt ?? now,
    updated_at: quiz.updatedAt ?? now,
  };

  const { data, error } = await supabase.from("funnels").insert(row).select("*").single();

  if (error) {
    console.warn("[funnel-store] insert failed:", error.message);
    throw new FunnelStoreError("Could not save your funnel. Please try again.");
  }

  return funnelRowToQuiz(data as FunnelRow);
}

export async function saveFunnelDraft(userId: string, quiz: Quiz): Promise<void> {
  const payload = {
    title: quiz.title,
    description: quiz.description ?? null,
    draft_data: quizToDraftData(quiz),
    updated_at: new Date().toISOString(),
  };

  const { data: existing, error: fetchError } = await supabase
    .from("funnels")
    .select("id")
    .eq("user_id", userId)
    .eq("client_quiz_id", quiz.id)
    .maybeSingle();

  if (fetchError) {
    console.warn("[funnel-store] draft lookup failed:", fetchError.message);
    throw new FunnelStoreError("Could not save your funnel. Please try again.");
  }

  if (existing) {
    const { error } = await supabase.from("funnels").update(payload).eq("id", existing.id);
    if (error) {
      console.warn("[funnel-store] draft update failed:", error.message);
      throw new FunnelStoreError("Could not save your funnel. Please try again.");
    }
    return;
  }

  const { error } = await supabase.from("funnels").insert({
    user_id: userId,
    client_quiz_id: quiz.id,
    public_slug: quiz.publicSlug ?? quiz.id,
    ...payload,
    status: "draft",
  });

  if (error) {
    console.warn("[funnel-store] draft insert failed:", error.message);
    throw new FunnelStoreError("Could not save your funnel. Please try again.");
  }
}

export async function publishFunnelToSupabase(userId: string, quiz: Quiz): Promise<Quiz> {
  const publishedAt = new Date().toISOString();
  const publicSlug = quiz.publicSlug ?? quiz.id;
  const publishedSnapshot = createPublishedSnapshot(quiz);

  const payload = {
    user_id: userId,
    client_quiz_id: quiz.id,
    public_slug: publicSlug,
    title: quiz.title,
    description: quiz.description ?? null,
    draft_data: quizToDraftData(quiz),
    published_snapshot: publishedSnapshot,
    published_at: publishedAt,
    status: "published" as const,
    updated_at: publishedAt,
  };

  const { data: existing } = await supabase
    .from("funnels")
    .select("id")
    .eq("user_id", userId)
    .eq("client_quiz_id", quiz.id)
    .maybeSingle();

  let row: FunnelRow | null = null;

  if (existing?.id) {
    const { data, error } = await supabase
      .from("funnels")
      .update(payload)
      .eq("id", existing.id)
      .select("*")
      .single();

    if (error) {
      console.warn("[funnel-store] publish update failed:", error.message);
      throw new FunnelStoreError("Could not publish your funnel. Please try again.");
    }
    row = data as FunnelRow;
  } else {
    const { data, error } = await supabase.from("funnels").insert(payload).select("*").single();

    if (error) {
      console.warn("[funnel-store] publish insert failed:", error.message);
      throw new FunnelStoreError("Could not publish your funnel. Please try again.");
    }
    row = data as FunnelRow;
  }

  return funnelRowToQuiz(row!);
}

export async function archiveFunnelInSupabase(userId: string, clientQuizId: string): Promise<Quiz> {
  const { data, error } = await supabase
    .from("funnels")
    .update({ status: "archived", updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("client_quiz_id", clientQuizId)
    .select("*")
    .single();

  if (error) {
    console.warn("[funnel-store] archive failed:", error.message);
    throw new FunnelStoreError("Could not archive your funnel. Please try again.");
  }

  return funnelRowToQuiz(data as FunnelRow);
}

export async function deleteFunnelFromSupabase(userId: string, clientQuizId: string): Promise<void> {
  const { error } = await supabase
    .from("funnels")
    .delete()
    .eq("user_id", userId)
    .eq("client_quiz_id", clientQuizId);

  if (error) {
    console.warn("[funnel-store] delete failed:", error.message);
    throw new FunnelStoreError("Could not delete your funnel. Please try again.");
  }
}

export async function fetchPublishedFunnelBySlug(slug: string): Promise<PublishedFunnelPublic | null> {
  const { data, error } = await supabase
    .from("funnels")
    .select("id, public_slug, published_snapshot, published_at, title")
    .eq("public_slug", slug)
    .eq("status", "published")
    .not("published_snapshot", "is", null)
    .maybeSingle();

  if (error) {
    console.warn("[funnel-store] public fetch failed:", error.message);
    return null;
  }

  if (!data?.published_snapshot) return null;

  const snapshot = data.published_snapshot as PublishedQuizSnapshot;

  return {
    id: data.id as string,
    publicSlug: data.public_slug as string,
    title: snapshot.title ?? (data.title as string),
    description: snapshot.description,
    questions: snapshot.questions,
    result: normalizeResult(snapshot.result),
    publishedAt: (data.published_at as string | null) ?? undefined,
  };
}

export function mergeQuizInput(quiz: Quiz, updates: Partial<QuizInput>): Quiz {
  return {
    ...quiz,
    ...updates,
    result: updates.result ? normalizeResult({ ...quiz.result, ...updates.result }) : quiz.result,
    updatedAt: new Date().toISOString(),
  };
}

export { DEFAULT_FUNNEL_RESULT };
