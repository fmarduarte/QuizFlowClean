import { coachStatusFromScore, isVagueInput, type CoachStatus } from "@/lib/input-coach";

export interface FreeBriefCoachResult {
  score: number;
  status: CoachStatus;
  headline: string;
  why: string;
  howToImprove: string[];
  example: string;
}

const EXAMPLE_WEAK =
  "AI software that creates viral hooks for TikTok Shop creators and affiliate marketers.";

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function scoreFreeText(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;

  const words = wordCount(trimmed);
  let score = Math.min(25, words * 4);

  if (trimmed.length >= 40) score += 10;
  if (trimmed.length >= 80) score += 10;
  if (trimmed.length >= 120) score += 8;
  if (/\b(for|who|targeting|sell|offer|help|generate|book|leads?)\b/i.test(trimmed)) score += 12;
  if (/\b(tiktok|instagram|facebook|creators?|marketers?|owners?|coaches?)\b/i.test(trimmed)) {
    score += 10;
  }
  if (/\d/.test(trimmed)) score += 5;

  if (isVagueInput(trimmed)) score = Math.min(score, 28);
  if (words <= 3) score = Math.min(score, 22);

  return Math.min(100, Math.round(score));
}

export function analyzeFreeBriefText(text: string): FreeBriefCoachResult {
  const trimmed = text.trim();
  const score = scoreFreeText(trimmed);
  const status = coachStatusFromScore(score);
  const vague = trimmed.length > 0 && isVagueInput(trimmed);
  const short = trimmed.length > 0 && trimmed.length < 40;

  if (!trimmed) {
    return {
      score: 0,
      status: "Weak",
      headline: "Start with a short description of your business.",
      why: "The more context you share, the better your funnel will be.",
      howToImprove: [
        "Who your product is for",
        "What problem it solves",
        "What you want the funnel to achieve",
      ],
      example: EXAMPLE_WEAK,
    };
  }

  if (vague || short) {
    return {
      score,
      status,
      headline: "This description is too generic.",
      why: "Brief phrases like this don't give the AI enough context to build a high-converting funnel.",
      howToImprove: [
        "Who uses your product or service",
        "What problem it solves for them",
        "What market or niche you serve",
        "What outcome you want (leads, sales, bookings)",
      ],
      example: EXAMPLE_WEAK,
    };
  }

  if (status === "Good") {
    return {
      score,
      status,
      headline: "Good start — a bit more detail will sharpen your funnel.",
      why: "You've shared useful context. Adding audience specifics or a clear goal will improve results.",
      howToImprove: [
        "Name your ideal customer more precisely",
        "Clarify the offer or lead magnet",
        "Add a measurable goal if you haven't yet",
      ],
      example: EXAMPLE_WEAK,
    };
  }

  return {
    score,
    status,
    headline: "Strong brief — the AI has plenty to work with.",
    why: "Your description includes niche, offer, and audience signals.",
    howToImprove: [],
    example: EXAMPLE_WEAK,
  };
}
