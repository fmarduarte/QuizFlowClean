import { describe, expect, it } from "vitest";
import { createQuestion } from "@/lib/quiz-utils";
import { moveQuestionByOffset, reorderQuestionsById } from "@/lib/quiz-reorder";

describe("quiz reorder", () => {
  const q1 = createQuestion("One");
  const q2 = createQuestion("Two");
  const q3 = createQuestion("Three");
  const questions = [q1, q2, q3];

  it("reorders questions by drag target ids", () => {
    const result = reorderQuestionsById(questions, q3.id, q1.id);
    expect(result.map((q) => q.title)).toEqual(["Three", "One", "Two"]);
  });

  it("moves a question up and down with arrow controls", () => {
    const movedDown = moveQuestionByOffset(questions, q1.id, 1);
    expect(movedDown.map((q) => q.title)).toEqual(["Two", "One", "Three"]);

    const movedUp = moveQuestionByOffset(movedDown, q1.id, -1);
    expect(movedUp.map((q) => q.title)).toEqual(["One", "Two", "Three"]);
  });

  it("ignores invalid reorder operations", () => {
    expect(reorderQuestionsById(questions, "missing", q1.id)).toEqual(questions);
    expect(moveQuestionByOffset(questions, q1.id, -1)).toEqual(questions);
  });
});
