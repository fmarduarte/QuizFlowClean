export interface AnswerOption {
  id: string;
  label: string;
}

export interface Question {
  id: string;
  title: string;
  description?: string;
  options: AnswerOption[];
}

import type { FunnelBrief } from "@/types/funnel-brief";

export type FunnelStatus = "draft" | "published" | "archived";

export interface FunnelResultScreen {
  thankYouTitle: string;
  thankYouMessage: string;
  ctaLabel: string;
  ctaUrl: string;
}

export const DEFAULT_FUNNEL_RESULT: FunnelResultScreen = {
  thankYouTitle: "Thank you!",
  thankYouMessage: "Your answers have been submitted. We'll be in touch soon.",
  ctaLabel: "Continue",
  ctaUrl: "",
};

export interface PublishedQuizSnapshot {
  title: string;
  description?: string;
  questions: Question[];
  result: FunnelResultScreen;
}

/** Lead contact details captured from a respondent before completion. */
export interface QuizLeadInfo {
  email: string;
  name?: string;
}

export interface Quiz {
  id: string;
  supabaseId?: string;
  title: string;
  description?: string;
  questions: Question[];
  brief?: FunnelBrief;
  status: FunnelStatus;
  /** @deprecated Use status === "published" */
  published?: boolean;
  publishedAt?: string;
  publicSlug?: string;
  publishedSnapshot?: PublishedQuizSnapshot;
  result: FunnelResultScreen;
  createdAt: string;
  updatedAt: string;
}

export type QuizInput = Omit<Quiz, "id" | "createdAt" | "updatedAt">;

export const RESULT_EDITOR_ID = "__result__";

export const DEMO_QUIZ: QuizInput = {
  title: "Fitness Motivation Quiz",
  description: "Discover your fitness personality and get a personalized plan.",
  questions: [
    {
      id: "demo-q1",
      title: "What is your main fitness goal?",
      options: [
        { id: "demo-q1-a1", label: "Lose weight" },
        { id: "demo-q1-a2", label: "Build muscle" },
        { id: "demo-q1-a3", label: "Boost energy" },
      ],
    },
    {
      id: "demo-q2",
      title: "How often do you exercise?",
      options: [
        { id: "demo-q2-a1", label: "Rarely or never" },
        { id: "demo-q2-a2", label: "1–2 times per week" },
        { id: "demo-q2-a3", label: "3+ times per week" },
      ],
    },
    {
      id: "demo-q3",
      title: "What motivates you most?",
      options: [
        { id: "demo-q3-a1", label: "Looking better" },
        { id: "demo-q3-a2", label: "Feeling healthier" },
        { id: "demo-q3-a3", label: "Competing with myself" },
      ],
    },
  ],
  status: "draft",
  result: DEFAULT_FUNNEL_RESULT,
};
