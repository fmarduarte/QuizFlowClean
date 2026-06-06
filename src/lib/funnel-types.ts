import type { LucideIcon } from "lucide-react";
import { ClipboardList, Filter, ShoppingBag, Users } from "lucide-react";

export interface FunnelTypeDefinition {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  useCase: string;
  icon: LucideIcon;
  platforms: string[];
}

/** Display-only definitions for Phase 1. Engine wiring comes in Phase 2. */
export const FUNNEL_TYPES: FunnelTypeDefinition[] = [
  {
    id: "lead_generation",
    title: "Lead Generation Funnel",
    shortTitle: "Lead Generation",
    description: "Capture leads before presenting your offer.",
    useCase: "Optimized for Facebook and TikTok Ads",
    icon: Users,
    platforms: ["Meta Ads", "TikTok Ads"],
  },
  {
    id: "product_recommendation",
    title: "Product Recommendation Funnel",
    shortTitle: "Product Recommendation",
    description: "Recommend the best product or service based on answers.",
    useCase: "Ideal for ecommerce and affiliate offers",
    icon: ShoppingBag,
    platforms: ["Instagram", "TikTok Shop"],
  },
  {
    id: "qualification",
    title: "Qualification Funnel",
    shortTitle: "Qualification",
    description: "Qualify prospects before sending them to sales.",
    useCase: "Ideal for agencies, consultants and B2B",
    icon: Filter,
    platforms: ["LinkedIn Ads", "Meta Ads"],
  },
  {
    id: "application",
    title: "Application Funnel",
    shortTitle: "Application",
    description: "Application-style funnel for high-intent prospects.",
    useCase: "Ideal for coaching, high-ticket offers and appointments",
    icon: ClipboardList,
    platforms: ["Facebook Ads", "Instagram"],
  },
];
