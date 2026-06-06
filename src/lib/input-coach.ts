import {
  FUNNEL_BRIEF_FIELDS,
  FUNNEL_TYPE_IDS,
  type FunnelBriefField,
  type FunnelBriefValues,
} from "@/lib/funnel-brief";

export const MIN_BRIEF_QUALITY_SCORE = 60;

export type QualityTier = "Poor" | "Basic" | "Good" | "Excellent";

export interface FieldCoachAnalysis {
  field: FunnelBriefField;
  score: number;
  tier: QualityTier;
  isGeneric: boolean;
  isVague: boolean;
  isInvalidGoal?: boolean;
  message?: string;
  suggestion?: string;
  coachQuestions: string[];
}

export interface BriefCoachAnalysis {
  score: number;
  tier: QualityTier;
  label: QualityTier;
  hint: string;
  canGenerate: boolean;
  fields: FieldCoachAnalysis[];
  recommendations: string[];
  missingInfo: string[];
  isOverallGeneric: boolean;
  genericWarning?: string;
  poorBriefWarning?: string;
}

const VAGUE_TERMS = new Set([
  "marketing",
  "business",
  "company",
  "course",
  "product",
  "service",
  "offer",
  "everyone",
  "anybody",
  "all",
  "people",
  "users",
  "customers",
  "leads",
  "sales",
  "growth",
  "success",
  "niche",
  "ads",
  "funnel",
  "quiz",
  "brand",
  "online",
  "digital",
  "things",
  "stuff",
  "something",
  "anything",
  "tables",
  "tabelas",
  "table",
  "tabela",
  "test",
  "testing",
  "abc",
  "asdf",
  "random",
  "foo",
  "bar",
  "xxx",
  "lorem",
  "ipsum",
  "sample",
  "example",
  "demo",
  "na",
  "n/a",
  "none",
  "whatever",
  "idk",
  "dunno",
]);

const INVALID_GOAL_TERMS = new Set([
  ...VAGUE_TERMS,
  "tables",
  "tabelas",
  "table",
  "tabela",
  "test",
  "abc",
  "asdf",
  "qwerty",
  "123",
  "hello",
  "hi",
  "ok",
  "yes",
  "no",
]);

const GOAL_INTENT_PATTERNS =
  /\b(generate|book|sell|qualify|collect|convert|capture|drive|increase|grow|schedule|appointment|applications?|leads?|cpl|roas|revenue|sales|signups?|registrations?|downloads?|trials?|demos?|calls?|consultations?|purchases?|subscriptions?|gerar|agendar|vender|qualificar|candidatur|leads?|vendas?|consultas?|agendamentos?|inscrições|inscricoes|converter|captar)\b/i;

const FIELD_COACH_QUESTIONS: Record<Exclude<FunnelBriefField, "funnelType">, string[]> = {
  businessNiche: [
    "What specific type of marketing or industry?",
    "What market or niche are you in?",
  ],
  productOffer: ["What is the product?", "What do customers receive or buy?"],
  targetAudience: ["Who exactly is the audience?", "What demographics or pain points matter?"],
  goal: [
    "What result do they want?",
    "What is the measurable conversion goal?",
    "Is the goal to generate leads, book appointments, sell a product, qualify prospects, or collect applications?",
  ],
};

const FIELD_SUGGESTIONS: Record<Exclude<FunnelBriefField, "funnelType">, string> = {
  businessNiche: "Facebook Ads agency serving local restaurants",
  productOffer: "Free 30-minute marketing audit for new clients",
  targetAudience: "Small business owners looking to generate leads through Facebook Ads",
  goal: "Generate qualified leads and book 20 strategy calls per month at under $15 CPL",
};

const VALID_GOAL_EXAMPLES = [
  "Generate Leads",
  "Book Appointments",
  "Sell Product",
  "Qualify Prospects",
  "Collect Applications",
];

const FIELD_WEIGHTS: Record<FunnelBriefField, number> = {
  funnelType: 10,
  businessNiche: 22.5,
  productOffer: 22.5,
  targetAudience: 22.5,
  goal: 22.5,
};

function tierFromScore(score: number): QualityTier {
  if (score < 40) return "Poor";
  if (score < 60) return "Basic";
  if (score < 75) return "Good";
  return "Excellent";
}

