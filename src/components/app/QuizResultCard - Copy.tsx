import { CheckCircle2, Sparkles } from "lucide-react";
import { FUNNEL_BRIEF_FIELDS } from "@/lib/funnel-brief";
import type { FunnelBrief } from "@/types/funnel-brief";
import type { Question } from "@/types/quiz";
import { cn } from "@/lib/utils";

interface QuizResultCardProps {
  title: string;
  questions: Question[];
  brief?: FunnelBrief;
  className?: string;
  footer?: React.ReactNode;
}

function BriefField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl glass px-4 py-3 space-y-1">
      <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground/90 leading-relaxed">{value}</p>
    </div>
  );
}

export function QuizResultCard({ title, questions, brief, className, footer }: QuizResultCardProps) {
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

      {brief && (
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Funnel brief</p>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
              <span>
                Quality: <span className="text-foreground/80">{brief.qualityLabel}</span> (
                {brief.qualityScore}%)
              </span>
              <span className="text-muted-foreground/40">·</span>
              <span>
                Language: <span className="text-foreground/80">{brief.detectedLanguageLabel}</span>
                {brief.languageMode === "translated" ? " (optimized)" : ""}
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <BriefField label="Funnel Type" value={brief.funnelTypeLabel} />
            <BriefField
              label={FUNNEL_BRIEF_FIELDS.businessNiche.label}
              value={brief.businessNiche}
            />
            <BriefField label={FUNNEL_BRIEF_FIELDS.productOffer.label} value={brief.productOffer} />
            <BriefField
              label={FUNNEL_BRIEF_FIELDS.targetAudience.label}
              value={brief.targetAudience}
            />
            <BriefField label={FUNNEL_BRIEF_FIELDS.goal.label} value={brief.goal} />
          </div>

          {brief.languageMode === "translated" && (
            <p className="text-xs text-muted-foreground/80 rounded-lg border border-hairline bg-background/30 px-3 py-2">
              Generated from an English-optimized brief. Original input was in{" "}
              {brief.detectedLanguageLabel}.
            </p>
          )}
        </div>
      )}

      <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-4">Questions</p>
      <ol className="space-y-3">
        {questions.map((q, i) => (
          <li
            key={q.id}
            className="rounded-xl glass px-4 py-3.5 text-sm animate-fade-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-start gap-3">
              <span className="flex-none h-6 w-6 rounded-lg bg-violet-500/20 text-violet-300 text-xs font-semibold flex items-center justify-center">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-foreground/90 leading-relaxed">{q.title}</p>
                {q.options.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {q.options.map((opt) => (
                      <li
                        key={opt.id}
                        className="text-xs text-muted-foreground pl-3 border-l border-hairline"
                      >
                        {opt.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>

      {footer && <div className="mt-6">{footer}</div>}
    </article>
  );
}
