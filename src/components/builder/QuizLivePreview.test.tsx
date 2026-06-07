import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { QuizLivePreview } from "@/components/builder/QuizLivePreview";
import { createQuestion, createSeedQuiz } from "@/lib/quiz-utils";

describe("QuizLivePreview", () => {
  const quiz = createSeedQuiz("Test Funnel", "Preview test", [], "quiz-1");
  quiz.questions = [createQuestion("First question"), createQuestion("Second question")];

  it("shows Live Preview badge", () => {
    render(<QuizLivePreview quiz={quiz} />);
    expect(screen.getByText("Live Preview")).toBeInTheDocument();
  });

  it("does not highlight answers before user interaction", () => {
    render(<QuizLivePreview quiz={quiz} />);
    const options = screen.getAllByRole("button").filter((btn) => btn.textContent?.includes("Option"));
    for (const option of options) {
      expect(option.className).not.toContain("bg-accent-gradient");
    }
  });

  it("enables Continue only after answer selection and advances questions", async () => {
    const user = userEvent.setup();
    render(<QuizLivePreview quiz={quiz} />);

    const continueButton = screen.getByRole("button", { name: "Continue to next question" });
    expect(continueButton).toBeDisabled();

    const firstOption = screen.getByRole("button", { name: "Option 1" });
    await user.click(firstOption);
    expect(firstOption.className).toContain("bg-accent-gradient");
    expect(continueButton).toBeEnabled();

    await user.click(continueButton);
    expect(screen.getByText("Second question")).toBeInTheDocument();
  });

  it("shows Review Quiz on the final question and navigates to review", async () => {
    const user = userEvent.setup();
    const onReviewQuiz = vi.fn();
    render(<QuizLivePreview quiz={quiz} onReviewQuiz={onReviewQuiz} />);

    await user.click(screen.getByRole("button", { name: "Option 1" }));
    await user.click(screen.getByRole("button", { name: "Continue to next question" }));

    const reviewButton = screen.getByRole("button", { name: "Review quiz before publishing" });
    expect(reviewButton).toHaveTextContent("Review Quiz");

    await user.click(screen.getByRole("button", { name: "Option 1" }));
    await user.click(reviewButton);
    expect(onReviewQuiz).toHaveBeenCalledOnce();
  });

  it("shows lead capture after the final public question", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn().mockResolvedValue(undefined);
    render(<QuizLivePreview quiz={quiz} mode="public" onComplete={onComplete} />);

    await user.click(screen.getByRole("button", { name: "Option 1" }));
    await user.click(screen.getByRole("button", { name: "Continue to next question" }));

    await user.click(screen.getByRole("button", { name: "Option 1" }));
    await user.click(screen.getByRole("button", { name: "Continue to lead capture" }));

    expect(screen.getByText("Almost done!")).toBeInTheDocument();

    await user.type(screen.getByLabelText(/email/i), "lead@example.com");
    await user.click(screen.getByRole("button", { name: "Submit Lead" }));

    expect(onComplete).toHaveBeenCalledWith({
      answers: expect.any(Object),
      lead: { email: "lead@example.com", name: undefined },
    });
    expect(screen.getByText("Thanks for completing the quiz!")).toBeInTheDocument();
  });
});
