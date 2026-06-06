import type { FunnelBriefValues } from "@/lib/funnel-brief";

export type LanguageMode = "original" | "translated";

/** Canonical funnel brief object passed through detection, storage, and generation. */
export interface FunnelBrief {
  funnelType: string;
  funnelTypeLabel: string;
  businessNiche: string;
  productOffer: string;
  targetAudience: string;
  goal: string;
  /** Field values used for generation (may be translated). */
  generationValues: FunnelBriefValues;
  /** Original form values before optional translation. */
  originalValues: FunnelBriefValues;
  detectedLanguage: string;
  detectedLanguageLabel: string;
  languageMode: LanguageMode;
  qualityScore: number;
  qualityLabel: string;
  title: string;
  /** Populated after Supabase insert. */
  supabaseId?: string;
  createdAt: string;
}

export interface LanguageDetection {
  code: string;
  label: string;
  confidence: number;
  isEnglish: boolean;
}
