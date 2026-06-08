import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import {
  archiveFunnelInSupabase,
  deleteFunnelFromSupabase,
  fetchFunnelsForUser,
  FunnelStoreError,
  insertFunnel,
  mergeQuizInput,
  publishFunnelToSupabase,
  saveFunnelDraft,
} from "@/lib/funnel-store";
import type { Quiz, QuizInput } from "@/types/quiz";
import { DEFAULT_FUNNEL_RESULT } from "@/types/quiz";

interface QuizzesContextValue {
  quizzes: Quiz[];
  loading: boolean;
  getQuiz: (id: string) => Quiz | undefined;
  addQuiz: (quiz: QuizInput) => Quiz;
  updateQuiz: (id: string, updates: Partial<QuizInput>) => Quiz | undefined;
  publishQuiz: (id: string, draft: Quiz) => Promise<Quiz>;
  archiveQuiz: (id: string) => Promise<Quiz>;
  removeQuiz: (id: string) => void;
}

const QuizzesContext = createContext<QuizzesContextValue | null>(null);

const DRAFT_SAVE_DELAY_MS = 700;

export function QuizzesProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const saveTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const pendingSavesRef = useRef<Map<string, Quiz>>(new Map());
  const userIdRef = useRef<string | undefined>(undefined);
  userIdRef.current = user?.id;

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setQuizzes([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchFunnelsForUser(user.id)
      .then((rows) => {
        if (!cancelled) setQuizzes(rows);
      })
      .catch((err) => {
        console.warn("[QuizzesContext] load failed:", err);
        if (!cancelled) setQuizzes([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id, authLoading]);

  useEffect(() => {
    const timers = saveTimersRef.current;
    const pendingSaves = pendingSavesRef.current;
    return () => {
      // Flush any pending debounced saves so the last edit isn't lost on navigation.
      const uid = userIdRef.current;
      for (const timer of timers.values()) {
        clearTimeout(timer);
      }
      timers.clear();
      if (uid) {
        for (const quiz of pendingSaves.values()) {
          void saveFunnelDraft(uid, quiz).catch((err) => {
            console.warn("[QuizzesContext] flush save failed:", err);
          });
        }
      }
      pendingSaves.clear();
    };
  }, []);

  const scheduleDraftSave = useCallback(
    (quiz: Quiz) => {
      if (!user?.id) return;

      const timers = saveTimersRef.current;
      const pendingSaves = pendingSavesRef.current;
      const pending = timers.get(quiz.id);
      if (pending) clearTimeout(pending);

      pendingSaves.set(quiz.id, quiz);

      timers.set(
        quiz.id,
        setTimeout(() => {
          void saveFunnelDraft(user.id, quiz).catch((err) => {
            console.warn("[QuizzesContext] draft save failed:", err);
          });
          timers.delete(quiz.id);
          pendingSaves.delete(quiz.id);
        }, DRAFT_SAVE_DELAY_MS)
      );
    },
    [user?.id]
  );

  const getQuiz = useCallback(
    (id: string) => quizzes.find((q) => q.id === id),
    [quizzes]
  );

  const addQuiz = useCallback(
    (quiz: QuizInput) => {
      const now = new Date().toISOString();
      const entry: Quiz = {
        ...quiz,
        id: crypto.randomUUID(),
        publicSlug: undefined,
        status: quiz.status ?? "draft",
        result: quiz.result ?? DEFAULT_FUNNEL_RESULT,
        createdAt: now,
        updatedAt: now,
      };

      setQuizzes((prev) => [entry, ...prev]);

      if (user?.id) {
        void insertFunnel(user.id, entry)
          .then((saved) => {
            // Hydrate the DB id so analytics/responses work without a reload.
            if (saved.supabaseId) {
              setQuizzes((prev) =>
                prev.map((q) =>
                  q.id === entry.id ? { ...q, supabaseId: saved.supabaseId } : q
                )
              );
            }
          })
          .catch((err) => {
            console.warn("[QuizzesContext] insert failed:", err);
          });
      }

      return entry;
    },
    [user?.id]
  );

  const updateQuiz = useCallback(
    (id: string, updates: Partial<QuizInput>) => {
      let updated: Quiz | undefined;

      setQuizzes((prev) =>
        prev.map((q) => {
          if (q.id !== id) return q;
          updated = mergeQuizInput(q, updates);
          return updated;
        })
      );

      if (updated && user?.id) {
        scheduleDraftSave(updated);
      }

      return updated;
    },
    [user?.id, scheduleDraftSave]
  );

  const publishQuiz = useCallback(
    async (id: string, draft: Quiz) => {
      if (!user?.id) {
        throw new FunnelStoreError("Sign in to publish your funnel.");
      }

      const pending = saveTimersRef.current.get(id);
      if (pending) {
        clearTimeout(pending);
        saveTimersRef.current.delete(id);
      }
      pendingSavesRef.current.delete(id);

      const published = await publishFunnelToSupabase(user.id, { ...draft, id });

      setQuizzes((prev) => prev.map((q) => (q.id === id ? published : q)));

      return published;
    },
    [user?.id]
  );

  const archiveQuiz = useCallback(
    async (id: string) => {
      if (!user?.id) {
        throw new FunnelStoreError("Sign in to archive your funnel.");
      }

      const archived = await archiveFunnelInSupabase(user.id, id);
      setQuizzes((prev) => prev.map((q) => (q.id === id ? archived : q)));
      return archived;
    },
    [user?.id]
  );

  const removeQuiz = useCallback(
    (id: string) => {
      setQuizzes((prev) => prev.filter((q) => q.id !== id));

      if (user?.id) {
        void deleteFunnelFromSupabase(user.id, id).catch((err) => {
          console.warn("[QuizzesContext] delete failed:", err);
        });
      }
    },
    [user?.id]
  );

  const value = useMemo(
    () => ({
      quizzes,
      loading,
      getQuiz,
      addQuiz,
      updateQuiz,
      publishQuiz,
      archiveQuiz,
      removeQuiz,
    }),
    [quizzes, loading, getQuiz, addQuiz, updateQuiz, publishQuiz, archiveQuiz, removeQuiz]
  );

  return <QuizzesContext.Provider value={value}>{children}</QuizzesContext.Provider>;
}

export function useQuizzes() {
  const ctx = useContext(QuizzesContext);
  if (!ctx) throw new Error("useQuizzes must be used within QuizzesProvider");
  return ctx;
}

export { FunnelStoreError };
