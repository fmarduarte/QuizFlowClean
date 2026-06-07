import type { Quiz, QuizResponse } from "@/types/quiz";

export interface QuestionAnalytics {
  questionId: string;
  questionTitle: string;
  options: { optionId: string; label: string; count: number; percent: number }[];
}

export interface QuizAnalytics {
  totalResponses: number;
  leadsCaptured: number;
  leadCaptureRate: number;
  questionBreakdown: QuestionAnalytics[];
}

export function getAnswerLabel(quiz: Quiz, questionId: string, optionId: string): string {
  const question = quiz.questions.find((q) => q.id === questionId);
  const option = question?.options.find((o) => o.id === optionId);
  return option?.label ?? "Unknown answer";
}

export function computeQuizAnalytics(quiz: Quiz, responses: QuizResponse[]): QuizAnalytics {
  const totalResponses = responses.length;
  const leadsCaptured = responses.filter((r) => r.leadEmail?.trim()).length;
  const leadCaptureRate =
    totalResponses > 0 ? Math.round((leadsCaptured / totalResponses) * 100) : 0;

  const questionBreakdown: QuestionAnalytics[] = quiz.questions.map((question) => {
    const options = question.options.map((option) => {
      const count = responses.filter((r) => r.answers[question.id] === option.id).length;
      const percent = totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0;
      return { optionId: option.id, label: option.label, count, percent };
    });

    return {
      questionId: question.id,
      questionTitle: question.title,
      options,
    };
  });

  return {
    totalResponses,
    leadsCaptured,
    leadCaptureRate,
    questionBreakdown,
  };
}
