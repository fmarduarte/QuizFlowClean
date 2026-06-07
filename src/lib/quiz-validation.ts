import type { Quiz } from "@/types/quiz";

export interface QuizValidationIssue {
  id: string;
  message: string;
  severity: "error" | "warning";
}

export interface QuizValidationResult {
  valid: boolean;
  issues: QuizValidationIssue[];
  errorCount: number;
  warningCount: number;
}

export function validateQuizForPublish(quiz: Quiz): QuizValidationResult {
  const issues: QuizValidationIssue[] = [];

  if (!quiz.title.trim()) {
    issues.push({
      id: "title-missing",
      message: "Add a quiz title before publishing.",
      severity: "error",
    });
  }

  if (quiz.questions.length === 0) {
    issues.push({
      id: "questions-empty",
      message: "Add at least one question before publishing.",
      severity: "error",
    });
  }

  quiz.questions.forEach((question, index) => {
    if (!question.title.trim()) {
      issues.push({
        id: `question-${question.id}-title`,
        message: `Question ${index + 1} needs a title.`,
        severity: "error",
      });
    }

    if (question.options.length === 0) {
      issues.push({
        id: `question-${question.id}-options`,
        message: `Question ${index + 1} needs at least one answer option.`,
        severity: "error",
      });
    }

    const emptyOptions = question.options.filter((opt) => !opt.label.trim());
    if (emptyOptions.length > 0) {
      issues.push({
        id: `question-${question.id}-empty-labels`,
        message: `Question ${index + 1} has ${emptyOptions.length} empty answer label${emptyOptions.length === 1 ? "" : "s"}.`,
        severity: "warning",
      });
    }
  });

  const errorCount = issues.filter((i) => i.severity === "error").length;
  const warningCount = issues.filter((i) => i.severity === "warning").length;

  return {
    valid: errorCount === 0,
    issues,
    errorCount,
    warningCount,
  };
}
