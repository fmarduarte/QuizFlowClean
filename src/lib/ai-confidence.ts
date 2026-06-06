import {
  type OnboardingAnswers,
  resolveActionGoal,
  resolveCustomerLabel,
  resolveFunnelTypeLabel,
  resolveProductLabel,
} from "@/lib/onboarding-options";

export const MIN_AI_CONFIDENCE = 75;

export interface AIConfidenceResult {
  confidence: number;
  message: string;
  canGenerate: boolean;
  understandingSummary: string;
  missingHint: string | null;
}

function needsOtherDetail(type: string | null, other: string): boolean {
  return type === "other" && other.trim().length < 2;
}

function buildUnderstandingSummary(answers: OnboardingAnswers): string {
  const funnel = resolveFunnelTypeLabel(answers);
  const offer = resolveProductLabel(answers);
  const audience = resolveCustomerLabel(answers);
  const goal = resolveActionGoal(answers);
  const details = answers.details.trim();

  const lines = ["I believe you are offering:"];

  lines.push(offer ?? "—");
  lines.push("", "To:");
  lines.push(audience ?? "—");
  lines.push("", "Goal:");
  lines.push(goal ?? "—");

  if (funnel) {
    lines.push("", "Funnel type:");
    lines.push(funnel);
  }

  if (details) {
    lines.push("", "Context:");
    lines.push(details);
  }

  return lines.join("\n");
}

function confidenceMessage(confidence: number, answers: OnboardingAnswers): string {
  if (needsOtherDetail(answers.productType, answers.productOther)) {
    return "Tell us a bit more about what you're selling.";
  }
  if (needsOtherDetail(answers.customerType, answers.customerOther)) {
    return "I still need more information about your audience.";
  }
  if (confidence >= 90) {
    return "I understand your offer and can generate a high-quality funnel.";
  }
  if (confidence >= MIN_AI_CONFIDENCE) {
    return "I have enough context to build your funnel.";
  }
  return "Complete the steps above so I can understand your offer.";
}

/**
 * Lightweight confidence from guided selections — not form-field validation.
 */
export function computeAIConfidence(answers: OnboardingAnswers): AIConfidenceResult {
  let confidence = 0;
  let missingHint: string | null = null;

  if (answers.funnelType) confidence += 23;
  else missingHint = "Choose a funnel type to continue.";

  if (answers.productType) {
    if (needsOtherDetail(answers.productType, answers.productOther)) {
      confidence += 8;
      missingHint ??= "Describe what you're selling.";
    } else {
      confidence += 23;
    }
  } else {
    missingHint ??= "Select what you're selling.";
  }

  if (answers.customerType) {
    if (needsOtherDetail(answers.customerType, answers.customerOther)) {
      confidence += 8;
      missingHint ??= "Describe who your customer is.";
    } else {
      confidence += 23;
    }
  } else {
    missingHint ??= "Select who your customer is.";
  }

  if (answers.action) confidence += 23;
  else missingHint ??= "Choose what you want them to do.";

  const details = answers.details.trim();
  if (details.length >= 20) confidence += 12;
  else if (details.length >= 8) confidence += 8;
  else if (details.length > 0) confidence += 4;

  confidence = Math.min(100, confidence);

  const canGenerate =
    confidence >= MIN_AI_CONFIDENCE &&
    !needsOtherDetail(answers.productType, answers.productOther) &&
    !needsOtherDetail(answers.customerType, answers.customerOther) &&
    Boolean(answers.funnelType && answers.productType && answers.customerType && answers.action);

  return {
    confidence,
    message: confidenceMessage(confidence, answers),
    canGenerate,
    understandingSummary: buildUnderstandingSummary(answers),
    missingHint: canGenerate ? null : missingHint,
  };
}
