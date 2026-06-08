import type { FunnelBriefValues } from "@/lib/funnel-brief";

const GOAL_PATTERNS = [
  /\b(?:my\s+)?goal\s+(?:is\s+)?(?:to\s+)?([^.]{5,120})/i,
  /\b(?:i\s+)?want\s+to\s+([^.]{5,120})/i,
  /\b(generate|book|sell|qualify|collect|convert|capture|drive|grow|schedule)\b[^.]{0,60}/i,
  /\b(leads?|appointments?|calls?|sales|signups?|applications?|revenue|cpl|roas)\b/i,
  /\b(gerar|agendar|vender|qualificar|converter|captar)\b[^.]{0,60}/i,
];

const AUDIENCE_PATTERNS = [
  /\bfor\s+([^.]{8,120})/i,
  /\b(targeting|target|audience|aimed at|serving)\s+([^.]{8,120})/i,
  /\b(para\s+)([^.]{8,120})/i,
  /\b(creators?|marketers?|owners?|founders?|coaches?|agencies?|brands?|sellers?)\b/i,
];

const OFFER_PATTERNS = [
  /\b(i sell|we sell|selling|offer|provides?|helps?)\s+([^.]{8,160})/i,
  /\b(tool|app|software|platform|service|course|kit|program|saas)\b[^.]{0,100}/i,
  /\b(vendo|ofereço|oferecemos|produto)\s+([^.]{8,160})/i,
];

function cleanPhrase(text: string, max = 120): string {
  return text
    .replace(/^[\s,.-]+|[\s,.-]+$/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function firstMatch(text: string, patterns: RegExp[]): string {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const captured = match[2] ?? match[1] ?? match[0];
      const cleaned = cleanPhrase(captured);
      if (cleaned.length >= 3) return cleaned;
    }
  }
  return "";
}

function inferNiche(text: string): string {
  const lower = text.toLowerCase();
  const industryMatch = text.match(
    /\b(ai|saas|e-commerce|ecommerce|fitness|coaching|agency|skincare|supplements?|real estate|dental|legal|crypto|education)\b[^.]{0,80}/i
  );
  if (industryMatch) return cleanPhrase(industryMatch[0], 80);

  const toolMatch = text.match(/\b(\w[\w\s-]{2,40}\s+(tool|app|software|platform))\b/i);
  if (toolMatch) return cleanPhrase(toolMatch[0], 80);

  if (lower.includes(" for ")) {
    const before = text.split(/\bfor\b/i)[0];
    return cleanPhrase(before, 80) || cleanPhrase(text, 60);
  }

  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= 6) return cleanPhrase(text, 80);
  return cleanPhrase(words.slice(0, Math.min(12, words.length)).join(" "), 80);
}

function inferOffer(text: string): string {
  const sellMatch = text.match(/\bi sell\s+(?:an?\s+)?([^.]{5,160})/i);
  if (sellMatch) {
    const offer = cleanPhrase(sellMatch[1], 200);
    const forSplit = offer.split(/\bfor\b/i)[0];
    if (forSplit && forSplit.length >= 5) return cleanPhrase(forSplit, 200);
    return offer;
  }

  const fromPattern = firstMatch(text, OFFER_PATTERNS);
  if (fromPattern) return cleanPhrase(fromPattern, 200);

  const productMatch = text.match(
    /\b(an?\s+)?([^.]{6,120}\b(tool|app|software|platform|course|kit|program|service|generator))\b/i
  );
  if (productMatch) return cleanPhrase(productMatch[0], 200);

  return "";
}

function inferAudience(text: string): string {
  const forMatch = text.match(/\bfor\s+([^.]{8,140})/i);
  if (forMatch) return cleanPhrase(forMatch[1], 200);

  const targetingMatch = text.match(
    /\b(targeting|target audience|aimed at|serving)\s+([^.]{8,140})/i
  );
  if (targetingMatch) return cleanPhrase(targetingMatch[2] ?? targetingMatch[0], 200);

  const audienceKeywords = text.match(
    /\b([^.]{0,40}\b(creators?|marketers?|affiliates?|shop sellers?|business owners?|coaches?|agencies?))\b/i
  );
  if (audienceKeywords) return cleanPhrase(audienceKeywords[0], 200);

  return "";
}

function inferGoal(text: string): string {
  for (const pattern of GOAL_PATTERNS) {
    const match = text.match(pattern);
    if (match) return cleanPhrase(match[0], 200);
  }

  if (/\bleads?\b/i.test(text)) return "Generate qualified leads";
  if (/\b(book|schedule|appointment|agendar)\b/i.test(text)) return "Book strategy calls or appointments";
  if (/\b(sell|vender|purchase|buy)\b/i.test(text)) return "Sell product and drive purchases";

  return "";
}

/**
 * Mock AI extraction — parses natural-language brief into structured fields.
 * Replace with OpenAI structured output when wired up.
 */
export function extractBriefFromNarrative(
  narrative: string,
  funnelType?: string
): Pick<FunnelBriefValues, "businessNiche" | "productOffer" | "targetAudience" | "goal"> {
  const text = narrative.trim();
  if (!text) {
    return { businessNiche: "", productOffer: "", targetAudience: "", goal: "" };
  }

  let businessNiche = inferNiche(text);
  let productOffer = inferOffer(text);
  let targetAudience = inferAudience(text);
  let goal = inferGoal(text);

  if (!productOffer && businessNiche) {
    productOffer = businessNiche;
  }
  if (!businessNiche && productOffer) {
    businessNiche = productOffer;
  }
  if (!goal && funnelType === "lead_generation") {
    goal = "Generate qualified leads";
  }
  if (!goal && funnelType === "appointment_booking") {
    goal = "Book qualified appointments";
  }

  if (text.length <= 40 && !targetAudience) {
    businessNiche = businessNiche || text;
    productOffer = productOffer || text;
  }

  return {
    businessNiche: cleanPhrase(businessNiche, 80),
    productOffer: cleanPhrase(productOffer, 200),
    targetAudience: cleanPhrase(targetAudience, 200),
    goal: cleanPhrase(goal, 200),
  };
}
