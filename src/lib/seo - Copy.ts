export const SITE_NAME = "QuizFlow AI";

export const SITE_URL =
  import.meta.env.VITE_SITE_URL?.replace(/\/$/, "") || "https://quizflow.ai";

export const DEFAULT_DESCRIPTION =
  "Generate high-converting quiz funnels with AI. Describe your business and let AI create quiz questions for lead qualification, product recommendations, and customer segmentation.";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export const PAGE_META = {
  landing: {
    title: `${SITE_NAME} — Generate High-Converting Quiz Funnels With AI`,
    description: DEFAULT_DESCRIPTION,
    robots: "index, follow",
    ogType: "website",
  },
  login: {
    title: `Sign in | ${SITE_NAME}`,
    description: `Sign in to your ${SITE_NAME} workspace to generate and manage AI quiz funnels.`,
    robots: "noindex, nofollow",
    ogType: "website",
  },
  signup: {
    title: `Create account | ${SITE_NAME}`,
    description: `Create your free ${SITE_NAME} account and start generating AI quiz funnels.`,
    robots: "noindex, nofollow",
    ogType: "website",
  },
  forgotPassword: {
    title: `Reset password | ${SITE_NAME}`,
    description: `Reset your ${SITE_NAME} account password.`,
    robots: "noindex, nofollow",
    ogType: "website",
  },
  resetPassword: {
    title: `Create new password | ${SITE_NAME}`,
    description: `Set a new password for your ${SITE_NAME} account.`,
    robots: "noindex, nofollow",
    ogType: "website",
  },
  dashboard: {
    title: `Workspace | ${SITE_NAME}`,
    description: `Create and manage AI quiz funnels in your ${SITE_NAME} workspace.`,
    robots: "noindex, nofollow",
    ogType: "website",
  },
  builder: {
    title: `Quiz Editor | ${SITE_NAME}`,
    description: `Edit AI-generated quiz questions, answers, and preview your quiz funnel in ${SITE_NAME}.`,
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
