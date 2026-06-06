import { arrayMove } from "@dnd-kit/sortable";
import type { Question } from "@/types/quiz";

export function reorderQuestionsById(
  questions: Question[],
  activeId: string,
  overId: string
): Question[] {
  const oldIndex = questions.findIndex((q) => q.id === activeId);
  const newIndex = questions.findIndex((q) => q.id === overId);
  if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return questions;
  return arrayMove(questions, oldIndex, newIndex);
}

export function moveQuestionByOffset(
  questions: Question[],
  questionId: string,
  offset: -1 | 1
): Question[] {
  const index = questions.findIndex((q) => q.id === questionId);
  if (index === -1) return questions;
  const newIndex = index + offset;
  if (newIndex < 0 || newIndex >= questions.length) return questions;
  return arrayMove(questions, index, newIndex);
}
