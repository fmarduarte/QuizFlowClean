import { ArrowUpRight, Sparkles } from "lucide-react";

const templates = [
  {
    title: "Skincare Quiz Funnel",
    tag: "DTC · Beauty",
    cvr: "42%",
    questions: 5,
    preview: ["What's your skin type?", "Oily", "Dry", "Combination"],
    accent: "from-rose-200/40 to-amber-100/40",
  },
  {
    title: "Fitness Coaching Funnel",
    tag: "Coaching · Health",
    cvr: "37%",
    questions: 6,
    preview: ["Your primary goal?", "Lose fat", "Build muscle", "Stay consistent"],
    accent: "from-emerald-200/40 to-sky-100/40",
  },
  {
    title: "TikTok Shop Funnel",
    tag: "Affiliate · Social",
    cvr: "44%",
    questions: 4,
    preview: ["What are you shopping for?", "Beauty", "Home", "Tech"],
    accent: "from-fuchsia-200/40 to-violet-100/40",
  },
  {
    title: "Ecommerce Product Finder",
    tag: "DTC · Retail",
    cvr: "39%",
    questions: 5,
    preview: ["Pick your style", "Minimal", "Statement", "Classic"],
    accent: "from-indigo-200/40 to-cyan-100/40",
  },
  {
    title: "Lead Generation Funnel",
    tag: "Agency · B2B",
    cvr: "33%",
    questions: 5,
    preview: ["What's your team size?", "1–5", "6–25", "26+"],
    accent: "from-amber-200/40 to-rose-100/40",
  },
];

export function Templates() {
  return (
    <section id="templates" className="py-32 bg-surface-subtle/40 border-y border-hairline">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Templates</p>
            <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gradient leading-[1.1]">
              Start from a proven, high-converting funnel
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            Every template is benchmarked against real ad spend. Remix in seconds and launch the same day.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {templates.map((t) => (
            <article
              key={t.title}
              className="group relative rounded-2xl border border-hairline bg-background overflow-hidden hover-lift"
            >
              {/* Preview thumbnail */}
              <div className={`relative h-48 bg-gradient-to-br ${t.accent} border-b border-hairline overflow-hidden`}>
                <div className="absolute inset-0 dotted-grid opacity-30" />
                <div className="absolute left-6 top-6 right-6">
                  <div className="flex items-center gap-1.5 mb-3">
                    <Sparkles className="h-3 w-3" />
                    <span className="text-[10px] font-mono uppercase tracking-wider">{t.tag}</span>
                  </div>
                  <div className="rounded-xl bg-background/90 backdrop-blur border border-hairline shadow-card p-3">
                    <div className="text-[11px] text-muted-foreground mb-2">Question 1 of {t.questions}</div>
                    <div className="h-1 rounded-full bg-muted overflow-hidden mb-3">
                      <div className="h-full w-1/5 bg-foreground rounded-full" />
                    </div>
                    <div className="text-[12px] font-semibold mb-2">{t.preview[0]}</div>
                    <div className="space-y-1.5">
                      {t.preview.slice(1).map((opt, i) => (
                        <div
                          key={opt}
                          className={`text-[11px] px-2.5 py-1.5 rounded-md border ${i === 0 ? "border-foreground bg-foreground text-background" : "border-hairline"}`}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold tracking-tight">{t.title}</h3>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {t.questions} questions · Avg. CVR <span className="text-foreground font-medium">{t.cvr}</span>
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={`Preview ${t.title}`}
                  className="h-8 w-8 rounded-full border border-hairline flex items-center justify-center group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-colors"
                >
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}

          {/* Browse all */}
          <a
            href="#"
            className="group rounded-2xl border border-dashed border-hairline bg-background/40 flex flex-col items-center justify-center p-10 text-center hover:bg-surface-elevated hover:border-foreground/30 transition-colors min-h-[280px]"
          >
            <div className="h-11 w-11 rounded-xl border border-hairline flex items-center justify-center mb-4 group-hover:border-foreground transition-colors">
              <ArrowUpRight className="h-4 w-4" />
            </div>
            <div className="text-sm font-semibold tracking-tight">Browse 80+ templates</div>
            <p className="text-xs text-muted-foreground mt-2 max-w-[200px]">
              Sorted by vertical, channel, and benchmark conversion rate.
            </p>
          </a>
        </div>
      </div>
    </section>
  );
}
