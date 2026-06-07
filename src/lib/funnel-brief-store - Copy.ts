import { supabase } from "@/lib/supabase";
import type { FunnelBrief } from "@/types/funnel-brief";

export interface SaveFunnelBriefParams {
  brief: FunnelBrief;
  userId: string;
  quizId: string;
}

/**
 * Persists the complete funnel brief to Supabase.
 * Non-blocking: returns null if the table is missing or insert fails.
 */
export async function saveFunnelBriefToSupabase({
  brief,
  userId,
  quizId,
}: SaveFunnelBriefParams): Promise<string | null> {
  const { data, error } = await supabase
    .from("funnel_briefs")
    .insert({
      user_id: userId,
      quiz_id: quizId,
      funnel_type: brief.funnelType,
      business_niche: brief.businessNiche,
      product_offer: brief.productOffer,
      target_audience: brief.targetAudience,
      goal: brief.goal,
      detected_language: brief.detectedLanguage,
      language_mode: brief.languageMode,
      quality_score: brief.qualityScore,
      quality_label: brief.qualityLabel,
      title: brief.title,
      brief_json: brief,
    })
    .select("id")
    .single();

  if (error) {
    console.warn("[funnel-brief-store] Supabase insert failed:", error.message);
    return null;
  }

  return data.id;
}
