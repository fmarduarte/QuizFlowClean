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

export type QuizStatus = "draft" | "published" | "archived";

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  brief?: FunnelBrief;
  status?: QuizStatus;
  /** @deprecated Prefer `status`. Kept for migration. */
  published?: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type QuizInput = Omit<Quiz, "id" | "createdAt" | "updatedAt">;

export interface QuizLeadInfo {
  email: string;
  name?: string;
}

export interface QuizSubmission {
  answers: Record<string, string>;
  lead: QuizLeadInfo;
}

export interface QuizResponse {
  id: string;
  quizId: string;
  answers: Record<string, string>;
  leadEmail?: string;
  leadName?: string;
  completedAt: string;
}

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
};
