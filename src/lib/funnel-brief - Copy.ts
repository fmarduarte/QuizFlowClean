import { analyzeBriefCoach } from "@/lib/input-coach";
import { FUNNEL_TYPES } from "@/lib/funnel-types";
import type { FunnelBrief, LanguageDetection, LanguageMode } from "@/types/funnel-brief";

export type FunnelBriefField =
  | "funnelType"
  | "businessNiche"
  | "productOffer"
  | "targetAudience"
  | "goal";

export interface FunnelBriefValues {
  funnelType: string;
  businessNiche: string;
  productOffer: string;
  targetAudience: string;
  goal: string;
}

export const EMPTY_FUNNEL_BRIEF: FunnelBriefValues = {
  funnelType: "",
  businessNiche: "",
  productOffer: "",
  targetAudience: "",
  goal: "",
};

export interface FunnelBriefFieldConfig {
  label: string;
  placeholder: string;
  help: string;
  example: string;
  minLength: number;
  maxLength: number;
}

export const FUNNEL_BRIEF_FIELDS: Record<FunnelBriefField, FunnelBriefFieldConfig> = {
  funnelType: {
    label: "Funnel Type",
    placeholder: "Select a funnel type",
    help: "Choose the funnel structure that matches your paid social campaign objective.",
    example: "Lead Generation — capture emails before showing your offer on Meta or TikTok.",
    minLength: 1,
    maxLength: 64,
  },
  businessNiche: {
    label: "Business / Niche",
    placeholder: "e.g. Organic skincare for sensitive skin",
    help: "What industry or niche is this funnel for? Be specific so the AI can mirror your market language.",
    example: "DTC supplements for women 35+, or a local dental clinic targeting families.",
    minLength: 2,
    maxLength: 80,
  },
  productOffer: {
    label: "Product / Offer",
    placeholder: "e.g. 30-day glow kit with free skin analysis",
    help: "Describe the product, service, or lead magnet you are promoting in ads.",
    example: "Free 15-min strategy call, $47 starter kit, or 7-day trial of your SaaS tool.",
    minLength: 5,
    maxLength: 200,
  },
  targetAudience: {
    label: "Target Audience",
    placeholder: "Who are you targeting on paid social?",
    help: "Include demographics, pain points, and where they scroll (Meta, TikTok, etc.).",
    example:
      "Women 28–45 with adult acne who buy clean beauty on Instagram and respond to UGC-style ads.",
    minLength: 10,
    maxLength: 300,
  },
  goal: {
    label: "Goal",
    placeholder: "What should this funnel achieve?",
    help: "State the primary conversion goal so steps and result pages align with your KPI.",
    example: "Collect qualified leads for a high-ticket coaching program at under $12 CPL.",
    minLength: 5,
    maxLength: 150,
  },
};

export const FUNNEL_TYPE_IDS = FUNNEL_TYPES.map((t) => t.id);

export interface FunnelBriefValidation {
  isValid: boolean;
  errors: Partial<Record<FunnelBriefField, string>>;
}

function lengthError(
  field: FunnelBriefField,
  value: string,
  config: FunnelBriefFieldConfig
): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return `${config.label} is required.`;
  if (trimmed.length < config.minLength) {
    return `Add at least ${config.minLength} characters — a bit more detail helps the AI.`;
  }
  if (trimmed.length > config.maxLength) {
    return `Keep this under ${config.maxLength} characters.`;
  }
  return undefined;
}

export function validateFunnelBrief(values: FunnelBriefValues): FunnelBriefValidation {
  const errors: Partial<Record<FunnelBriefField, string>> = {};

  if (!values.funnelType || !FUNNEL_TYPE_IDS.includes(values.funnelType)) {
    errors.funnelType = "Select a funnel type to continue.";
  }

  const textFields: FunnelBriefField[] = [
    "businessNiche",
    "productOffer",
    "targetAudience",
    "goal",
  ];

  for (const field of textFields) {
    const err = lengthError(field, values[field], FUNNEL_BRIEF_FIELDS[field]);
    if (err) errors[field] = err;
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export interface BriefQualityResult {
  score: number;
  label: "Poor" | "Basic" | "Good" | "Excellent";
  hint: string;
  canGenerate: boolean;
}

export function computeBriefQuality(values: FunnelBriefValues): BriefQualityResult {
  const coach = analyzeBriefCoach(values);
  return {
    score: coach.score,
    label: coach.label,
    hint: coach.hint,
    canGenerate: coach.canGenerate,
  };
}

export function buildFunnelTitle(values: FunnelBriefValues): string {
  const type = FUNNEL_TYPES.find((t) => t.id === values.funnelType);
  const niche = values.businessNiche.trim();
  if (type && niche) return `${type.shortTitle} — ${niche}`;
  return niche || type?.shortTitle || "Untitled Funnel";
}

export function buildFunnelDescription(values: FunnelBriefValues): string {
  const type = FUNNEL_TYPES.find((t) => t.id === values.funnelType);
  return [
    `Funnel type: ${type?.title ?? values.funnelType}`,
    `Business/Niche: ${values.businessNiche.trim()}`,
    `Product/Offer: ${values.productOffer.trim()}`,
    `Target audience: ${values.targetAudience.trim()}`,
    `Goal: ${values.goal.trim()}`,
  ].join("\n");
}

export function createFunnelBrief(params: {
  originalValues: FunnelBriefValues;
  generationValues: FunnelBriefValues;
  languageMode: LanguageMode;
  detectedLanguage: LanguageDetection;
}): FunnelBrief {
  const quality = computeBriefQuality(params.generationValues);
  const type = FUNNEL_TYPES.find((t) => t.id === params.generationValues.funnelType);

  return {
    funnelType: params.generationValues.funnelType,
    funnelTypeLabel: type?.shortTitle ?? params.generationValues.funnelType,
    businessNiche: params.generationValues.businessNiche.trim(),
    productOffer: params.generationValues.productOffer.trim(),
    targetAudience: params.generationValues.targetAudience.trim(),
    goal: params.generationValues.goal.trim(),
    generationValues: {
      funnelType: params.generationValues.funnelType,
      businessNiche: params.generationValues.businessNiche.trim(),
      productOffer: params.generationValues.productOffer.trim(),
      targetAudience: params.generationValues.targetAudience.trim(),
      goal: params.generationValues.goal.trim(),
    },
    originalValues: {
      funnelType: params.originalValues.funnelType,
      businessNiche: params.originalValues.businessNiche.trim(),
      productOffer: params.originalValues.productOffer.trim(),
      targetAudience: params.originalValues.targetAudience.trim(),
      goal: params.originalValues.goal.trim(),
    },
    detectedLanguage: params.detectedLanguage.code,
    detectedLanguageLabel: params.detectedLanguage.label,
    languageMode: params.languageMode,
    qualityScore: quality.score,
    qualityLabel: quality.label,
    title: buildFunnelTitle(params.generationValues),
    createdAt: new Date().toISOString(),
  };
}
