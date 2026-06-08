import { useState } from "react";
import { Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { QuizLeadInfo } from "@/types/quiz";

interface QuizLeadCaptureFormProps {
  onSubmit: (lead: QuizLeadInfo) => void;
  submitting?: boolean;
}

export function QuizLeadCaptureForm({ onSubmit, submitting }: QuizLeadCaptureFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setError("Enter a valid email address to get your results.");
      return;
    }
    setError(null);
    onSubmit({ email: trimmed, name: name.trim() || undefined });
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4 py-4">
      <div>
        <h3 className="text-base font-semibold tracking-tight">Almost done!</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Enter your details to submit your answers and receive your results.
        </p>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <label htmlFor="lead-email" className="text-xs font-medium text-muted-foreground">
            Email <span className="text-amber-300">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="lead-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="pl-9 rounded-xl border-hairline bg-surface-subtle/40"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="lead-name" className="text-xs font-medium text-muted-foreground">
            Name (optional)
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="lead-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="pl-9 rounded-xl border-hairline bg-surface-subtle/40"
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="text-xs text-amber-300" role="alert">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={submitting}
        className="mt-auto w-full py-3 rounded-xl btn-glow btn-shimmer text-white shadow-glow"
      >
        {submitting ? "Submitting…" : "Submit Lead"}
      </Button>
    </form>
  );
}
