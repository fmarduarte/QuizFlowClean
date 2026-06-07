import { Sparkles, ArrowRight } from "lucide-react";

export function AIGeneration() {
  return (
    <section className="py-32 bg-surface-subtle/40 border-y border-hairline">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div className="order-2 lg:order-1">
          <div className="relative rounded-2xl border border-hairline bg-surface-elevated shadow-hero p-6">
            <div className="absolute -inset-px rounded-2xl bg-accent-gradient opacity-20 blur-xl -z-10" />

            <div className="flex items-center gap-2 pb-4 border-b border-hairline">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">AI Composer</span>
              <span className="ml-auto text-[10px] font-mono text-muted-foreground">gpt-4o · streaming</span>
            </div>

            <div className="py-5 space-y-4">
              <div className="rounded-lg bg-surface-subtle border border-hairline p-3 text-sm">
                <span className="text-muted-foreground text-xs uppercase tracking-wider">Prompt</span>
                <p className="mt-1">A 5-question quiz to help busy moms find the right protein powder for their goals.</p>
              </div>

              <div className="space-y-2 font-mono text-xs">
                {[
                  { tag: "✓", text: "Identified 3 buyer personas" },
                  { tag: "✓", text: "Generated 5 questions with branching logic" },
                  { tag: "✓", text: "Wrote 12 personalized result variants" },
                  { tag: "→", text: "Generating ad-ready hook copy…" },
                ].map((line, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className={i === 3 ? "text-foreground" : "text-emerald-600"}>{line.tag}</span>
                    <span className="text-muted-foreground">{line.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                  <div className="h-full w-[88%] bg-accent-gradient animate-pulse-glow" />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">88%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">AI generation</p>
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gradient leading-[1.1]">
            One sentence in. A full funnel out.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Our model is trained on 50,000+ high-performing quiz funnels across DTC, education, fintech, and
            wellness. It writes questions, branches, results, and ad hooks that match your brand voice — and
            the buying psychology of paid social.
          </p>
          <a href="#cta" className="mt-8 inline-flex items-center gap-2 text-sm font-medium group">
            See sample outputs
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
