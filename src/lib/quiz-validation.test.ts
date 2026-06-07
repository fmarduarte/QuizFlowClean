import { describe, expect, it } from "vitest";
import { createQuestion, createSeedQuiz } from "@/lib/quiz-utils";
import { validateQuizForPublish } from "@/lib/quiz-validation";

describe("validateQuizForPublish", () => {
  it("flags empty quizzes as invalid", () => {
    const quiz = createSeedQuiz("", "", [], "q1");
    const result = validateQuizForPublish(quiz);
    expect(result.valid).toBe(false);
    expect(result.errorCount).toBeGreaterThan(0);
  });

  it("passes a complete quiz", () => {
    const quiz = createSeedQuiz("Lead Quiz", "Desc", [], "q2");
    quiz.questions = [createQuestion("What is your goal?")];
    const result = validateQuizForPublish(quiz);
    expect(result.valid).toBe(true);
    expect(result.issues).toHaveLength(0);
  });
});
