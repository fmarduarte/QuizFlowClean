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

export const FUNNEL_TYPES: FunnelTypeDefinition[] = [
  {
    id: "lead_generation",
    title: "Lead Qualification Quiz",
    shortTitle: "Lead Qualification",
    description: "Score answers and capture qualified leads with a quiz.",
    useCase: "Optimized for Facebook and TikTok Ads",
    icon: Users,
    platforms: ["Meta Ads", "TikTok Ads"],
  },
  {
    id: "product_recommendation",
    title: "Product Recommendation Quiz",
    shortTitle: "Product Recommendation",
    description: "Match visitors to the right product based on their answers.",
    useCase: "Ideal for ecommerce and affiliate offers",
    icon: ShoppingBag,
    platforms: ["Instagram", "TikTok Shop"],
  },
  {
    id: "qualification",
    title: "Assessment Quiz",
    shortTitle: "Assessment",
    description: "Segment and qualify prospects with scored assessments.",
    useCase: "Ideal for agencies, consultants and B2B",
    icon: Filter,
    platforms: ["LinkedIn Ads", "Meta Ads"],
  },
  {
    id: "application",
    title: "Application Quiz",
    shortTitle: "Application",
    description: "Filter high-intent applicants before they reach your team.",
    useCase: "Ideal for coaching, high-ticket offers and appointments",
    icon: ClipboardList,
    platforms: ["Facebook Ads", "Instagram"],
  },
];
