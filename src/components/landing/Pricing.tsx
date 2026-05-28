import { Check, Sparkles } from "lucide-react";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Test the product with one live funnel.",
    cta: "Start free",
    features: [
      "1 published funnel",
      "100 AI generations / mo",
      "Up to 500 leads / mo",
      "TikTok, Meta & Instagram export",
      "Community support",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "per month",
    desc: "For creators and indie brands shipping real ad campaigns.",
    cta: "Start 14-day trial",
    features: [
      "Unlimited funnels",
      "Unlimited AI generations",
      "10,000 leads / mo",
      "Pixel & UTM automation",
      "CRM integrations (Klaviyo, HubSpot)",
      "A/B testing & analytics",
      "Priority support",
    ],
    highlighted: true,
    badge: "Most popular",
  },
  {
    name: "Creator",
    price: "$199",
    period: "per month",
    desc: "For top creators and agencies managing multiple brands and offers.",
    cta: "Talk to sales",
    features: [
      "Everything in Pro",
      "Unlimited leads",
      "White-label workspaces",
      "Multi-brand seats",
      "Custom domains",
      "SLA & dedicated success",
    ],
    highlighted: false,
  },

];

export function Pricing() {
  return (
    <section id="pricing" className="py-32 bg-surface-subtle/40 border-y border-hairline">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Pricing</p>
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gradient leading-[1.1]">
            Start free. Scale when the leads start landing.
          </h2>
          <p className="mt-5 text-base text-muted-foreground">
            Transparent pricing. No setup fees. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-2xl border p-8 hover-lift flex flex-col ${
                t.highlighted
                  ? "border-foreground bg-foreground text-background shadow-hero"
                  : "border-hairline bg-background"
              }`}
            >
              {t.highlighted && (
                <>
                  <div className="absolute -inset-px rounded-2xl bg-accent-gradient opacity-25 blur-xl -z-10" />
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-background text-foreground text-[10px] font-medium border border-hairline">
                    <Sparkles className="h-3 w-3" />
                    {t.badge}
                  </div>
                </>
              )}

              <div>
                <h3 className="text-sm font-semibold tracking-tight uppercase tracking-wider">{t.name}</h3>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-5xl font-semibold tracking-tight">{t.price}</span>
                  <span className={`text-xs ${t.highlighted ? "text-background/60" : "text-muted-foreground"}`}>/ {t.period}</span>
                </div>
                <p className={`mt-3 text-sm leading-relaxed ${t.highlighted ? "text-background/70" : "text-muted-foreground"}`}>
                  {t.desc}
                </p>
              </div>

              <ul className="mt-8 space-y-3 flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className={`h-4 w-4 mt-0.5 flex-none ${t.highlighted ? "text-background" : "text-foreground"}`} strokeWidth={2.5} />
                    <span className={t.highlighted ? "text-background/90" : "text-foreground/80"}>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#cta"
                className={`mt-8 inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                  t.highlighted
                    ? "bg-background text-foreground hover:bg-background/90"
                    : "bg-foreground text-background hover:opacity-90"
                }`}
              >
                {t.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-10">
          All plans include unlimited team members, SSL, GDPR compliance, and 99.9% uptime SLA.
        </p>
      </div>
    </section>
  );
}
