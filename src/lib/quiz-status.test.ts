import { describe, expect, it } from "vitest";
import { isQuizPublished, resolveQuizStatus, statusToPublishedFields } from "@/lib/quiz-status";

describe("quiz status", () => {
  it("defaults to draft when no status is set", () => {
    expect(resolveQuizStatus({})).toBe("draft");
  });

  it("migrates legacy published boolean", () => {
    expect(resolveQuizStatus({ published: true })).toBe("published");
  });

  it("prefers explicit status field", () => {
    expect(resolveQuizStatus({ status: "archived", published: true })).toBe("archived");
  });

  it("marks published quizzes as shareable", () => {
    expect(isQuizPublished({ status: "published" })).toBe(true);
    expect(isQuizPublished({ status: "draft" })).toBe(false);
  });

  it("sets publish fields when publishing", () => {
    const fields = statusToPublishedFields("published");
    expect(fields.status).toBe("published");
    expect(fields.published).toBe(true);
    expect(fields.publishedAt).toBeTruthy();
  });
});
