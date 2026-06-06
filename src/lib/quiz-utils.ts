import type { AnswerOption, Question, Quiz, QuizInput } from "@/types/quiz";

export function createOption(label = "New option"): AnswerOption {
  return { id: crypto.randomUUID(), label };
}

export function createQuestion(title = "Untitled question"): Question {
  return {
    id: crypto.randomUUID(),
    title,
    options: [createOption("Option 1"), createOption("Option 2")],
  };
}

export function regenerateIds(question: Question): Question {
  return {
    ...question,
    id: crypto.randomUUID(),
    options: question.options.map((o) => ({ ...o, id: crypto.randomUUID() })),
  };
}

/** Migrate legacy quizzes that stored questions as plain strings. */
export function normalizeQuiz(raw: unknown): Quiz | null {
  if (!raw || typeof raw !== "object") return null;
  const q = raw as Record<string, unknown>;
  if (typeof q.id !== "string" || typeof q.title !== "string" || !Array.isArray(q.questions)) {
    return null;
  }

  const createdAt = typeof q.createdAt === "string" ? q.createdAt : new Date().toISOString();
  const updatedAt = typeof q.updatedAt === "string" ? q.updatedAt : createdAt;

  const questions: Question[] = q.questions.map((item: unknown) => {
    if (typeof item === "string") {
      return createQuestion(item);
    }
    const question = item as Question;
    return {
      id: question.id ?? crypto.randomUUID(),
      title: question.title ?? "Untitled question",
      description: question.description,
      options:
        question.options?.length > 0
          ? question.options.map((o) => ({
              id: o.id ?? crypto.randomUUID(),
              label: o.label ?? "Option",
            }))
          : [createOption("Option 1"), createOption("Option 2")],
    };
  });

  return {
    id: q.id,
    title: q.title,
    description: typeof q.description === "string" ? q.description : undefined,
    questions,
    createdAt,
    updatedAt,
  };
}

export function createSeedQuiz(
  title: string,
  description: string,
  questionTitles: string[],
  id?: string
): Quiz {
  const now = new Date().toISOString();
  return {
    id: id ?? crypto.randomUUID(),
    title,
    description,
    questions: questionTitles.map((t) => createQuestion(t)),
    createdAt: now,
    updatedAt: now,
  };
}

export function quizFromInput(input: QuizInput): Omit<Quiz, "id" | "createdAt" | "updatedAt"> {
  return {
    title: input.title,
    description: input.description,
    questions: input.questions.map(regenerateIds),
  };
}
