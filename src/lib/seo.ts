export const SITE_NAME = "QuizFlow AI";

export const SITE_URL =
  import.meta.env.VITE_SITE_URL?.replace(/\/$/, "") || "https://quizflow.ai";

export const DEFAULT_DESCRIPTION =
  "Build AI-powered quiz funnels for TikTok, Instagram, and Meta Ads. Generate high-converting interactive quizzes, edit questions and answers, and launch paid social campaigns in minutes.";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export const PAGE_META = {
  landing: {
    title: `${SITE_NAME} — AI Quiz Funnel Builder for Paid Social`,
    description: DEFAULT_DESCRIPTION,
    robots: "index, follow",
    ogType: "website",
  },
  login: {
    title: `Sign in | ${SITE_NAME}`,
    description: `Sign in to your ${SITE_NAME} workspace to build and manage AI quiz funnels.`,
    robots: "noindex, nofollow",
    ogType: "website",
  },
  signup: {
    title: `Create account | ${SITE_NAME}`,
    description: `Create your free ${SITE_NAME} account and start building AI quiz funnels for paid social.`,
    robots: "noindex, nofollow",
    ogType: "website",
  },
  dashboard: {
    title: `Dashboard | ${SITE_NAME}`,
    description: `Manage your AI quiz funnels, generate new quizzes, and track performance in ${SITE_NAME}.`,
    robots: "noindex, nofollow",
    ogType: "website",
  },
  builder: {
    title: `Quiz Builder | ${SITE_NAME}`,
    description: `Edit quiz questions, answers, and branching logic in the ${SITE_NAME} visual builder.`,
    robots: "noindex, nofollow",
    ogType: "website",
  },
  notFound: {
    title: `Page not found | ${SITE_NAME}`,
    description: "The page you are looking for does not exist.",
    robots: "noindex, nofollow",
    ogType: "website",
  },
} as const;

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
