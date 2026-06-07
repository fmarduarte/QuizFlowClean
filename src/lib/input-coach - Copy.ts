import {
  FUNNEL_BRIEF_FIELDS,
  FUNNEL_TYPE_IDS,
  type FunnelBriefField,
  type FunnelBriefValues,
} from "@/lib/funnel-brief";

export const MIN_BRIEF_QUALITY_SCORE = 60;

export type QualityTier = "Poor" | "Basic" | "Good" | "Excellent";
export type CoachStatus = "Weak" | "Good" | "Excellent";

export interface DuplicateFieldPair {
  fields: [FunnelBriefField, FunnelBriefField];
  message: string;
}

export interface FieldCoachAnalysis {
  field: FunnelBriefField;
  score: number;
  tier: QualityTier;
  status: CoachStatus;
  isGeneric: boolean;
  isVague: boolean;
  isDuplicate?: boolean;
  duplicateWith?: FunnelBriefField[];
  isInvalidGoal?: boolean;
  message?: string;
  improvement?: string;
  suggestion?: string;
  applyValue?: string;
  coachQuestions: string[];
}

export interface BriefCoachAnalysis {
  score: number;
  tier: QualityTier;
  status: CoachStatus;
  label: QualityTier;
  hint: string;
  canGenerate: boolean;
  fields: FieldCoachAnalysis[];
  recommendations: string[];
  missingInfo: string[];
  duplicatePairs: DuplicateFieldPair[];
  isOverallGeneric: boolean;
  genericWarning?: string;
  poorBriefWarning?: string;
}

export function coachStatusFromScore(score: number): CoachStatus {
  if (score <= 40) return "Weak";
  if (score <= 75) return "Good";
  return "Excellent";
}

