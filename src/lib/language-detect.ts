import type { LanguageDetection } from "@/types/funnel-brief";
import type { FunnelBriefValues } from "@/lib/funnel-brief";

const LANGUAGE_LABELS: Record<string, string> = {
  en: "English",
  pt: "Portuguese",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  unknown: "Unknown",
};

const PT_MARKERS =
  /\b(não|nao|você|voce|para|com|uma|um|das|dos|são|sao|também|tambem|obrigad|viagens|astronautas|empresa|clientes|produto|oferta|público|publico|objetivo|geração|geracao|funil)\b|ã|õ|ç|á|à|â|é|ê|í|ó|ô|ú/gi;

const ES_MARKERS =
  /\b(no|sí|si|para|con|una|los|las|empresa|clientes|producto|oferta|público|objetivo|viajes|astronautas)\b|ñ|¿|¡/gi;

const EN_MARKERS =
  /\b(the|and|for|with|your|our|customers|audience|product|offer|goal|funnel|leads|business|niche|target)\b/gi;

function scoreMarkers(text: string, pattern: RegExp): number {
  const matches = text.match(pattern);
  return matches?.length ?? 0;
}

export function detectLanguageFromText(text: string): LanguageDetection {
  const sample = text.trim().slice(0, 2000);
  if (!sample) {
    return { code: "en", label: "English", confidence: 0.5, isEnglish: true };
  }

  const pt = scoreMarkers(sample, PT_MARKERS);
  const es = scoreMarkers(sample, ES_MARKERS);
  const en = scoreMarkers(sample, EN_MARKERS);

  const scores = [
    { code: "pt", score: pt * 1.2 },
    { code: "es", score: es },
    { code: "en", score: en },
  ].sort((a, b) => b.score - a.score);

  const top = scores[0];
  const total = pt + es + en;

  if (total === 0 || top.score === 0) {
    const asciiRatio = (sample.match(/[a-zA-Z\s.,!?0-9-]/g)?.length ?? 0) / sample.length;
    if (asciiRatio > 0.95) {
      return { code: "en", label: "English", confidence: 0.6, isEnglish: true };
    }
    return { code: "unknown", label: "Unknown", confidence: 0.4, isEnglish: false };
  }

  const confidence = Math.min(0.95, top.score / Math.max(total, 1));
  const code = top.code;
  const label = LANGUAGE_LABELS[code] ?? code;

  return {
    code,
    label,
    confidence,
    isEnglish: code === "en",
  };
}

export function detectBriefLanguage(values: FunnelBriefValues): LanguageDetection {
  const combined = [
    values.businessNiche,
    values.productOffer,
    values.targetAudience,
    values.goal,
  ].join(" ");

  return detectLanguageFromText(combined);
}
