import type { Question } from "@/types/quiz";

export type PreviewStepResult = number | "complete";

export function getPreviewQuestion(
  questions: Question[],
  previewIndex: number
): Question | null {
  if (questions.length === 0) return null;
  const clamped = Math.min(Math.max(previewIndex, 0), questions.length - 1);
  return questions[clamped] ?? null;
}

export function canContinuePreview(
  question: Question | null,
  selectedOptionId: string | null
): boolean {
  if (!question) return false;
  if (question.options.length === 0) return true;
  return selectedOptionId !== null;
}

export function nextPreviewStep(
  currentIndex: number,
  totalQuestions: number
): PreviewStepResult {
  if (totalQuestions === 0) return 0;
  if (currentIndex >= totalQuestions - 1) return "complete";
  return currentIndex + 1;
}

export function previewProgressPercent(currentIndex: number, totalQuestions: number): number {
  if (totalQuestions <= 0) return 0;
  return ((currentIndex + 1) / totalQuestions) * 100;
}