function hintFromTier(tier: QualityTier, canGenerate: boolean): string {
  if (!canGenerate) {
    return "Your funnel brief needs more information before a high-quality funnel can be generated.";
  }
  switch (tier) {
    case "Poor":
      return "Add detail to every field — vague briefs produce weak funnels.";
    case "Basic":
      return "Usable, but more specificity will improve your funnel.";
    case "Good":
      return "Solid brief — you can generate or refine for even sharper results.";
    case "Excellent":
      return "Rich, specific brief — ready for high-quality funnel generation.";
  }
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function wordCount(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function isGenericInput(value: string): boolean {
  return isVagueInput(value);
}

export function isVagueInput(value: string): boolean {
  const trimmed = normalize(value);
  if (!trimmed) return false;

  const words = trimmed.split(/\s+/).filter(Boolean);

  if (words.length === 1 && VAGUE_TERMS.has(words[0])) return true;
  if (words.every((w) => VAGUE_TERMS.has(w))) return true;

  if (/^(everyone|anyone|anybody|all people|all users|people|users)$/i.test(trimmed)) {
    return true;
  }

  if (words.length <= 2 && trimmed.length < 18) return true;

  return false;
}

export function isValidMarketingGoal(value: string): boolean {
  const trimmed = normalize(value);
  if (!trimmed) return false;

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.some((w) => INVALID_GOAL_TERMS.has(w)) && words.length <= 2) return false;
  if (words.length === 1 && !GOAL_INTENT_PATTERNS.test(trimmed)) return false;

  return GOAL_INTENT_PATTERNS.test(trimmed) || words.length >= 4;
}

function specificityScore(value: string): number {
  let score = 0;
  const lower = normalize(value);
  const words = wordCount(value);

  if (words >= 3) score += 8;
  if (words >= 5) score += 10;
  if (words >= 8) score += 8;
  if (/\d/.test(value)) score += 10;
  if (/\b(facebook|instagram|tiktok|meta|google|linkedin|ads?)\b/i.test(lower)) score += 8;
  if (/\b(who|women|men|age|owners|founders|buyers|customers|leads|cpl|roi|acima|above|over)\b/i.test(lower)) {
    score += 8;
  }
  if (/\b(for|para|serving|targeting|looking|seeking|interested)\b/i.test(lower)) score += 5;

  return Math.min(score, 35);
}

function scoreTextField(
  field: Exclude<FunnelBriefField, "funnelType">,
  value: string
): FieldCoachAnalysis {
  const config = FUNNEL_BRIEF_FIELDS[field];
  const trimmed = value.trim();
  const vague = isVagueInput(trimmed);
  const coachQuestions = FIELD_COACH_QUESTIONS[field];
  const suggestion = FIELD_SUGGESTIONS[field];
  const words = wordCount(trimmed);

  if (!trimmed) {
    return {
      field,
      score: 0,
      tier: "Poor",
      isGeneric: false,
      isVague: false,
      message: `${config.label} is required.`,
      suggestion,
      coachQuestions,
    };
  }

  const invalidGoal = field === "goal" && !isValidMarketingGoal(trimmed);

  if (invalidGoal) {
    return {
      field,
      score: Math.min(12, trimmed.length),
      tier: "Poor",
      isGeneric: true,
      isVague: true,
      isInvalidGoal: true,
      message:
        "This goal is not a valid marketing objective. Use a conversion outcome like generating leads, booking appointments, or selling a product.",
      suggestion: `e.g. ${VALID_GOAL_EXAMPLES.join(", ")}`,
      coachQuestions,
    };
  }

  if (trimmed.length < config.minLength) {
    const shortScore = Math.min(18, 8 + trimmed.length);
    return {
      field,
      score: shortScore,
      tier: "Poor",
      isGeneric: vague,
      isVague: vague,
      message: `Add at least ${config.minLength} characters with specific, meaningful detail.`,
      suggestion,
      coachQuestions,
    };
  }

  if (vague) {
    return {
      field,
      score: Math.min(22, 10 + words * 3),
      tier: "Poor",
      isGeneric: true,
      isVague: true,
      message: "This description is too generic and may generate poor funnel results.",
      suggestion,
      coachQuestions,
    };
  }

  let score = 12 + specificityScore(trimmed);

  if (words === 1) score = Math.min(score, 18);
  if (words === 2) score = Math.min(score, 32);
  if (words === 3) score = Math.min(score, 48);

  if (field === "goal" && !GOAL_INTENT_PATTERNS.test(trimmed)) {
    score = Math.min(score, 38);
  }

  if (trimmed.length >= config.minLength * 1.5) score += 6;
  if (trimmed.length >= config.minLength * 2) score += 6;

  score = Math.min(100, Math.round(score));

  return {
    field,
    score,
    tier: tierFromScore(score),
    isGeneric: false,
    isVague: false,
    suggestion: score < 75 ? suggestion : undefined,
    coachQuestions: score < 75 ? coachQuestions : [],
  };
}

export function analyzeBriefCoach(values: FunnelBriefValues): BriefCoachAnalysis {
  const fields: FieldCoachAnalysis[] = [];
  const recommendations: string[] = [];
  const missingInfo: string[] = [];

  let weightedTotal = 0;

  if (values.funnelType && FUNNEL_TYPE_IDS.includes(values.funnelType)) {
    weightedTotal += FIELD_WEIGHTS.funnelType;
    fields.push({
      field: "funnelType",
      score: 100,
      tier: "Excellent",
      isGeneric: false,
      isVague: false,
      coachQuestions: [],
    });
  } else {
    missingInfo.push("Funnel type not selected");
    fields.push({
      field: "funnelType",
      score: 0,
      tier: "Poor",
      isGeneric: false,
      isVague: false,
      message: "Select a funnel type to continue.",
      coachQuestions: [],
    });
  }

  const textFields: Exclude<FunnelBriefField, "funnelType">[] = [
    "businessNiche",
    "productOffer",
    "targetAudience",
    "goal",
  ];

  for (const field of textFields) {
    const analysis = scoreTextField(field, values[field]);
    fields.push(analysis);

    weightedTotal += (analysis.score / 100) * FIELD_WEIGHTS[field];

    const label = FUNNEL_BRIEF_FIELDS[field].label;
    const current = values[field].trim();

    if (!current) {
      missingInfo.push(label);
    } else if (analysis.isInvalidGoal) {
      recommendations.push(
        `${label}: "${current}" is not a valid marketing goal. Try: ${VALID_GOAL_EXAMPLES.join(", ")}`
      );
    } else if (analysis.isVague) {
      recommendations.push(
        `${label}: Replace "${current}" with something specific — e.g. "${analysis.suggestion}"`
      );
    } else if (analysis.score < 60 && analysis.suggestion) {
      recommendations.push(`${label}: Try "${analysis.suggestion}"`);
    } else if (analysis.suggestion && analysis.score < 75) {
      recommendations.push(`${label}: Consider adding more detail like "${analysis.suggestion}"`);
    }
  }

  const score = Math.round(weightedTotal);
  const tier = tierFromScore(score);
  const vagueFields = fields.filter((f) => f.isVague || f.isGeneric);
  const isOverallGeneric = vagueFields.length >= 2 || fields.some((f) => f.isInvalidGoal);

  const canGenerate =
    score >= MIN_BRIEF_QUALITY_SCORE &&
    missingInfo.length === 0 &&
    !fields.some((f) => f.isInvalidGoal) &&
    fields.filter((f) => f.field !== "funnelType").every((f) => f.score >= 35);

  let genericWarning: string | undefined;
  if (isOverallGeneric) {
    genericWarning =
      "This description is too generic and may generate poor funnel results.";
    recommendations.unshift(
      "What specific type of marketing? What is the product? Who exactly is the audience? What measurable result do they want?"
    );
  }

  const poorBriefWarning =
    !canGenerate && score < MIN_BRIEF_QUALITY_SCORE
      ? "Your funnel brief needs more information before a high-quality funnel can be generated."
      : undefined;

  return {
    score,
    tier,
    label: tier,
    hint: hintFromTier(tier, canGenerate),
    canGenerate,
    fields,
    recommendations,
    missingInfo,
    isOverallGeneric,
    genericWarning,
    poorBriefWarning,
  };
}

export function getFieldCoachAnalysis(
  analysis: BriefCoachAnalysis,
  field: FunnelBriefField
): FieldCoachAnalysis | undefined {
  return analysis.fields.find((f) => f.field === field);
}
