import { describe, expect, it } from "vitest";
import { createQuestion, createSeedQuiz } from "@/lib/quiz-utils";
import {
  getContinueButtonLabel,
  isLastPreviewQuestion,
  nextPreviewStep,
} from "@/lib/quiz-preview-flow";
import { getPublicQuizPath } from "@/lib/quiz-url";
import { validateQuizForPublish } from "@/lib/quiz-validation";
import { isQuizPublished, statusToPublishedFields } from "@/lib/quiz-status";

describe("quiz publication flow", () => {
  const quiz = createSeedQuiz("Sales Quiz", "Qualify leads", [], "flow-1");
  quiz.questions = [createQuestion("Question one"), createQuestion("Question two")];

  it("walks from question 1 through review on the last step", () => {
    expect(getContinueButtonLabel(0, 2)).toBe("Continue →");
    expect(isLastPreviewQuestion(0, 2)).toBe(false);
    expect(nextPreviewStep(0, 2)).toBe(1);

    expect(getContinueButtonLabel(1, 2)).toBe("Review Quiz");
    expect(isLastPreviewQuestion(1, 2)).toBe(true);
    expect(nextPreviewStep(1, 2)).toBe("complete");
  });

  it("validates before publish and exposes a public path", () => {
    expect(validateQuizForPublish(quiz).valid).toBe(true);
    expect(getPublicQuizPath(quiz.id)).toBe(`/q/${quiz.id}`);
  });

  it("transitions from draft to published with explicit status", () => {
    const draft = { status: "draft" as const, published: false };
    expect(isQuizPublished(draft)).toBe(false);

    const published = statusToPublishedFields("published");
    expect(isQuizPublished(published)).toBe(true);
  });
});
