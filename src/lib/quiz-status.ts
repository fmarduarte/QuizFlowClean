import type { Quiz, QuizStatus } from "@/types/quiz";

export const QUIZ_STATUS_LABELS: Record<QuizStatus, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

export function resolveQuizStatus(quiz: Pick<Quiz, "status" | "published">): QuizStatus {
  if (quiz.status === "draft" || quiz.status === "published" || quiz.status === "archived") {
    return quiz.status;
  }
  return quiz.published === true ? "published" : "draft";
}

export function isQuizPublished(quiz: Pick<Quiz, "status" | "published">): boolean {
  return resolveQuizStatus(quiz) === "published";
}

export function isQuizShareable(quiz: Pick<Quiz, "status" | "published">): boolean {
  return resolveQuizStatus(quiz) === "published";
}

export function statusToPublishedFields(status: QuizStatus): Pick<Quiz, "status" | "published" | "publishedAt"> {
  if (status === "published") {
    return {
      status: "published",
      published: true,
      publishedAt: new Date().toISOString(),
    };
  }
  return {
    status,
    published: false,
    publishedAt: undefined,
  };
}
