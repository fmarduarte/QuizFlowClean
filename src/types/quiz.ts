export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: string[];
  createdAt: string;
}

export const DEMO_QUIZ = {
  title: "Fitness Motivation Quiz",
  questions: [
    "What is your main fitness goal?",
    "How often do you exercise?",
    "What motivates you most?",
  ],
};
