import { quizFromInput } from "@/lib/quiz-utils";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { DEMO_QUIZ } from "@/types/quiz";
import type { QuizInput } from "@/types/quiz";

export class AuthRequiredError extends Error {
  constructor() {
    super("AUTH_REQUIRED");
    this.name = "AuthRequiredError";
  }
}

interface GenerateQuizParams {
  title: string;
  description?: string;
  accessToken: string | null | undefined;
}

/**
 * Generates a quiz funnel. Requires a valid Supabase access token before any
 * AI/OpenAI work runs — swap the mock body for a server call when wired up.
 */
export async function generateQuizFunnel({
  title,
  description,
  accessToken,
}: GenerateQuizParams): Promise<QuizInput> {
  if (!accessToken) {
    throw new AuthRequiredError();
  }

  try {
    // Production: POST to a server function with Authorization: Bearer <token>
    // The server validates the JWT with Supabase before calling OpenAI.
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return quizFromInput({
      title: title.trim() || DEMO_QUIZ.title,
      description: description?.trim() || DEMO_QUIZ.description,
      questions: DEMO_QUIZ.questions,
    });
  } catch (err) {
    if (err instanceof AuthRequiredError) throw err;
    throw new Error(getAuthErrorMessage(err instanceof Error ? err.message : String(err)));
  }
}
