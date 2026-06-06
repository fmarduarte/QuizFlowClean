import { describe, expect, it } from "vitest";
import { buildAIQuizUnderstanding } from "@/lib/ai-quiz-understanding";
import { EMPTY_ONBOARDING } from "@/lib/onboarding-options";

describe("buildAIQuizUnderstanding", () => {
  it("builds a complete understanding summary from onboarding answers", () => {
    const result = buildAIQuizUnderstanding({
      ...EMPTY_ONBOARDING,
      funnelType: "sales",
      productType: "saas",
      customerType: "creators",
      action: "email",
      details: "AI Hook Generator",
    });

    expect(result.business).toContain("SaaS");
    expect(result.audience).toBe("Creators");
    expect(result.recommendedQuizType).toBe("Product Recommendation Quiz");
    expect(result.estimatedQuestions).toBeGreaterThan(0);
    expect(result.canGenerate).toBe(true);
  });
});
