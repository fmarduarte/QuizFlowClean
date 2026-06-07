import { describe, expect, it } from "vitest";
import { createQuestion } from "@/lib/quiz-utils";
import {
  createPublishedSnapshot,
  createPublishedUpdates,
  validateQuizForPublish,
} from "@/lib/quiz-publish";
import { DEFAULT_FUNNEL_RESULT, type Quiz } from "@/types/quiz";

describe("validateQuizForPublish", () => {
  it("rejects empty funnels", () => {
    const result = validateQuizForPublish({ title: "", questions: [] });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("accepts a complete funnel", () => {
    const result = validateQuizForPublish({
      title: "Lead Gen Funnel",
      questions: [createQuestion("What is your goal?")],
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });
});

describe("createPublishedUpdates", () => {
  it("stores an immutable published snapshot", () => {
    const quiz: Quiz = {
      id: "quiz-1",
      title: "My Funnel",
      questions: [createQuestion("Question one")],
      status: "draft",
      result: DEFAULT_FUNNEL_RESULT,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    };

    const updates = createPublishedUpdates(quiz, "2026-06-07T12:00:00.000Z");

    expect(updates.published).toBe(true);
    expect(updates.publishedAt).toBe("2026-06-07T12:00:00.000Z");
    expect(updates.publicSlug).toBe("quiz-1");
    expect(updates.publishedSnapshot?.title).toBe("My Funnel");
    expect(updates.publishedSnapshot?.questions).toHaveLength(1);

    quiz.questions[0].title = "Edited after publish";
    expect(updates.publishedSnapshot?.questions[0].title).toBe("Question one");
  });

  it("deep clones questions into the snapshot", () => {
    const quiz: Quiz = {
      id: "quiz-2",
      title: "Clone test",
      questions: [createQuestion("Original")],
      status: "draft",
      result: DEFAULT_FUNNEL_RESULT,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    };

    const snapshot = createPublishedSnapshot(quiz);
    snapshot!.questions[0].title = "Mutated";

    expect(quiz.questions[0].title).toBe("Original");
  });
});
