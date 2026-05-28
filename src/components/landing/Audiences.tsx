import { Camera, LineChart, ShoppingBag, Store, Building2 } from "lucide-react";

const audiences = [
  {
    icon: Camera,
    title: "UGC creators",
    desc: "Turn your best-performing hook into a lead-capturing quiz in one prompt.",
  },
  {
    icon: LineChart,
    title: "Media buyers",
    desc: "Replace static landers with interactive funnels and lift ROAS without new creative.",
  },
  {
    icon: ShoppingBag,
    title: "TikTok Shop affiliates",
    desc: "Match shoppers to products with quiz-driven recommendations and affiliate links.",
  },
  {
    icon: Store,
    title: "Ecommerce brands",
    desc: "Capture zero-party data and personalize the post-click experience at scale.",
  },
  {
    icon: Building2,
    title: "Agencies",
    desc: "Ship client funnels in hours, not weeks — under a white-label workspace.",
  },
];

export function Audiences() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Built for modern marketers</p>
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gradient leading-[1.1]">
            One platform. Every kind of paid-social operator.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {audiences.map((a, i) => (
            <div
              key={a.title}
              className={`group relative rounded-2xl border border-hairline bg-surface-elevated p-7 hover-lift ${
                i === 4 ? "lg:col-start-2" : ""
              }`}
            >
              <div className="absolute inset-0 rounded-2xl bg-accent-gradient opacity-0 group-hover:opacity-[0.06] transition-opacity pointer-events-none" />
              <div className="relative">
                <div className="h-10 w-10 rounded-xl border border-hairline flex items-center justify-center mb-5 group-hover:border-foreground transition-colors">
                  <a.icon className="h-4 w-4" strokeWidth={2} />
                </div>
                <h3 className="text-base font-semibold tracking-tight mb-2">{a.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
