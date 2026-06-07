/** Central route paths */
export const ROUTES = {
  landing: "/",
  login: "/login",
  signup: "/signup",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  app: "/app",
  appCreate: "/app/create",
  appFunnels: "/app/funnels",
  appSettings: "/app/settings",
  appBilling: "/app/billing",
  appCreateWithType: (type: string) => `/app/create?type=${encodeURIComponent(type)}`,
  quizEdit: (id: string) => `/app/quiz/${id}`,
  funnelResponses: (id: string) => `/app/funnel/${encodeURIComponent(id)}/responses`,
  quizPublic: (slug: string) => `/quiz/public/${encodeURIComponent(slug)}`,
  landingSections: {
    how: "/#how",
    features: "/#features",
    pricing: "/#pricing",
    testimonials: "/#testimonials",
    faq: "/#faq",
    cta: "/#cta",
  },
} as const;

export type AppNavId = "create" | "funnels" | "settings" | "billing";
