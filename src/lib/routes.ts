/** Central route paths */
export const ROUTES = {
  landing: "/",
  login: "/login",
  signup: "/signup",
  app: "/app",
  quizEdit: (id: string) => `/app/quiz/${id}`,
  appSections: {
    overview: "#overview",
    generator: "#generator",
    saved: "#saved",
    settings: "#settings",
    billing: "#billing",
  },
  landingSections: {
    how: "/#how",
    features: "/#features",
    pricing: "/#pricing",
    testimonials: "/#testimonials",
    faq: "/#faq",
    cta: "/#cta",
  },
} as const;

export type AppSectionId = keyof typeof ROUTES.appSections;
