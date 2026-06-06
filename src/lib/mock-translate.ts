import type { FunnelBriefValues } from "@/lib/funnel-brief";

/** Word-level PT→EN dictionary for mock translation (no OpenAI). */
const PT_EN_DICTIONARY: Record<string, string> = {
  viagens: "travel",
  viagem: "travel",
  lua: "moon",
  astronautas: "astronauts",
  astronauta: "astronaut",
  nasa: "NASA",
  empresa: "company",
  empresas: "companies",
  clientes: "customers",
  cliente: "customer",
  produto: "product",
  produtos: "products",
  oferta: "offer",
  público: "audience",
  publico: "audience",
  objetivo: "goal",
  objetivos: "goals",
  geração: "generation",
  geracao: "generation",
  leads: "leads",
  funil: "funnel",
  marketing: "marketing",
  digital: "digital",
  vendas: "sales",
  curso: "course",
  cursos: "courses",
  coaching: "coaching",
  saúde: "health",
  saude: "health",
  pele: "skin",
  skincare: "skincare",
  mulheres: "women",
  homens: "men",
  jovens: "young adults",
  gratuita: "free",
  gratuito: "free",
  consulta: "consultation",
  estratégia: "strategy",
  estrategia: "strategy",
  anúncios: "ads",
  anuncios: "ads",
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  para: "for",
  com: "with",
  de: "of",
  da: "of the",
  do: "of the",
  das: "of the",
  dos: "of the",
  e: "and",
  ou: "or",
  em: "in",
  no: "in the",
  na: "in the",
};

function normalizeToken(token: string): string {
  return token
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

/**
 * Mock translate & optimize — deterministic word mapping + English polish.
 * Replace with OpenAI translation when wired up.
 */
export function mockTranslateText(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;

  const tokens = trimmed.split(/(\s+|[,.;:!?])/);
  const translated = tokens.map((part) => {
    if (/^\s+$/.test(part) || /^[,.;:!?]$/.test(part)) return part;
    const key = normalizeToken(part.replace(/[^\wàáâãéêíóôõúçñ]/gi, ""));
    if (!key) return part;
    const mapped = PT_EN_DICTIONARY[key];
    if (mapped) {
      const capitalized = part[0] === part[0]?.toUpperCase();
      return capitalized ? mapped.charAt(0).toUpperCase() + mapped.slice(1) : mapped;
    }
    return part;
  });

  const joined = translated.join("").replace(/\s+/g, " ").trim();
  return polishEnglishBrief(joined);
}

function polishEnglishBrief(text: string): string {
  return text
    .replace(/\bof the the\b/gi, "of the")
    .replace(/\bfor for\b/gi, "for")
    .replace(/\s+,/g, ",")
    .trim();
}

export function mockTranslateAndOptimize(values: FunnelBriefValues): FunnelBriefValues {
  return {
    funnelType: values.funnelType,
    businessNiche: mockTranslateText(values.businessNiche),
    productOffer: mockTranslateText(values.productOffer),
    targetAudience: mockTranslateText(values.targetAudience),
    goal: mockTranslateText(values.goal),
  };
}
