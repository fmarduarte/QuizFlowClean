import { moderateBrief, type ModerationResult } from "@/lib/content-moderation";
import { analyzeBriefCoach, type BriefCoachAnalysis } from "@/lib/input-coach";
import { detectBriefLanguage } from "@/lib/language-detect";
import { validateFunnelBrief } from "@/lib/funnel-brief";
import type { FunnelBriefValues } from "@/lib/funnel-brief";
import type { LanguageDetection } from "@/types/funnel-brief";

export interface BriefProtectionReport {
  language: LanguageDetection;
  coach: BriefCoachAnalysis;
  moderation: ModerationResult;
  validationErrors: string[];
  canGenerate: boolean;
  blockReasons: string[];
}

export function analyzeBriefProtection(values: FunnelBriefValues): BriefProtectionReport {
  const language = detectBriefLanguage(values);
  const coach = analyzeBriefCoach(values);
  const moderation = moderateBrief(values);
  const validation = validateFunnelBrief(values);

  const blockReasons: string[] = [];

  if (!validation.isValid) {
    blockReasons.push("Complete all required fields with meaningful content.");
  }

  if (!language.isReliable) {
    blockReasons.push(
      "We could not reliably detect your input language. Add more descriptive text so QuizFlow can process your brief correctly."
    );
  }

  if (moderation.blocked) {
    blockReasons.push("Your brief contains content that is not allowed. Please revise and try again.");
  }

  if (!coach.canGenerate) {
    if (coach.poorBriefWarning) {
      blockReasons.push(coach.poorBriefWarning);
    } else if (coach.score < 60) {
      blockReasons.push(
        `Brief quality is ${coach.score}%. Reach at least 60% with specific, relevant details.`
      );
    }
  }

  const validationErrors = Object.values(validation.errors).filter(Boolean) as string[];

  const canGenerate =
    validation.isValid &&
    language.isReliable &&
    !moderation.blocked &&
    coach.canGenerate;

  return {
    language,
    coach,
    moderation,
    validationErrors,
    canGenerate,
    blockReasons: [...new Set(blockReasons)],
  };
}
