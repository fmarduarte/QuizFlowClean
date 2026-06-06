import { computeAIConfidence } from "@/lib/ai-confidence";
import {
  type OnboardingAnswers,
  resolveActionGoal,
  resolveCustomerLabel,
  resolveFunnelTypeLabel,
  resolveProductLabel,
} from "@/lib/onboarding-options";

export interface AIQuizUnderstanding {
  business: string;
  audience: string;
  goal: string;
  recommendedQuizType: string;
  estimatedQuestions: number;
  recommendationLogic: string;
  canGenerate: boolean;
}

const ESTIMATED_QUESTIONS: Record<string, number> = {
  lead_generation: 5,
  sales: 6,
  application: 7,
  webinar: 6,
};

function buildRecommendationLogic(answers: OnboardingAnswers): string {
  const quizType = resolveFunnelTypeLabel(answers);
  const audience = resolveCustomerLabel(answers);
  const goal = resolveActionGoal(answers);

  if (!quizType || !audience || !goal) {
    return "Complete your business details so AI can recommend the right quiz structure.";
  }

  return `A ${quizType.toLowerCase()} fits ${audience.toLowerCase()} because answers can be scored toward your goal: ${goal.toLowerCase()}. AI will generate branching questions and a results page aligned to that outcome.`;
}

export function buildAIQuizUnderstanding(answers: OnboardingAnswers): AIQuizUnderstanding {
  const confidence = computeAIConfidence(answers);
  const business =
    [resolveProductLabel(answers), answers.details.trim()].filter(Boolean).join(" — ") ||
    "Not specified";
  const audience = resolveCustomerLabel(answers) ?? "Not specified";
  const goal = resolveActionGoal(answers) ?? "Not specified";
  const recommendedQuizType = resolveFunnelTypeLabel(answers) ?? "Not selected";
  const estimatedQuestions = answers.funnelType
    ? (ESTIMATED_QUESTIONS[answers.funnelType] ?? 5)
    : 5;

  return {
    business,
    audience,
    goal,
    recommendedQuizType,
    estimatedQuestions,
    recommendationLogic: buildRecommendationLogic(answers),
    canGenerate: confidence.canGenerate,
  };
}
