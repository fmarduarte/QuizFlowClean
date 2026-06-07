import { Check, Sparkles } from "lucide-react";
import { Reveal } from "./Reveal";

const questions = [
  { label: "What's your main goal?", options: ["Lose weight", "Build muscle", "More energy"] },
  { label: "How active are you?", options: ["Sedentary", "3× / week", "Daily athlete"] },
];

export function QuizPreview() {
  return (
    <section id="preview" className="py-24 sm:py-32 relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[700px] rounded-full blur-[100px] glow-orb opacity-40"
        style={{ background: "var(--gradient-glow)" }}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Live preview
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-gradient leading-[1.1] text-balance">
              See the AI-generated quiz your audience gets
            </h2>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Branching logic, personalized results, and mobile-native layouts — generated in under a minute.
            </p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <Reveal className="order-2 lg:order-1">
            <div className="glass-strong rounded-2xl p-6 sm:p-8 shadow-elevated hover-lift">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 rounded-lg bg-accent-gradient flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-tight">Protein Match Quiz</p>
                  <p className="text-xs text-muted-foreground">Generated · 47 seconds</p>
                </div>
                <span className="ml-auto text-[10px] font-medium px-2 py-1 rounded-full border border-hairline bg-surface-subtle text-emerald-400">
                  Live
                </span>
              </div>

              {questions.map((q, qi) => (
                <div key={q.label} className={qi > 0 ? "mt-6 pt-6 border-t border-hairline" : ""}>
                  <p className="text-sm font-medium mb-3">{q.label}</p>
                  <div className="space-y-2">
                    {q.options.map((opt, oi) => (
                      <div
                        key={opt}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${
                          qi === 0 && oi === 0
                            ? "glass border-violet-500/40 bg-violet-500/10"
                            : "glass hover:bg-surface-subtle/80"
                        }`}
                      >
                        <span
                          className={`h-4 w-4 rounded-full border flex items-center justify-center flex-none ${
                            qi === 0 && oi === 0 ? "border-violet-400 bg-violet-500" : "border-hairline"
                          }`}
                        >
                          {qi === 0 && oi === 0 && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                        </span>
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="mt-6 flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full w-2/5 bg-accent-gradient rounded-full" />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">2 of 5</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120} className="order-1 lg:order-2 flex justify-center">
            <div className="relative w-full max-w-[320px] sm:max-w-[340px]">
              <div className="absolute -inset-8 bg-accent-gradient opacity-25 blur-3xl rounded-full glow-orb pointer-events-none" />

              <div className="relative rounded-[2.5rem] border-2 border-hairline bg-surface-elevated p-3 shadow-hero">
                <div className="rounded-[2rem] overflow-hidden border border-hairline bg-background">
                  <div className="px-5 pt-3 pb-2 flex justify-center">
                    <div className="h-1 w-16 rounded-full bg-muted" />
                  </div>

                  <div className="px-5 pb-6 pt-2 min-h-[420px] flex flex-col">
                    <div className="inline-flex self-start items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium bg-violet-500/15 text-violet-300 border border-violet-500/25 mb-4">
                      <Sparkles className="h-3 w-3" />
                      AI Generated
                    </div>

                    <h3 className="text-lg font-semibold tracking-tight leading-snug mb-1">
                      What's your #1 fitness goal right now?
                    </h3>
                    <p className="text-xs text-muted-foreground mb-5">Question 1 of 5</p>

                    <div className="space-y-2.5 flex-1">
                      {["Lose weight", "Build lean muscle", "Boost daily energy"].map((opt, i) => (
                        <button
                          key={opt}
                          type="button"
                          className={`w-full text-left rounded-xl px-4 py-3.5 text-sm font-medium transition-all ${
                            i === 0
                              ? "bg-accent-gradient text-white shadow-glow scale-[1.02]"
                              : "glass hover:border-foreground/20"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="mt-5 w-full py-3.5 rounded-xl text-sm font-semibold btn-glow btn-shimmer text-white shadow-glow"
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
