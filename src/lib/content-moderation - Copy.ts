import type { FunnelBriefField, FunnelBriefValues } from "@/lib/funnel-brief";

export type ModerationCategory =
  | "profanity"
  | "hate_speech"
  | "discrimination"
  | "harassment"
  | "sexual_content"
  | "illegal_activity"
  | "self_harm"
  | "violence_extremism";

export interface ModerationIssue {
  category: ModerationCategory;
  severity: "high" | "medium";
  message: string;
  field?: FunnelBriefField;
}

export interface ModerationResult {
  blocked: boolean;
  issues: ModerationIssue[];
}

const FRIENDLY_MESSAGES: Record<ModerationCategory, string> = {
  profanity:
    "Please remove profanity from your brief. QuizFlow keeps funnels professional and ad-platform safe.",
  hate_speech:
    "Hate speech is not allowed. Rephrase your brief without attacking or demeaning any group.",
  discrimination:
    "Discriminatory language is not allowed. Describe your audience respectfully and without exclusionary terms.",
  harassment:
    "Harassing or threatening language is not allowed. Keep your funnel brief professional.",
  sexual_content:
    "Sexual or explicit content is not allowed in funnel briefs.",
  illegal_activity:
    "QuizFlow cannot generate funnels that promote illegal products or activities.",
  self_harm:
    "Self-harm related content is not allowed. If you need support, please contact a local crisis service.",
  violence_extremism:
    "Violent or extremist content is not allowed in funnel briefs.",
};

type PatternRule = { category: ModerationCategory; pattern: RegExp; severity: "high" | "medium" };

const MODERATION_RULES: PatternRule[] = [
  {
    category: "profanity",
    severity: "high",
    pattern:
      /\b(f+u+c+k+|sh+i+t+|b+i+t+c+h+|a+s+s+h+o+l+e+|damn|hell|crap|bastard|merda|porra|caralho|foda|puta|fdp)\b/i,
  },
  {
    category: "hate_speech",
    severity: "high",
    pattern:
      /\b(kill\s+all|exterminate|subhuman|inferior\s+race|white\s+power|heil\s+hitler|nazi|supremac)\b/i,
  },
  {
    category: "discrimination",
    severity: "high",
    pattern:
      /\b(no\s+(blacks|whites|gays|women|men|muslims|jews|immigrants)|ban\s+all\s+(muslims|immigrants)|racial\s+inferior)\b/i,
  },
  {
    category: "harassment",
    severity: "high",
    pattern: /\b(i\s+will\s+kill\s+you|go\s+die|you\s+should\s+die|stalk|doxx|dox)\b/i,
  },
  {
    category: "sexual_content",
    severity: "high",
    pattern: /\b(porn|xxx|nude|naked|sex\s+tape|escort\s+service|onlyfans\s+leak)\b/i,
  },
  {
    category: "illegal_activity",
    severity: "high",
    pattern:
      /\b(cocaine|heroin|meth|counterfeit|fake\s+passport|money\s+launder|card\s+skim|stolen\s+credit)\b/i,
  },
  {
    category: "self_harm",
    severity: "high",
    pattern: /\b(kill\s+myself|suicide\s+method|how\s+to\s+end\s+my\s+life|self\s*harm\s+tips)\b/i,
  },
  {
    category: "violence_extremism",
    severity: "high",
    pattern: /\b(bomb\s+making|terrorist\s+attack|mass\s+shooting|isis\s+recruit|join\s+isis)\b/i,
  },
];

export function moderateText(
  text: string,
  field?: FunnelBriefField
): ModerationIssue[] {
  const sample = text.trim();
  if (!sample) return [];

  const issues: ModerationIssue[] = [];

  for (const rule of MODERATION_RULES) {
    if (rule.pattern.test(sample)) {
      issues.push({
        category: rule.category,
        severity: rule.severity,
        message: FRIENDLY_MESSAGES[rule.category],
        field,
      });
    }
  }

  return issues;
}

export function moderateBrief(values: FunnelBriefValues): ModerationResult {
  const fields: { field: FunnelBriefField; value: string }[] = [
    { field: "businessNiche", value: values.businessNiche },
    { field: "productOffer", value: values.productOffer },
    { field: "targetAudience", value: values.targetAudience },
    { field: "goal", value: values.goal },
  ];

  const issues: ModerationIssue[] = [];
  const seen = new Set<string>();

  for (const { field, value } of fields) {
    for (const issue of moderateText(value, field)) {
      const key = `${issue.category}:${issue.field}`;
      if (!seen.has(key)) {
        seen.add(key);
        issues.push(issue);
      }
    }
  }

  const blocked = issues.some((i) => i.severity === "high");

  return { blocked, issues };
}
