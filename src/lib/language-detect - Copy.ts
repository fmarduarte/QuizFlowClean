import type { LanguageDetection } from "@/types/funnel-brief";
import type { FunnelBriefValues } from "@/lib/funnel-brief";

export const SUPPORTED_LANGUAGES = ["en", "pt", "es", "fr", "de", "it"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: "English",
  pt: "Portuguese",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
};

/** High-signal function words and marketing vocabulary per language. */
const LANGUAGE_LEXICON: Record<SupportedLanguage, Set<string>> = {
  en: new Set([
    "the", "and", "for", "with", "your", "our", "this", "that", "from", "into",
    "customers", "audience", "product", "offer", "goal", "funnel", "leads", "business",
    "niche", "target", "generate", "book", "sell", "qualify", "collect", "appointments",
    "facebook", "instagram", "tiktok", "ads", "marketing", "conversion", "owners", "women",
    "men", "looking", "through", "strategy", "calls", "month",
  ]),
  pt: new Set([
    "de", "da", "do", "das", "dos", "uma", "um", "uns", "umas", "para", "por", "com",
    "sem", "em", "no", "na", "nos", "nas", "ao", "aos", "que", "não", "nao", "são", "sao",
    "como", "mais", "muito", "bem", "quando", "onde", "quem", "este", "esta", "esse", "essa",
    "também", "tambem", "mulher", "mulheres", "homem", "homens", "velho", "velha", "velhos",
    "velhas", "acima", "abaixo", "visitas", "visita", "lua", "cristal", "tabelas", "tabela",
    "empresa", "clientes", "produto", "oferta", "objetivo", "funil", "geração", "geracao",
    "público", "publico", "vendas", "curso", "anúncios", "anuncios", "leads", "agendar",
    "vender", "qualificar", "candidaturas", "donas", "negócio", "negocio", "anúncio",
  ]),
  es: new Set([
    "de", "la", "el", "los", "las", "una", "uno", "para", "por", "con", "sin", "en",
    "que", "más", "mas", "muy", "bien", "cuando", "donde", "quién", "quien", "este",
    "esta", "empresa", "clientes", "producto", "oferta", "objetivo", "embudo", "público",
    "ventas", "curso", "anuncios", "generar", "vender", "cualificar", "citas", "leads",
  ]),
  fr: new Set([
    "de", "la", "le", "les", "un", "une", "des", "pour", "par", "avec", "sans", "dans",
    "que", "plus", "très", "tres", "bien", "quand", "où", "ou", "qui", "cette", "cet",
    "entreprise", "clients", "produit", "offre", "objectif", "entonnoir", "public",
    "ventes", "cours", "publicité", "générer", "generer", "vendre", "qualifier", "leads",
  ]),
  de: new Set([
    "der", "die", "das", "den", "dem", "des", "ein", "eine", "und", "für", "fur", "mit",
    "von", "zu", "auf", "ist", "nicht", "auch", "wie", "wenn", "wo", "wer", "unternehmen",
    "kunden", "produkt", "angebot", "ziel", "trichter", "publikum", "verkäufe", "verkaufe",
    "kurs", "werbung", "generieren", "verkaufen", "qualifizieren", "leads", "termin",
  ]),
  it: new Set([
    "di", "da", "del", "della", "dei", "delle", "un", "una", "per", "con", "senza", "in",
    "che", "non", "più", "piu", "molto", "bene", "quando", "dove", "chi", "questo",
    "questa", "azienda", "clienti", "prodotto", "offerta", "obiettivo", "imbuto", "pubblico",
    "vendite", "corso", "pubblicità", "pubblicita", "generare", "vendere", "qualificare", "leads",
  ]),
};

const DIACRITIC_BONUS: Partial<Record<SupportedLanguage, RegExp>> = {
  pt: /[ãõçáâàéêíóôú]/gi,
  es: /[ñ¿¡]/g,
  fr: /[èêëîïôûùüçœæ]/gi,
  de: /[äöüß]/gi,
  it: /[àèéìíîòóùú]/gi,
};

const PT_SUFFIX = /\w+(ção|ções|mente|inho|inha|ais|eis|oso|osa)\b/gi;
const MIN_RELIABLE_CONFIDENCE = 0.35;
const MIN_TEXT_LENGTH = 8;

function normalizeToken(token: string): string {
  return token
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[\s,.;:!?()[\]"']+/)
    .map(normalizeToken)
    .filter((t) => t.length > 1);
}

function scoreLanguage(text: string, lang: SupportedLanguage): number {
  const tokens = tokenize(text);
  if (tokens.length === 0) return 0;

  let score = 0;
  const lexicon = LANGUAGE_LEXICON[lang];

  for (const token of tokens) {
    if (lexicon.has(token)) score += 3;
    if (token.length >= 5) {
      for (const word of lexicon) {
        if (word.length >= 4 && (token.startsWith(word) || word.startsWith(token))) {
          score += 1;
        }
      }
    }
  }

  const diacritic = DIACRITIC_BONUS[lang];
  if (diacritic) {
    const matches = text.match(diacritic);
    if (matches) score += matches.length * 2;
  }

  if (lang === "pt") {
    const suffixMatches = text.match(PT_SUFFIX);
    if (suffixMatches) score += suffixMatches.length * 2;
  }

  return score;
}

export function detectLanguageFromText(text: string): LanguageDetection {
  const sample = text.trim();
  if (!sample || sample.length < MIN_TEXT_LENGTH) {
    return {
      code: "unknown",
      label: "Unknown",
      confidence: 0,
      isEnglish: false,
      isReliable: false,
    };
  }

  const scores = SUPPORTED_LANGUAGES.map((code) => ({
    code,
    score: scoreLanguage(sample, code),
  })).sort((a, b) => b.score - a.score);

  const top = scores[0];
  const second = scores[1];
  const total = scores.reduce((sum, s) => sum + s.score, 0);

  if (top.score === 0) {
    return {
      code: "unknown",
      label: "Unknown",
      confidence: 0,
      isEnglish: false,
      isReliable: false,
    };
  }

  const margin = top.score - (second?.score ?? 0);
  const confidence = Math.min(
    0.98,
    (top.score / Math.max(total, 1)) * 0.7 + (margin / Math.max(top.score, 1)) * 0.3
  );

  const isReliable = confidence >= MIN_RELIABLE_CONFIDENCE && margin >= 1;

  const code = isReliable ? top.code : top.score > 0 ? top.code : "unknown";
  const label =
    code !== "unknown" && SUPPORTED_LANGUAGES.includes(code as SupportedLanguage)
      ? LANGUAGE_LABELS[code as SupportedLanguage]
      : "Unknown";

  return {
    code,
    label,
    confidence: isReliable ? confidence : Math.min(confidence, MIN_RELIABLE_CONFIDENCE - 0.01),
    isEnglish: code === "en",
    isReliable,
  };
}

export function detectBriefLanguage(values: FunnelBriefValues): LanguageDetection {
  const combined = [
    values.businessNiche,
    values.productOffer,
    values.targetAudience,
    values.goal,
  ]
    .filter(Boolean)
    .join(" ");

  return detectLanguageFromText(combined);
}
