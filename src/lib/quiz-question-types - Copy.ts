/** Display labels for question logic in the quiz editor sidebar. */

const QUIZ_TYPE_SEQUENCE: Record<string, string[]> = {
  lead_generation: ["Multiple Choice", "Qualification", "Lead Capture"],
  product_recommendation: ["Multiple Choice", "Product Recommendation", "Result Match"],
  qualification: ["Multiple Choice", "Assessment", "Qualification"],
  application: ["Multiple Choice", "Application", "Qualification"],
  sales: ["Multiple Choice", "Product Recommendation", "Result Match"],
  webinar: ["Multiple Choice", "Assessment", "Registration"],
};

export function getQuestionTypeLabel(
  questionIndex: number,
  totalQuestions: number,
  quizTypeId?: string
): string {
  const sequence = quizTypeId ? QUIZ_TYPE_SEQUENCE[quizTypeId] : null;

  if (sequence && questionIndex < sequence.length) {
    return sequence[questionIndex];
  }

  if (questionIndex === totalQuestions - 1) return "Result";
  if (questionIndex === 0) return "Multiple Choice";
  return "Multiple Choice";
}
