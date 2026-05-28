import { MessageSquare, Wand2, Megaphone, Inbox } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: MessageSquare,
    title: "Describe your product",
    desc: "One sentence. No templates, no setup. Tell QuizFlowKit who it's for and what it sells.",
    sample: "“A skincare quiz for women 25–40 with sensitive skin.”",
  },
  {
    n: "02",
    icon: Wand2,
    title: "AI generates the funnel",
    desc: "Questions, branching, results, and ad-ready hooks — drafted in under 60 seconds.",
    sample: "5 questions · 12 result variants · 4 hook angles",
  },
  {
    n: "03",
    icon: Megaphone,
    title: "Launch ads",
    desc: "One-click export to TikTok, Meta, and Instagram. Pixels, UTMs, and creative ready.",
    sample: "TikTok Ads · Meta · Instagram",
  },
  {
    n: "04",
    icon: Inbox,
    title: "Capture leads",
    desc: "Qualified leads stream into your CRM with attribution, scores, and persona tags.",
    sample: "Shopify · Klaviyo · HubSpot · Webhooks",
  },
];

export function Workflow() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">AI workflow</p>
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gradient leading-[1.1]">
            From prompt to paid leads, in four steps
          </h2>
        </div>

        <div className="relative grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="hidden lg:block absolute top-14 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-hairline to-transparent" />
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="relative rounded-2xl border border-hairline bg-surface-elevated p-7 hover-lift group"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="relative h-11 w-11 rounded-xl bg-foreground flex items-center justify-center">
                  <s.icon className="h-4.5 w-4.5 text-background" strokeWidth={2} />
                  <div className="absolute inset-0 rounded-xl bg-accent-gradient opacity-0 group-hover:opacity-40 blur-md transition-opacity" />
                </div>
                <span className="text-[11px] font-mono text-muted-foreground">{s.n}</span>
              </div>
              <h3 className="text-base font-semibold tracking-tight mb-1.5">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              <div className="mt-5 pt-4 border-t border-hairline">
                <p className="text-[11px] font-mono text-muted-foreground/80 leading-relaxed">{s.sample}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
