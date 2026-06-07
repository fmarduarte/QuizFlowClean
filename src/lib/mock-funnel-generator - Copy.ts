import { createQuestion } from "@/lib/quiz-utils";
import type { FunnelBrief } from "@/types/funnel-brief";
import type { Question } from "@/types/quiz";

function clip(text: string, max = 48): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

function withOptions(title: string, labels: string[]): Question {
  const q = createQuestion(title);
  return {
    ...q,
    options: labels.map((label, i) => ({
      id: `${q.id}-opt-${i}`,
      label,
    })),
  };
}

/**
 * Dynamic mock generator — builds questions from the funnel brief.
 * Replace with OpenAI output when the server function is wired up.
 */
export function generateMockFunnelQuestions(brief: FunnelBrief): Question[] {
  const { businessNiche, productOffer, targetAudience, goal } = brief.generationValues;
  const niche = clip(businessNiche, 40);
  const offer = clip(productOffer, 44);
  const audience = clip(targetAudience, 52);
  const goalClip = clip(goal, 44);

  switch (brief.funnelType) {
    case "lead_generation":
      return [
        withOptions(`What interests you most about ${niche}?`, [
          `I'm exploring options in ${niche}`,
          `I have an active need related to ${offer}`,
          `I'm researching before I buy`,
          "Just curious for now",
        ]),
        withOptions(`How soon are you looking to take action?`, [
          "Ready this week",
          "Within the next 30 days",
          "In the next few months",
          "Not sure yet",
        ]),
        withOptions(`Which best describes you?`, [
          audience,
          `I match part of this audience: ${clip(targetAudience, 28)}`,
          "I'm deciding if this is for me",
          "Someone else recommended this",
        ]),
        withOptions(`What's your main goal with ${offer}?`, [
          goalClip,
          "Get more information first",
          "Compare options",
          "Speak with someone",
        ]),
      ];

    case "product_recommendation":
      return [
        withOptions(`What are you hoping to solve in ${niche}?`, [
          `Find the right fit for my needs`,
          `Upgrade from what I use today`,
          `Try something new in ${niche}`,
          "Gift or recommendation for someone else",
        ]),
        withOptions(`Which matters most when choosing ${offer}?`, [
          "Best value for money",
          "Premium quality",
          "Fastest results",
          "Expert recommendation",
        ]),
        withOptions(`How do you usually discover products like this?`, [
          "Paid social ads",
          "Creator or UGC content",
          "Friends and reviews",
          "Search and comparison",
        ]),
        withOptions(`Who is this recommendation for?`, [
          audience,
          "Primarily for me",
          "For my household or team",
          "Still exploring",
        ]),
      ];

    case "qualification":
      return [
        withOptions(`What best describes your role in ${niche}?`, [
          "Decision maker",
          "Influencer on the purchase",
          "Researching on behalf of others",
          "Individual contributor",
        ]),
        withOptions(`What budget range fits ${offer}?`, [
          "Ready to invest now",
          "Need approval first",
          "Exploring budget options",
          "Not budgeted yet",
        ]),
        withOptions(`How urgent is your goal: ${goalClip}?`, [
          "Immediate priority",
          "Active project this quarter",
          "Planning ahead",
          "Early research",
        ]),
        withOptions(`Does this audience profile fit you?`, [
          `Yes — ${audience}`,
          "Mostly, with a few differences",
          "Partially",
          "Not sure yet",
        ]),
      ];

    case "application":
      return [
        withOptions(`Why are you interested in ${offer}?`, [
          goalClip,
          `I want to advance in ${niche}`,
          "Referred by someone I trust",
          "Ready for a high-commitment next step",
        ]),
        withOptions(`How much experience do you have in ${niche}?`, [
          "Complete beginner",
          "Some experience",
          "Intermediate",
          "Advanced",
        ]),
        withOptions(`Can you commit the time required to reach your goal?`, [
          "Yes, fully committed",
          "Yes, with a clear schedule",
          "I need to confirm timing",
          "Still evaluating fit",
        ]),
        withOptions(`Which statement best describes you?`, [
          audience,
          "I'm motivated and ready to apply",
          "I have questions before applying",
          "I'm comparing programs",
        ]),
      ];

    default:
      return [
        withOptions(`What brought you to ${niche}?`, [
          `Interest in ${offer}`,
          audience,
          goalClip,
          "Discovered via paid social",
        ]),
        withOptions(`How familiar are you with this offer?`, [
          "First time hearing about it",
          "I've seen ads before",
          "I've researched similar offers",
          "I was referred here",
        ]),
        withOptions(`What outcome matters most to you?`, [
          goalClip,
          "Learn more before deciding",
          "Get a personalized recommendation",
          "Move to the next step",
        ]),
      ];
  }
}
