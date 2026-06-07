import { ROUTES } from "@/lib/routes";

export function getPublicQuizPath(quizId: string): string {
  return ROUTES.publicQuiz(quizId);
}

export function getPublicQuizUrl(quizId: string, origin?: string): string {
  const base = origin ?? (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}${getPublicQuizPath(quizId)}`;
}

export async function copyQuizLink(quizId: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard) return false;
  try {
    await navigator.clipboard.writeText(getPublicQuizUrl(quizId));
    return true;
  } catch {
    return false;
  }
}

export async function shareQuizLink(quizId: string, title: string): Promise<"shared" | "copied" | "failed"> {
  const url = getPublicQuizUrl(quizId);
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ title, text: `Take my quiz: ${title}`, url });
      return "shared";
    } catch {
      // User cancelled or share failed — fall through to copy
    }
  }
  const copied = await copyQuizLink(quizId);
  return copied ? "copied" : "failed";
}
