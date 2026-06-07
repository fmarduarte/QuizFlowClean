import type { FunnelResultScreen, Quiz } from "@/types/quiz";
import { DEFAULT_FUNNEL_RESULT } from "@/types/quiz";
import { ROUTES } from "@/lib/routes";

export interface PublishValidationResult {
  valid: boolean;
  errors: string[];
}

export function normalizeResult(result: Partial<FunnelResultScreen> | undefined): FunnelResultScreen {
  return {
    thankYouTitle: result?.thankYouTitle?.trim() || DEFAULT_FUNNEL_RESULT.thankYouTitle,
    thankYouMessage: result?.thankYouMessage?.trim() || DEFAULT_FUNNEL_RESULT.thankYouMessage,
    ctaLabel: result?.ctaLabel?.trim() || DEFAULT_FUNNEL_RESULT.ctaLabel,
    ctaUrl: result?.ctaUrl?.trim() || "",
  };
}

export function validateQuizForPublish(quiz: Pick<Quiz, "title" | "questions">): PublishValidationResult {
  const errors: string[] = [];

  if (!quiz.title.trim()) {
    errors.push("Add a funnel title before publishing.");
  }

  if (quiz.questions.length === 0) {
    errors.push("Add at least one question before publishing.");
  }

  quiz.questions.forEach((question, index) => {
    const label = `Question ${index + 1}`;
    if (!question.title.trim()) {
      errors.push(`${label} needs a title.`);
    }
    if (question.options.length === 0) {
      errors.push(`${label} needs at least one answer option.`);
    }
    question.options.forEach((option, optionIndex) => {
      if (!option.label.trim()) {
        errors.push(`${label}, option ${optionIndex + 1} needs a label.`);
      }
    });
  });

  return { valid: errors.length === 0, errors };
}

export function createPublishedSnapshot(
  quiz: Pick<Quiz, "title" | "description" | "questions" | "result">
): Quiz["publishedSnapshot"] {
  return {
    title: quiz.title.trim(),
    description: quiz.description?.trim() || undefined,
    questions: structuredClone(quiz.questions),
    result: normalizeResult(quiz.result),
  };
}

export function createPublishedUpdates(
  quiz: Quiz,
  publishedAt: string = new Date().toISOString()
): Pick<Quiz, "status" | "published" | "publishedAt" | "publicSlug" | "publishedSnapshot"> {
  return {
    status: "published",
    published: true,
    publishedAt,
    publicSlug: quiz.publicSlug ?? quiz.id,
    publishedSnapshot: createPublishedSnapshot(quiz),
  };
}

export function buildPublicQuizPath(quiz: Pick<Quiz, "id" | "publicSlug">): string {
  const slug = quiz.publicSlug ?? quiz.id;
  return ROUTES.quizPublic(slug);
}

export function buildPublicQuizUrl(quiz: Pick<Quiz, "id" | "publicSlug">): string {
  if (typeof window === "undefined") {
    return buildPublicQuizPath(quiz);
  }
  return `${window.location.origin}${buildPublicQuizPath(quiz)}`;
}