export function coachStatusLabel(status: CoachStatus): string {
  return status;
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

function tokenSet(value: string): Set<string> {
  return new Set(
    normalize(value)
      .split(/\s+/)
      .filter((w) => w.length > 2)
  );
}

function fieldSimilarity(a: string, b: string): number {
  const na = normalize(a);
  const nb = normalize(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1;

  const shorter = na.length < nb.length ? na : nb;
  const longer = na.length < nb.length ? nb : na;
  if (longer.includes(shorter) && shorter.length >= 12) return 0.92;

  const setA = tokenSet(a);
  const setB = tokenSet(b);
  if (setA.size === 0 || setB.size === 0) return 0;

  let overlap = 0;
  for (const token of setA) {
    if (setB.has(token)) overlap++;
  }
  const union = new Set([...setA, ...setB]).size;
  return union > 0 ? overlap / union : 0;
}

export function detectDuplicateFields(values: FunnelBriefValues): DuplicateFieldPair[] {
  const textFields: Exclude<FunnelBriefField, "funnelType">[] = [
    "businessNiche",
    "productOffer",
    "targetAudience",
    "goal",
  ];
  const pairs: DuplicateFieldPair[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < textFields.length; i++) {
    for (let j = i + 1; j < textFields.length; j++) {
      const fieldA = textFields[i];
      const fieldB = textFields[j];
      const key = [fieldA, fieldB].sort().join(":");
      if (seen.has(key)) continue;

      const valueA = values[fieldA].trim();
      const valueB = values[fieldB].trim();
      if (!valueA || !valueB) continue;

      if (fieldSimilarity(valueA, valueB) >= 0.72) {
        seen.add(key);
        const labelA = FUNNEL_BRIEF_FIELDS[fieldA].label;
        const labelB = FUNNEL_BRIEF_FIELDS[fieldB].label;
        pairs.push({
          fields: [fieldA, fieldB],
          message: `${labelA} and ${labelB} appear to contain the same information. Try describing: Business = market/category · Offer = product being sold · Audience = who you serve · Goal = measurable outcome.`,
        });
      }
    }
  }

  return pairs;
}

function improvementMessage(
  field: Exclude<FunnelBriefField, "funnelType">,
  analysis: Pick<FieldCoachAnalysis, "isVague" | "isInvalidGoal" | "score" | "suggestion">
): string | undefined {
  const label = FUNNEL_BRIEF_FIELDS[field].label;
  if (analysis.isInvalidGoal) {
    return `Clarify your goal with a measurable outcome — e.g. leads booked, appointments scheduled, or products sold.`;
  }
  if (analysis.isVague) {
    return `Make ${label.toLowerCase()} more specific: mention your industry, channel, audience segment, or a number.`;
  }
  if (analysis.score < 60 && analysis.suggestion) {
    return `Try adding concrete detail like: "${analysis.suggestion}"`;
  }
  if (analysis.score < 75 && analysis.suggestion) {
    return `Strengthen ${label.toLowerCase()} with specifics — channels, demographics, or metrics help.`;
  }
  return undefined;
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
      status: "Weak",
      isGeneric: false,
      isVague: false,
      message: `${config.label} is required.`,
      improvement: `Add ${config.label.toLowerCase()} so the coach can tailor your funnel — start with who you serve and what you sell.`,
      suggestion,
      applyValue: suggestion,
      coachQuestions,
    };
  }

  const invalidGoal = field === "goal" && !isValidMarketingGoal(trimmed);

  if (invalidGoal) {
    const applyValue = FIELD_SUGGESTIONS.goal;
    return {
      field,
      score: Math.min(12, trimmed.length),
      tier: "Poor",
      status: "Weak",
      isGeneric: true,
      isVague: true,
      isInvalidGoal: true,
      message:
        "This doesn't read as a marketing goal yet.",
      improvement:
        "Describe a conversion outcome — e.g. generate leads, book calls, sell a product, or qualify prospects. Add a number if you can.",
      suggestion: `e.g. ${VALID_GOAL_EXAMPLES.join(", ")}`,
      applyValue,
      coachQuestions,
    };
  }

  if (trimmed.length < config.minLength) {
    const shortScore = Math.min(18, 8 + trimmed.length);
    return {
      field,
      score: shortScore,
      tier: "Poor",
      status: coachStatusFromScore(shortScore),
      isGeneric: vague,
      isVague: vague,
      message: `A bit short — aim for at least ${config.minLength} characters.`,
      improvement: `Expand with specifics: who it's for, what they get, or how success is measured.`,
      suggestion,
      applyValue: suggestion,
      coachQuestions,
    };
  }

  if (vague) {
    const vagueScore = Math.min(22, 10 + words * 3);
    return {
      field,
      score: vagueScore,
      tier: "Poor",
      status: coachStatusFromScore(vagueScore),
      isGeneric: true,
      isVague: true,
      message: "This reads too generic for a high-quality funnel.",
      improvement: `Replace broad terms with your niche, offer, and audience — e.g. "${suggestion}".`,
      suggestion,
      applyValue: suggestion,
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
  const tier = tierFromScore(score);
  const status = coachStatusFromScore(score);

  return {
    field,
    score,
    tier,
    status,
    isGeneric: false,
    isVague: false,
    suggestion: score < 75 ? suggestion : undefined,
    applyValue: score < 75 ? suggestion : undefined,
    improvement: improvementMessage(field, {
      isVague: false,
      isInvalidGoal: false,
      score,
      suggestion,
    }),
    coachQuestions: score < 75 ? coachQuestions : [],
  };
}

export function analyzeBriefCoach(values: FunnelBriefValues): BriefCoachAnalysis {
  const fields: FieldCoachAnalysis[] = [];
  const recommendations: string[] = [];
  const missingInfo: string[] = [];
  const duplicatePairs = detectDuplicateFields(values);

  let weightedTotal = 0;

  if (values.funnelType && FUNNEL_TYPE_IDS.includes(values.funnelType)) {
    weightedTotal += FIELD_WEIGHTS.funnelType;
    fields.push({
      field: "funnelType",
      score: 100,
      tier: "Excellent",
      status: "Excellent",
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
      status: "Weak",
      isGeneric: false,
      isVague: false,
      message: "Select a funnel type to continue.",
      improvement: "Pick the funnel structure that matches your campaign objective.",
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
        `${label}: Turn this into a measurable outcome — e.g. ${VALID_GOAL_EXAMPLES.join(", ")}`
      );
    } else if (analysis.isVague) {
      recommendations.push(
        `${label}: Add niche-specific detail — try "${analysis.suggestion}"`
      );
    } else if (analysis.score < 60 && analysis.suggestion) {
      recommendations.push(`${label}: Strengthen with "${analysis.suggestion}"`);
    } else if (analysis.suggestion && analysis.score < 75) {
      recommendations.push(`${label}: Add channels, audience, or metrics like "${analysis.suggestion}"`);
    }
  }

  for (const pair of duplicatePairs) {
    for (const field of pair.fields) {
      const entry = fields.find((f) => f.field === field);
      if (entry) {
        entry.isDuplicate = true;
        entry.duplicateWith = pair.fields.filter((f) => f !== field);
        entry.improvement = pair.message;
        entry.score = Math.min(entry.score, 35);
        entry.tier = tierFromScore(entry.score);
        entry.status = coachStatusFromScore(entry.score);
      }
    }
    recommendations.unshift(pair.message);
  }

  const score = Math.round(weightedTotal);
  const tier = tierFromScore(score);
  const status = coachStatusFromScore(score);
  const vagueFields = fields.filter((f) => f.isVague || f.isGeneric);
  const isOverallGeneric = vagueFields.length >= 2 || fields.some((f) => f.isInvalidGoal);

  const canGenerate =
    score >= MIN_BRIEF_QUALITY_SCORE &&
    missingInfo.length === 0 &&
    duplicatePairs.length === 0 &&
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
    status,
    label: tier,
    hint: hintFromTier(tier, canGenerate),
    canGenerate,
    fields,
    recommendations,
    missingInfo,
    duplicatePairs,
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
