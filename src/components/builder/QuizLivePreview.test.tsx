import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
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

  it("completes the quiz flow on the final question", async () => {
    const user = userEvent.setup();
    render(<QuizLivePreview quiz={quiz} />);

    await user.click(screen.getByRole("button", { name: "Option 1" }));
    await user.click(screen.getByRole("button", { name: "Continue to next question" }));

    await user.click(screen.getByRole("button", { name: "Option 1" }));
    await user.click(screen.getByRole("button", { name: "Continue to next question" }));

    expect(screen.getByText("Quiz complete")).toBeInTheDocument();
  });
});
