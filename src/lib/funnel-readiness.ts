import { extractBriefFromNarrative } from "@/lib/brief-extract";
import { isVagueInput, isValidMarketingGoal } from "@/lib/input-coach";

/** Minimum Funnel Readiness Score required before generation is allowed. */
export const MIN_FUNNEL_READINESS_SCORE = 60;

/** Per-dimension confidence floors for an actionable funnel. */
const MIN_OFFER_CONFIDENCE = 55;
const MIN_AUDIENCE_CONFIDENCE = 50;
const MIN_GOAL_CONFIDENCE = 50;

export type ReadinessDimension =
  | "business"
  | "offer"
  | "audience"
  | "goal"
  | "painPoint";

export type ReadinessStatus = "Not Ready" | "Almost Ready" | "Ready";

export interface DimensionDetection {
  dimension: ReadinessDimension;
  label: string;
  detected: boolean;
  value: string | null;
  confidence: number;
}

export interface MissingReadinessInfo {
  dimension: ReadinessDimension;
  label: string;
  whyItMatters: string;
  suggestion: string;
}

export interface FunnelReadinessAnalysis {
  score: number;
  status: ReadinessStatus;
  canGenerate: boolean;
  business: DimensionDetection;
  offer: DimensionDetection;
  audience: DimensionDetection;
  goal: DimensionDetection;
  painPoint: DimensionDetection;
  understandingSummary: string;
  missingInfo: MissingReadinessInfo[];
  viabilityWarnings: string[];
}

