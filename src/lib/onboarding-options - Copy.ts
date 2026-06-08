import type { FunnelBriefValues } from "@/lib/funnel-brief";

export interface OnboardingOption {
  id: string;
  label: string;
  description?: string;
}

export const ONBOARDING_QUIZ_TYPES: OnboardingOption[] = [
  {
    id: "lead_generation",
    label: "Lead Qualification Quiz",
    description: "Score answers and capture qualified leads",
  },
  {
    id: "sales",
    label: "Product Recommendation Quiz",
    description: "Match visitors to the right product or offer",
  },
  {
    id: "application",
    label: "Application Quiz",
    description: "Filter and qualify high-intent applicants",
  },
  {
    id: "webinar",
    label: "Assessment Quiz",
    description: "Segment audience with scored assessments",
  },
];

/** @deprecated Use ONBOARDING_QUIZ_TYPES */
export const ONBOARDING_FUNNEL_TYPES = ONBOARDING_QUIZ_TYPES;

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
  { id: "buy", label: "Recommend a product" },
  { id: "email", label: "Capture email leads" },
  { id: "call", label: "Book a call" },
  { id: "apply", label: "Submit an application" },
  { id: "register", label: "Register for an event" },
];

const QUIZ_TYPE_MAP: Record<string, string> = {
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
  buy: "Recommend the right product and drive purchases",
  email: "Capture qualified email leads",
  call: "Book qualified strategy calls",
  apply: "Collect qualified applications",
  register: "Drive event or webinar registrations",
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

export function resolveQuizTypeLabel(answers: OnboardingAnswers): string | null {
  return ONBOARDING_QUIZ_TYPES.find((t) => t.id === answers.funnelType)?.label ?? null;
}

/** @deprecated Use resolveQuizTypeLabel */
export const resolveFunnelTypeLabel = resolveQuizTypeLabel;

export function buildBriefFromOnboarding(answers: OnboardingAnswers): FunnelBriefValues {
  const product = resolveProductLabel(answers);
  const customer = resolveCustomerLabel(answers);
  const goal = resolveActionGoal(answers);
  const funnelType = answers.funnelType ? QUIZ_TYPE_MAP[answers.funnelType] ?? answers.funnelType : "";

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
    resolveQuizTypeLabel(answers),
    resolveProductLabel(answers) ? `Business: ${resolveProductLabel(answers)}` : null,
    resolveCustomerLabel(answers) ? `Audience: ${resolveCustomerLabel(answers)}` : null,
    resolveActionGoal(answers) ? `Quiz goal: ${resolveActionGoal(answers)}` : null,
    answers.details.trim() ? answers.details.trim() : null,
  ].filter(Boolean);

  return parts.join(". ");
}
