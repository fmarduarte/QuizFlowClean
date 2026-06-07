import { describe, expect, it } from "vitest";
import { createQuestion } from "@/lib/quiz-utils";
import { funnelRowToQuiz, type FunnelRow } from "@/lib/funnel-store";
import { getFunnelStatus } from "@/lib/funnel-status";
import { DEFAULT_FUNNEL_RESULT } from "@/types/quiz";

describe("funnelRowToQuiz", () => {
  it("maps a published funnel row to a quiz", () => {
    const row: FunnelRow = {
      id: "db-1",
      user_id: "user-1",
      client_quiz_id: "client-1",
      public_slug: "client-1",
      title: "Stored title",
      description: "Desc",
      draft_data: {
        title: "Draft title",
        description: "Draft desc",
        questions: [createQuestion("Q1")],
        result: DEFAULT_FUNNEL_RESULT,
      },
      published_snapshot: {
        title: "Live title",
        questions: [createQuestion("Live Q1")],
        result: DEFAULT_FUNNEL_RESULT,
      },
      published_at: "2026-06-07T12:00:00.000Z",
      status: "published",
      created_at: "2026-06-01T00:00:00.000Z",
      updated_at: "2026-06-07T12:00:00.000Z",
    };

    const quiz = funnelRowToQuiz(row);

    expect(quiz.id).toBe("client-1");
    expect(quiz.supabaseId).toBe("db-1");
    expect(quiz.status).toBe("published");
    expect(quiz.publicSlug).toBe("client-1");
    expect(getFunnelStatus(quiz)).toBe("published");
  });

  it("maps a draft funnel row", () => {
    const row: FunnelRow = {
      id: "db-2",
      user_id: "user-1",
      client_quiz_id: "client-2",
      public_slug: "client-2",
      title: "Draft funnel",
      description: null,
      draft_data: {
        title: "Draft funnel",
        questions: [createQuestion("Only draft")],
      },
      published_snapshot: null,
      published_at: null,
      status: "draft",
      created_at: "2026-06-01T00:00:00.000Z",
      updated_at: "2026-06-01T00:00:00.000Z",
    };

    const quiz = funnelRowToQuiz(row);

    expect(quiz.status).toBe("draft");
    expect(getFunnelStatus(quiz)).toBe("draft");
  });

  it("maps an archived funnel row", () => {
    const row: FunnelRow = {
      id: "db-3",
      user_id: "user-1",
      client_quiz_id: "client-3",
      public_slug: "client-3",
      title: "Archived",
      description: null,
      draft_data: {
        title: "Archived",
        questions: [createQuestion("Q")],
      },
      published_snapshot: null,
      published_at: "2026-06-01T00:00:00.000Z",
      status: "archived",
      created_at: "2026-06-01T00:00:00.000Z",
      updated_at: "2026-06-02T00:00:00.000Z",
    };

    expect(getFunnelStatus(funnelRowToQuiz(row))).toBe("archived");
  });
});