const PAIN_POINT_PATTERNS = [
  /\b(struggle with|struggling with|problem with|pain point|challenge of|frustrated by|can't|cannot|difficulty|difficult to|who need|who want|who lack)\s+([^.]{6,120})/i,
  /\b(helps?|solve|fix|address|overcome)\s+([^.]{6,120})/i,
  /\b(for\s+[^.]{5,80}\s+who\s+[^.]{6,120})/i,
];

const BUSINESS_PATTERNS = [
  /\b(ai|saas|e-?commerce|fitness|coaching|agency|skincare|supplements?|real estate|dental|legal|crypto|education|marketing|dtc|b2b|b2c)\b/i,
  /\b(shop|store|brand|studio|clinic|firm|company|startup)\b/i,
];

const DIMENSION_WEIGHTS: Record<Exclude<ReadinessDimension, "painPoint">, number> = {
  business: 0.15,
  offer: 0.3,
  audience: 0.25,
  goal: 0.3,
};

const MISSING_COPY: Record<
  Exclude<ReadinessDimension, "painPoint">,
  { whyItMatters: string; suggestion: string }
> = {
  business: {
    whyItMatters:
      "Without business context, the funnel may use generic language that doesn't match your market or positioning.",
    suggestion:
      "Mention your industry or niche — e.g. “TikTok Shop affiliate marketing” or “B2B SaaS for agencies.”",
  },
  offer: {
    whyItMatters:
      "Without a clear offer, the AI cannot design funnel steps, questions, or result pages around something concrete.",
    suggestion:
      "Describe what you sell or give away — e.g. “AI Hook Generator” or “Free 30-minute strategy audit.”",
  },
  audience: {
    whyItMatters:
      "Without a defined audience, quiz questions and ad copy will be too broad to convert on paid social.",
    suggestion:
      "Name who you're targeting — e.g. “TikTok Shop creators” or “local restaurant owners running Meta ads.”",
  },
  goal: {
    whyItMatters:
      "Without a conversion goal, the funnel won't know whether to capture leads, book calls, or drive purchases.",
    suggestion:
      "State the outcome — e.g. “Generate leads,” “Book appointments,” or “Sell the starter kit.”",
  },
};

function cleanPhrase(text: string, max = 120): string {
  return text
    .replace(/^[\s,.-]+|[\s,.-]+$/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function inferPainPoint(text: string): string {
  for (const pattern of PAIN_POINT_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      const captured = match[2] ?? match[1] ?? match[0];
      const cleaned = cleanPhrase(captured, 120);
      if (cleaned.length >= 6 && !isVagueInput(cleaned)) return cleaned;
    }
  }
  return "";
}

function scoreSpecificity(value: string): number {
  const trimmed = value.trim();
  if (!trimmed) return 0;

  let score = 20;
  const words = wordCount(trimmed);

  if (words >= 2) score += 10;
  if (words >= 4) score += 12;
  if (words >= 6) score += 8;
  if (trimmed.length >= 20) score += 8;
  if (/\d/.test(trimmed)) score += 6;
  if (/\b(tiktok|instagram|facebook|meta|shop|creators?|marketers?|owners?|agencies?)\b/i.test(trimmed)) {
    score += 10;
  }
  if (isVagueInput(trimmed)) score = Math.min(score, 28);
  if (words <= 2 && trimmed.length < 16) score = Math.min(score, 35);

  return Math.min(100, score);
}

function scoreOffer(value: string, narrative: string): number {
  if (!value.trim()) return 0;
  let score = scoreSpecificity(value);

  if (/\b(tool|app|software|platform|service|course|kit|program|generator|audit|consulting)\b/i.test(value)) {
    score += 15;
  }
  if (/\b(sell|offer|provide|create|build|help)\b/i.test(narrative)) score += 8;
  if (value === narrative.trim() && wordCount(narrative) <= 8) score = Math.min(score, 40);

  return Math.min(100, score);
}

function scoreAudience(value: string, narrative: string): number {
  if (!value.trim()) return 0;
  let score = scoreSpecificity(value);

  if (/\bfor\s+/i.test(narrative) && value.length >= 8) score += 12;
  if (/\b(creators?|marketers?|owners?|founders?|coaches?|sellers?|affiliates?|brands?)\b/i.test(value)) {
    score += 12;
  }
  if (/^(everyone|anyone|anybody|all people|people|users)$/i.test(value.trim())) {
    score = 12;
  }

  return Math.min(100, score);
}

function scoreGoal(value: string, funnelType?: string): number {
  if (!value.trim()) {
    if (funnelType === "lead_generation" || funnelType === "appointment_booking") return 30;
    return 0;
  }

  let score = scoreSpecificity(value);
  if (isValidMarketingGoal(value)) score += 25;
  else score = Math.min(score, 38);

  return Math.min(100, score);
}

function scoreBusiness(value: string, offer: string): number {
  if (!value.trim()) return 0;

  let score = scoreSpecificity(value);
  if (BUSINESS_PATTERNS.some((p) => p.test(value))) score += 15;
  if (offer && value !== offer && fieldOverlap(value, offer) < 0.85) score += 8;

  return Math.min(100, score);
}

function scorePainPoint(value: string): number {
  if (!value.trim()) return 0;
  return Math.min(100, scoreSpecificity(value) + 10);
}

function fieldOverlap(a: string, b: string): number {
  const na = a.trim().toLowerCase();
  const nb = b.trim().toLowerCase();
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  if (na.includes(nb) || nb.includes(na)) return 0.9;

  const setA = new Set(na.split(/\s+/).filter((w) => w.length > 2));
  const setB = new Set(nb.split(/\s+/).filter((w) => w.length > 2));
  let overlap = 0;
  for (const token of setA) {
    if (setB.has(token)) overlap++;
  }
  const union = new Set([...setA, ...setB]).size;
  return union > 0 ? overlap / union : 0;
}

function readinessStatus(score: number, canGenerate: boolean): ReadinessStatus {
  if (canGenerate) return "Ready";
  if (score >= 40) return "Almost Ready";
  return "Not Ready";
}

function buildUnderstandingSummary(parts: {
  offer: string | null;
  audience: string | null;
  goal: string | null;
  painPoint: string | null;
}): string {
  const lines: string[] = ["I believe you are offering:"];

  if (parts.offer) {
    lines.push(parts.offer);
  } else {
    lines.push("— not clear yet —");
  }

  lines.push("", "To:");

  if (parts.audience) {
    lines.push(parts.audience);
  } else {
    lines.push("— not clear yet —");
  }

  lines.push("", "Goal:");

  if (parts.goal) {
    lines.push(parts.goal);
  } else {
    lines.push("— not clear yet —");
  }

  if (parts.painPoint) {
    lines.push("", "Pain point:", parts.painPoint);
  }

  return lines.join("\n");
}

function buildMissingInfo(detections: {
  business: DimensionDetection;
  offer: DimensionDetection;
  audience: DimensionDetection;
  goal: DimensionDetection;
}): MissingReadinessInfo[] {
  const missing: MissingReadinessInfo[] = [];

  const required: Array<keyof typeof detections> = ["offer", "audience", "goal"];
  for (const key of required) {
    const d = detections[key];
    if (!d.detected || d.confidence < (key === "offer" ? MIN_OFFER_CONFIDENCE : key === "audience" ? MIN_AUDIENCE_CONFIDENCE : MIN_GOAL_CONFIDENCE)) {
      const copy = MISSING_COPY[key];
      missing.push({
        dimension: key,
        label: d.label,
        whyItMatters: copy.whyItMatters,
        suggestion: copy.suggestion,
      });
    }
  }

  if (!detections.business.detected || detections.business.confidence < 40) {
    missing.push({
      dimension: "business",
      label: detections.business.label,
      ...MISSING_COPY.business,
    });
  }

  return missing;
}

function buildViabilityWarnings(
  narrative: string,
  detections: {
    offer: DimensionDetection;
    audience: DimensionDetection;
    goal: DimensionDetection;
  }
): string[] {
  const warnings: string[] = [];
  const trimmed = narrative.trim();

  if (trimmed && isVagueInput(trimmed)) {
    warnings.push(
      "This description is too vague — the AI would produce a generic funnel that won't perform on paid social."
    );
  }

  if (detections.offer.value && detections.audience.value) {
    if (fieldOverlap(detections.offer.value, detections.audience.value) >= 0.75) {
      warnings.push(
        "Your offer and audience read as the same thing. Separate what you sell from who you sell it to."
      );
    }
  }

  if (detections.goal.value && !isValidMarketingGoal(detections.goal.value)) {
    warnings.push(
      "The goal isn't actionable yet — specify a conversion outcome like leads, bookings, or sales."
    );
  }

  if (wordCount(trimmed) <= 4 && trimmed.length < 30) {
    warnings.push(
      "Very short briefs usually produce weak funnels. Add a sentence about your offer, audience, and goal."
    );
  }

  return warnings;
}

function makeDetection(
  dimension: ReadinessDimension,
  label: string,
  value: string,
  confidence: number
): DimensionDetection {
  const cleaned = value.trim();
  return {
    dimension,
    label,
    detected: confidence >= 40 && cleaned.length > 0,
    value: cleaned || null,
    confidence,
  };
}

/**
 * Evaluates whether a natural-language brief has enough signal to produce
 * an actionable, realistic funnel — not whether form fields are filled.
 */
export function analyzeFunnelReadiness(
  narrative: string,
  funnelType?: string
): FunnelReadinessAnalysis {
  const text = narrative.trim();

  if (!text) {
    const empty = (dim: ReadinessDimension, label: string): DimensionDetection => ({
      dimension: dim,
      label,
      detected: false,
      value: null,
      confidence: 0,
    });

    const detections = {
      business: empty("business", "Business"),
      offer: empty("offer", "Offer"),
      audience: empty("audience", "Audience"),
      goal: empty("goal", "Goal"),
      painPoint: empty("painPoint", "Pain point"),
    };

    return {
      score: 0,
      status: "Not Ready",
      canGenerate: false,
      ...detections,
      understandingSummary: buildUnderstandingSummary({
        offer: null,
        audience: null,
        goal: null,
        painPoint: null,
      }),
      missingInfo: [
        {
          dimension: "offer",
          label: "Offer",
          ...MISSING_COPY.offer,
        },
        {
          dimension: "audience",
          label: "Audience",
          ...MISSING_COPY.audience,
        },
        {
          dimension: "goal",
          label: "Goal",
          ...MISSING_COPY.goal,
        },
      ],
      viabilityWarnings: [],
    };
  }

  const extracted = extractBriefFromNarrative(text, funnelType);
  const painPointRaw = inferPainPoint(text);

  const businessValue = extracted.businessNiche || "";
  const offerValue = extracted.productOffer || "";
  const audienceValue = extracted.targetAudience || "";
  const goalValue = extracted.goal || "";

  const business = makeDetection(
    "business",
    "Business",
    businessValue,
    scoreBusiness(businessValue, offerValue)
  );
  const offer = makeDetection("offer", "Offer", offerValue, scoreOffer(offerValue, text));
  const audience = makeDetection(
    "audience",
    "Audience",
    audienceValue,
    scoreAudience(audienceValue, text)
  );
  const goal = makeDetection("goal", "Goal", goalValue, scoreGoal(goalValue, funnelType));
  const painPoint = makeDetection(
    "painPoint",
    "Pain point",
    painPointRaw,
    scorePainPoint(painPointRaw)
  );

  let weightedScore =
    business.confidence * DIMENSION_WEIGHTS.business +
    offer.confidence * DIMENSION_WEIGHTS.offer +
    audience.confidence * DIMENSION_WEIGHTS.audience +
    goal.confidence * DIMENSION_WEIGHTS.goal;

  if (painPoint.detected) weightedScore += Math.min(5, painPoint.confidence * 0.05);

  const viabilityWarnings = buildViabilityWarnings(text, { offer, audience, goal });

  if (viabilityWarnings.length > 0) {
    weightedScore = Math.min(weightedScore, 55);
  }

  const score = Math.round(weightedScore);

  const canGenerate =
    score >= MIN_FUNNEL_READINESS_SCORE &&
    offer.confidence >= MIN_OFFER_CONFIDENCE &&
    audience.confidence >= MIN_AUDIENCE_CONFIDENCE &&
    goal.confidence >= MIN_GOAL_CONFIDENCE &&
    viabilityWarnings.length === 0 &&
    !isVagueInput(text);

  const status = readinessStatus(score, canGenerate);

  const understandingSummary = buildUnderstandingSummary({
    offer: offer.value,
    audience: audience.value,
    goal: goal.value,
    painPoint: painPoint.value,
  });

  const missingInfo = canGenerate
    ? []
    : buildMissingInfo({ business, offer, audience, goal });

  return {
    score,
    status,
    canGenerate,
    business,
    offer,
    audience,
    goal,
    painPoint,
    understandingSummary,
    missingInfo,
    viabilityWarnings,
  };
}
