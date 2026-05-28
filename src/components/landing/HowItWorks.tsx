import { MessageSquare, Wand2, Rocket } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: MessageSquare,
    title: "Generate Your Quiz Funnel",
    desc: "Describe your product in one sentence. AI drafts questions, branching logic, and result pages instantly.",
  },
  {
    n: "02",
    icon: Wand2,
    title: "Customize with AI",
    desc: "Refine copy, tweak design, regenerate hooks, and tune branching — all inside a visual editor.",
  },
  {
    n: "03",
    icon: Rocket,
    title: "Export to Paid Ads",
    desc: "One-click export to TikTok, Meta, and Google Ads with pixels, UTMs, and CRM connections wired in.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">How it works</p>
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gradient">
            From idea to live funnel in three steps
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-12 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-transparent via-hairline to-transparent" />
          {steps.map((step) => (
            <div key={step.n} className="relative group">
              <div className="rounded-2xl border border-hairline bg-surface-elevated p-8 h-full hover:shadow-card transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <div className="h-12 w-12 rounded-xl bg-foreground flex items-center justify-center">
                    <step.icon className="h-5 w-5 text-background" strokeWidth={2} />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">{step.n}</span>
                </div>
                <h3 className="text-xl font-semibold tracking-tight mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
