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
  quizReview: (id: string) => `/app/quiz/${id}/review`,
  quizPublish: (id: string) => `/app/quiz/${id}/publish`,
  quizShare: (id: string) => `/app/quiz/${id}/share`,
  quizResponses: (id: string) => `/app/quiz/${id}/responses`,
  publicQuiz: (id: string) => `/q/${id}`,
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
