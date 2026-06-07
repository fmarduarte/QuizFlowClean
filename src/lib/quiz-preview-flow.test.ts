import { describe, expect, it } from "vitest";
import { createQuestion } from "@/lib/quiz-utils";
import {
  canContinuePreview,
  getContinueButtonLabel,
  getPreviewQuestion,
  isLastPreviewQuestion,
  nextPreviewStep,
  previewProgressPercent,
} from "@/lib/quiz-preview-flow";

describe("quiz preview flow", () => {
  const questions = [
    createQuestion("Question one"),
    createQuestion("Question two"),
  ];

  it("returns no selection highlight by default", () => {
    const question = getPreviewQuestion(questions, 0);
    expect(canContinuePreview(question, null)).toBe(false);
  });

  it("allows continue after explicit answer selection", () => {
    const question = getPreviewQuestion(questions, 0);
    const optionId = question?.options[0]?.id ?? "";
    expect(canContinuePreview(question, optionId)).toBe(true);
  });

  it("advances preview steps until complete", () => {
    expect(nextPreviewStep(0, 2)).toBe(1);
    expect(nextPreviewStep(1, 2)).toBe("complete");
  });

  it("tracks progress across questions", () => {
    expect(previewProgressPercent(0, 2)).toBe(50);
    expect(previewProgressPercent(1, 2)).toBe(100);
  });

  it("labels the final continue action as Review Quiz", () => {
    expect(isLastPreviewQuestion(1, 2)).toBe(true);
    expect(getContinueButtonLabel(1, 2)).toBe("Review Quiz");
    expect(getContinueButtonLabel(0, 2)).toBe("Continue →");
  });
});
