import type { FunnelBriefValues } from "@/lib/funnel-brief";

export interface OnboardingOption {
  id: string;
  label: string;
  description?: string;
}

export const ONBOARDING_FUNNEL_TYPES: OnboardingOption[] = [
  { id: "lead_generation", label: "Lead Generation Funnel", description: "Capture emails before your offer" },
  { id: "sales", label: "Sales Funnel", description: "Guide buyers to purchase" },
  { id: "application", label: "Application Funnel", description: "Qualify high-intent prospects" },
  { id: "webinar", label: "Webinar Funnel", description: "Drive registrations and attendance" },
];

export const ONBOARDING_PRODUCT_TYPES: OnboardingOption[] = [
  { id: "saas", label: "SaaS" },
  { id: "course", label: "Course" },
  { id: "agency", label: "Agency Service" },
  { id: "consulting", label: "Consulting" },
  { id: "physical", label: "Physical Product" },
  { id: "mobile_app", label: "Mobile App" },
  { id: "other", label: "Other" },
];

export const ONBOARDING_CUSTOMER_TYPES: OnboardingOption[] = [
  { id: "creators", label: "Creators" },
  { id: "affiliates", label: "Affiliate Marketers" },
  { id: "coaches", label: "Coaches" },
  { id: "local_business", label: "Local Businesses" },
  { id: "ecommerce", label: "Ecommerce Stores" },
  { id: "agencies", label: "Agencies" },
  { id: "other", label: "Other" },
];

export const ONBOARDING_ACTIONS: OnboardingOption[] = [
  { id: "buy", label: "Buy" },
  { id: "email", label: "Leave Email" },
  { id: "call", label: "Book a Call" },
  { id: "apply", label: "Apply" },
  { id: "register", label: "Register" },
];

/** Maps onboarding funnel ids to internal engine funnel type ids. */
const FUNNEL_TYPE_MAP: Record<string, string> = {
  lead_generation: "lead_generation",
  sales: "product_recommendation",
  application: "application",
  webinar: "qualification",
};

const PRODUCT_LABELS: Record<string, string> = {
  saas: "SaaS",
  course: "Online course",
  agency: "Agency service",
  consulting: "Consulting offer",
  physical: "Physical product",
  mobile_app: "Mobile app",
};

const CUSTOMER_LABELS: Record<string, string> = {
  creators: "Creators",
  affiliates: "Affiliate marketers",
  coaches: "Coaches",
  local_business: "Local businesses",
  ecommerce: "Ecommerce stores",
  agencies: "Agencies",
};

const ACTION_GOALS: Record<string, string> = {
  buy: "Drive purchases and increase sales",
  email: "Capture email leads",
  call: "Book qualified strategy calls",
  apply: "Collect qualified applications",
  register: "Drive webinar or event registrations",
};

export interface OnboardingAnswers {
  funnelType: string | null;
  productType: string | null;
  productOther: string;
  customerType: string | null;
  customerOther: string;
  action: string | null;
  details: string;
}

export const EMPTY_ONBOARDING: OnboardingAnswers = {
  funnelType: null,
  productType: null,
  productOther: "",
  customerType: null,
  customerOther: "",
  action: null,
  details: "",
};

export function resolveProductLabel(answers: OnboardingAnswers): string | null {
  if (!answers.productType) return null;
  if (answers.productType === "other") {
    const trimmed = answers.productOther.trim();
    return trimmed || null;
  }
  return PRODUCT_LABELS[answers.productType] ?? null;
}

export function resolveCustomerLabel(answers: OnboardingAnswers): string | null {
  if (!answers.customerType) return null;
  if (answers.customerType === "other") {
    const trimmed = answers.customerOther.trim();
    return trimmed || null;
  }
  return CUSTOMER_LABELS[answers.customerType] ?? null;
}

export function resolveActionGoal(answers: OnboardingAnswers): string | null {
  if (!answers.action) return null;
  return ACTION_GOALS[answers.action] ?? null;
}

export function resolveFunnelTypeLabel(answers: OnboardingAnswers): string | null {
  return ONBOARDING_FUNNEL_TYPES.find((t) => t.id === answers.funnelType)?.label ?? null;
}

export function buildBriefFromOnboarding(answers: OnboardingAnswers): FunnelBriefValues {
  const product = resolveProductLabel(answers);
  const customer = resolveCustomerLabel(answers);
  const goal = resolveActionGoal(answers);
  const funnelType = answers.funnelType ? FUNNEL_TYPE_MAP[answers.funnelType] ?? answers.funnelType : "";

  const details = answers.details.trim();
  const productOffer = details
    ? `${product ?? "Offer"} — ${details}`
    : product ?? "";

  return {
    funnelType,
    businessNiche: product ?? "",
    productOffer,
    targetAudience: customer ?? "",
    goal: goal ?? "",
  };
}

export function buildOnboardingNarrative(answers: OnboardingAnswers): string {
  const parts = [
    resolveFunnelTypeLabel(answers),
    resolveProductLabel(answers) ? `Selling: ${resolveProductLabel(answers)}` : null,
    resolveCustomerLabel(answers) ? `Audience: ${resolveCustomerLabel(answers)}` : null,
    resolveActionGoal(answers) ? `Goal: ${resolveActionGoal(answers)}` : null,
    answers.details.trim() ? answers.details.trim() : null,
  ].filter(Boolean);

  return parts.join(". ");
}
