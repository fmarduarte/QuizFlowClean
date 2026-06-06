import { useCallback, useMemo, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { useAutosave } from "@/hooks/use-autosave";
import { createOption, createQuestion } from "@/lib/quiz-utils";
import type { Quiz } from "@/types/quiz";

interface UseQuizBuilderOptions {
  quiz: Quiz;
  onSave: (quiz: Quiz) => void;
}

export function useQuizBuilder({ quiz, onSave }: UseQuizBuilderOptions) {
  const [draft, setDraft] = useState<Quiz>(quiz);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    quiz.questions[0]?.id ?? null
  );

  const saveStatus = useAutosave(draft, onSave);

  const selectedQuestion = useMemo(
    () => draft.questions.find((q) => q.id === selectedQuestionId) ?? null,
    [draft.questions, selectedQuestionId]
  );

  const selectedIndex = useMemo(
    () => draft.questions.findIndex((q) => q.id === selectedQuestionId),
    [draft.questions, selectedQuestionId]
  );

  const updateDraft = useCallback((updater: (prev: Quiz) => Quiz) => {
    setDraft((prev) => updater(prev));
  }, []);

  const updateTitle = useCallback(
    (title: string) => updateDraft((prev) => ({ ...prev, title })),
    [updateDraft]
  );

  const updateDescription = useCallback(
    (description: string) => updateDraft((prev) => ({ ...prev, description })),
    [updateDraft]
  );

  const updateQuestionTitle = useCallback(
    (questionId: string, title: string) =>
      updateDraft((prev) => ({
        ...prev,
        questions: prev.questions.map((q) => (q.id === questionId ? { ...q, title } : q)),
      })),
    [updateDraft]
  );

  const updateQuestionDescription = useCallback(
    (questionId: string, description: string) =>
      updateDraft((prev) => ({
        ...prev,
        questions: prev.questions.map((q) =>
          q.id === questionId ? { ...q, description: description || undefined } : q
        ),
      })),
    [updateDraft]
  );

  const updateOptionLabel = useCallback(
    (questionId: string, optionId: string, label: string) =>
      updateDraft((prev) => ({
        ...prev,
        questions: prev.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                options: q.options.map((o) => (o.id === optionId ? { ...o, label } : o)),
              }
            : q
        ),
      })),
    [updateDraft]
  );

  const addQuestion = useCallback(() => {
    const question = createQuestion();
    updateDraft((prev) => ({ ...prev, questions: [...prev.questions, question] }));
    setSelectedQuestionId(question.id);
  }, [updateDraft]);

  const deleteQuestion = useCallback(
    (questionId: string) => {
      updateDraft((prev) => {
        const nextQuestions = prev.questions.filter((q) => q.id !== questionId);
        if (selectedQuestionId === questionId) {
          const idx = prev.questions.findIndex((q) => q.id === questionId);
          const next = nextQuestions[Math.min(idx, nextQuestions.length - 1)];
          setSelectedQuestionId(next?.id ?? null);
        }
        return { ...prev, questions: nextQuestions };
      });
    },
    [updateDraft, selectedQuestionId]
  );

  const duplicateQuestion = useCallback(
    (questionId: string) => {
      updateDraft((prev) => {
        const idx = prev.questions.findIndex((q) => q.id === questionId);
        if (idx === -1) return prev;
        const source = prev.questions[idx];
        const copy = createQuestion(`${source.title} (copy)`);
        copy.options = source.options.map((o) => ({ ...o, id: crypto.randomUUID() }));
        const next = [...prev.questions];
        next.splice(idx + 1, 0, copy);
        setSelectedQuestionId(copy.id);
        return { ...prev, questions: next };
      });
    },
    [updateDraft]
  );

  const reorderQuestions = useCallback(
    (activeId: string, overId: string) => {
      updateDraft((prev) => {
        const oldIndex = prev.questions.findIndex((q) => q.id === activeId);
        const newIndex = prev.questions.findIndex((q) => q.id === overId);
        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return prev;
        return { ...prev, questions: arrayMove(prev.questions, oldIndex, newIndex) };
      });
    },
    [updateDraft]
  );

  const addOption = useCallback(
    (questionId: string) => {
      updateDraft((prev) => ({
        ...prev,
        questions: prev.questions.map((q) =>
          q.id === questionId
            ? { ...q, options: [...q.options, createOption(`Option ${q.options.length + 1}`)] }
            : q
        ),
      }));
    },
    [updateDraft]
  );

  const deleteOption = useCallback(
    (questionId: string, optionId: string) => {
      updateDraft((prev) => ({
        ...prev,
        questions: prev.questions.map((q) => {
          if (q.id !== questionId || q.options.length <= 1) return q;
          return { ...q, options: q.options.filter((o) => o.id !== optionId) };
        }),
      }));
    },
    [updateDraft]
  );

  return {
    draft,
    selectedQuestion,
    selectedQuestionId,
    selectedIndex,
    saveStatus,
    setSelectedQuestionId,
    updateTitle,
    updateDescription,
    updateQuestionTitle,
    updateQuestionDescription,
    updateOptionLabel,
    addQuestion,
    deleteQuestion,
    duplicateQuestion,
    reorderQuestions,
    addOption,
    deleteOption,
  };
}
