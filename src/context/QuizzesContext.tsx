import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { removePublishedQuizSnapshot } from "@/lib/quiz-published-store";
import { removeResponsesForQuiz } from "@/lib/quiz-responses";
import { createSeedQuiz, normalizeQuiz } from "@/lib/quiz-utils";
import type { Quiz, QuizInput } from "@/types/quiz";

interface QuizzesContextValue {
  quizzes: Quiz[];
  getQuiz: (id: string) => Quiz | undefined;
  addQuiz: (quiz: QuizInput) => Quiz;
  updateQuiz: (id: string, updates: Partial<QuizInput>) => Quiz | undefined;
  removeQuiz: (id: string) => void;
}

const QuizzesContext = createContext<QuizzesContextValue | null>(null);

const STORAGE_KEY = "quizflow_quizzes";

const SEED_QUIZZES: Quiz[] = [
  createSeedQuiz(
    "Skincare Routine Matcher",
    "TikTok ad funnel for sensitive skin",
    ["What's your skin type?", "What's your biggest concern?", "How much do you spend monthly?"],
    "seed-1"
  ),
];

function loadQuizzes(): Quiz[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return SEED_QUIZZES;
    const parsed = JSON.parse(stored) as unknown[];
    const normalized = parsed.map(normalizeQuiz).filter((q): q is Quiz => q !== null);
    return normalized.length > 0 ? normalized : SEED_QUIZZES;
  } catch {
    return SEED_QUIZZES;
  }
}

export function QuizzesProvider({ children }: { children: ReactNode }) {
  const [quizzes, setQuizzes] = useState<Quiz[]>(loadQuizzes);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
  }, [quizzes]);

  const getQuiz = useCallback(
    (id: string) => quizzes.find((q) => q.id === id),
    [quizzes]
  );

  const addQuiz = useCallback((quiz: QuizInput) => {
    const now = new Date().toISOString();
    const entry: Quiz = {
      ...quiz,
      id: crypto.randomUUID(),
      status: quiz.status ?? "draft",
      published: quiz.published ?? false,
      createdAt: now,
      updatedAt: now,
    };
    setQuizzes((prev) => [entry, ...prev]);
    return entry;
  }, []);

  const updateQuiz = useCallback((id: string, updates: Partial<QuizInput>) => {
    let updated: Quiz | undefined;
    setQuizzes((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;
        updated = {
          ...q,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        return updated;
      })
    );
    return updated;
  }, []);

  const removeQuiz = useCallback((id: string) => {
    removePublishedQuizSnapshot(id);
    removeResponsesForQuiz(id);
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
  }, []);

  const value = useMemo(
    () => ({ quizzes, getQuiz, addQuiz, updateQuiz, removeQuiz }),
    [quizzes, getQuiz, addQuiz, updateQuiz, removeQuiz]
  );

  return <QuizzesContext.Provider value={value}>{children}</QuizzesContext.Provider>;
}

export function useQuizzes() {
  const ctx = useContext(QuizzesContext);
  if (!ctx) throw new Error("useQuizzes must be used within QuizzesProvider");
  return ctx;
}
