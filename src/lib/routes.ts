/** Central route paths */
export const ROUTES = {
  landing: "/",
  app: "/app",
  appSections: {
    overview: "#overview",
    generator: "#generator",
    saved: "#saved",
    settings: "#settings",
    billing: "#billing",
  },
  landingSections: {
    features: "/#features",
    pricing: "/#pricing",
    testimonials: "/#testimonials",
    cta: "/#cta",
  },
} as const;

export type AppSectionId = keyof typeof ROUTES.appSections;
