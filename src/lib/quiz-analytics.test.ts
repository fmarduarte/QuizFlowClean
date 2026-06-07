import { describe, expect, it } from "vitest";
import { computeQuizAnalytics } from "@/lib/quiz-analytics";
import { createQuestion, createSeedQuiz } from "@/lib/quiz-utils";
import type { QuizResponse } from "@/types/quiz";

describe("computeQuizAnalytics", () => {
  const quiz = createSeedQuiz("Analytics Quiz", "", [], "q1");
  const q1 = createQuestion("Goal?");
  const q2 = createQuestion("Budget?");
  quiz.questions = [q1, q2];

  const responses: QuizResponse[] = [
    {
      id: "r1",
      quizId: "q1",
      answers: { [q1.id]: q1.options[0].id, [q2.id]: q2.options[0].id },
      leadEmail: "a@test.com",
      completedAt: new Date().toISOString(),
    },
    {
      id: "r2",
      quizId: "q1",
      answers: { [q1.id]: q1.options[0].id, [q2.id]: q2.options[1].id },
      leadEmail: "b@test.com",
      completedAt: new Date().toISOString(),
    },
  ];

  it("computes totals and lead capture rate", () => {
    const analytics = computeQuizAnalytics(quiz, responses);
    expect(analytics.totalResponses).toBe(2);
    expect(analytics.leadsCaptured).toBe(2);
    expect(analytics.leadCaptureRate).toBe(100);
  });

  it("breaks down answers per question", () => {
    const analytics = computeQuizAnalytics(quiz, responses);
    const firstQuestion = analytics.questionBreakdown[0];
    expect(firstQuestion.options[0].count).toBe(2);
    expect(firstQuestion.options[0].percent).toBe(100);
  });
});
