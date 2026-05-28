import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Quiz } from "@/types/quiz";

interface QuizzesContextValue {
  quizzes: Quiz[];
  addQuiz: (quiz: Omit<Quiz, "id" | "createdAt">) => Quiz;
  removeQuiz: (id: string) => void;
}

const QuizzesContext = createContext<QuizzesContextValue | null>(null);

const SEED_QUIZZES: Quiz[] = [
  {
    id: "seed-1",
    title: "Skincare Routine Matcher",
    description: "TikTok ad funnel for sensitive skin",
    questions: [
      "What's your skin type?",
      "What's your biggest concern?",
      "How much do you spend monthly?",
    ],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

export function QuizzesProvider({ children }: { children: ReactNode }) {
  const [quizzes, setQuizzes] = useState<Quiz[]>(SEED_QUIZZES);

  const addQuiz = useCallback((quiz: Omit<Quiz, "id" | "createdAt">) => {
    const entry: Quiz = {
      ...quiz,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setQuizzes((prev) => [entry, ...prev]);
    return entry;
  }, []);

  const removeQuiz = useCallback((id: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
  }, []);

  const value = useMemo(
    () => ({ quizzes, addQuiz, removeQuiz }),
    [quizzes, addQuiz, removeQuiz]
  );

  return <QuizzesContext.Provider value={value}>{children}</QuizzesContext.Provider>;
}

export function useQuizzes() {
  const ctx = useContext(QuizzesContext);
  if (!ctx) throw new Error("useQuizzes must be used within QuizzesProvider");
  return ctx;
}
