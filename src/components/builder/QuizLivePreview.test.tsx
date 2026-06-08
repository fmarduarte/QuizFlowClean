import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { QuizLivePreview } from "@/components/builder/QuizLivePreview";
import { QuizPlayer } from "@/components/quiz/QuizPlayer";
import { createQuestion, createSeedQuiz } from "@/lib/quiz-utils";

function buildQuiz() {
  const quiz = createSeedQuiz("Test Funnel", "Preview test", [], "quiz-1");
  quiz.questions = [createQuestion("First question"), createQuestion("Second question")];
  return quiz;
}

describe("QuizLivePreview", () => {
  it("shows Live Preview badge", () => {
    render(<QuizLivePreview quiz={buildQuiz()} />);
    expect(screen.getByText("Live Preview")).toBeInTheDocument();
  });

  it("does not highlight answers before user interaction", () => {
    render(<QuizLivePreview quiz={buildQuiz()} />);
    const options = screen.getAllByRole("button").filter((btn) => btn.textContent?.includes("Option"));
    for (const option of options) {
      expect(option.className).not.toContain("bg-accent-gradient");
    }
  });

  it("enables Continue only after answer selection and advances questions", async () => {
    const user = userEvent.setup();
    render(<QuizLivePreview quiz={buildQuiz()} />);

    const continueButton = screen.getByRole("button", { name: "Continue to next question" });
    expect(continueButton).toBeDisabled();

    const firstOption = screen.getByRole("button", { name: "Option 1" });
    await user.click(firstOption);
    expect(firstOption.className).toContain("bg-accent-gradient");
    expect(continueButton).toBeEnabled();

    await user.click(continueButton);
    expect(screen.getByText("Second question")).toBeInTheDocument();
  });
});

describe("QuizPlayer lead capture", () => {
  it("collects a lead before completing when collectLead is set", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    const quiz = buildQuiz();
    render(<QuizPlayer quiz={quiz} collectLead onComplete={onComplete} showRestart={false} />);

    // Answer question 1, advance.
    await user.click(screen.getByRole("button", { name: "Option 1" }));
    await user.click(screen.getByRole("button", { name: "Continue to next question" }));

    // Answer question 2, advance -> lead form (not complete yet).
    await user.click(screen.getByRole("button", { name: "Option 1" }));
    await user.click(screen.getByRole("button", { name: "Continue to next question" }));

    expect(screen.getByText("Almost done!")).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    await user.type(screen.getByLabelText(/email/i), "lead@example.com");
    await user.click(screen.getByRole("button", { name: "Submit Lead" }));

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete.mock.calls[0][0]).toMatchObject({
      lead: { email: "lead@example.com" },
    });
  });
});
