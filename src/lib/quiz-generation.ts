import { buildFunnelDescription } from "@/lib/funnel-brief";
import { quizFromInput } from "@/lib/quiz-utils";
import { generateMockFunnelQuestions } from "@/lib/mock-funnel-generator";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import type { FunnelBrief } from "@/types/funnel-brief";
import type { QuizInput } from "@/types/quiz";

export class AuthRequiredError extends Error {
  constructor() {
    super("AUTH_REQUIRED");
    this.name = "AuthRequiredError";
  }
}

export interface GenerateQuizParams {
  brief: FunnelBrief;
  accessToken: string | null | undefined;
}

export interface GeneratedFunnelResult extends QuizInput {
  brief: FunnelBrief;
}

/**
 * Generates a funnel from the canonical brief object.
 * Mock engine: dynamic questions from brief fields (no OpenAI yet).
 * Production: POST brief to server function with Authorization: Bearer <token>.
 */
export async function generateQuizFunnel({
  brief,
  accessToken,
}: GenerateQuizParams): Promise<GeneratedFunnelResult> {
  if (!accessToken) {
    throw new AuthRequiredError();
  }

  try {
    // Production: POST to a server function with Authorization: Bearer <token>
    // The server validates the JWT with Supabase before calling OpenAI.
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const questions = generateMockFunnelQuestions(brief);
    const title = brief.title.trim() || "Untitled Funnel";
    const description = buildFunnelDescription(brief.generationValues);

    const quiz = quizFromInput({
      title,
      description,
      questions,
      brief,
    });

    return { ...quiz, brief };
  } catch (err) {
    if (err instanceof AuthRequiredError) throw err;
    throw new Error(getAuthErrorMessage(err instanceof Error ? err.message : String(err)));
  }
}
