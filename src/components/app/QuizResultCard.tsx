import { CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizResultCardProps {
  title: string;
  questions: string[];
  className?: string;
  footer?: React.ReactNode;
}

export function QuizResultCard({ title, questions, className, footer }: QuizResultCardProps) {
  return (
    <article
      className={cn(
        "relative glass-strong rounded-2xl p-6 sm:p-8 shadow-elevated border border-violet-500/20 animate-fade-up",
        className
      )}
      aria-live="polite"
    >
      <div
        aria-hidden
        className="absolute -inset-px rounded-2xl bg-accent-gradient opacity-15 blur-2xl -z-10 pointer-events-none"
      />

      <div className="flex items-start gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-accent-gradient flex items-center justify-center flex-none shadow-glow">
          <CheckCircle2 className="h-5 w-5 text-white" strokeWidth={2.5} />
        </div>
        <div className="text-left min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 mb-2">
            <Sparkles className="h-3 w-3" />
            Generated successfully
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold tracking-tight">{title}</h3>
        </div>
      </div>

      <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-4">Questions</p>
      <ol className="space-y-3">
        {questions.map((q, i) => (
          <li
            key={q}
            className="flex items-start gap-3 rounded-xl glass px-4 py-3.5 text-sm animate-fade-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <span className="flex-none h-6 w-6 rounded-lg bg-violet-500/20 text-violet-300 text-xs font-semibold flex items-center justify-center">
              {i + 1}
            </span>
            <span className="text-foreground/90 leading-relaxed pt-0.5">{q}</span>
          </li>
        ))}
      </ol>

      {footer && <div className="mt-6">{footer}</div>}
    </article>
  );
}
