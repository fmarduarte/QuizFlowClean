import { Brain, Flame, Share2, Smartphone, BarChart3, LayoutTemplate } from "lucide-react";

const features = [
  { icon: Brain, title: "AI Quiz Funnel Generator", desc: "Describe your product. Get a full funnel with branching logic and dynamic recommendations in seconds." },
  { icon: Flame, title: "Viral Hook Generator", desc: "AI-crafted opening questions tuned to stop the scroll on TikTok, Reels, and Stories." },
  { icon: Share2, title: "One-Click Ad Export", desc: "Push funnels live with TikTok, Meta, and Google pixels, UTMs, and CRM connections wired automatically." },
  { icon: Smartphone, title: "Mobile Optimized Funnels", desc: "Every funnel renders flawlessly inside TikTok and IG in-app browsers. No reflows, no friction." },
  { icon: BarChart3, title: "Real-Time Analytics", desc: "Live CVR, CPL, and drop-off insights built for performance marketers and UGC creators." },
  { icon: LayoutTemplate, title: "Creator Templates", desc: "Battle-tested quiz frameworks for DTC, info products, and creator offers — ready to customize." },
];


export function Features() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-surface-subtle/40 border-y border-hairline scroll-mt-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Features</p>
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gradient">
            Everything you need to turn ad clicks into qualified leads
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-hairline rounded-2xl overflow-hidden border border-hairline">
          {features.map((f) => (
            <div key={f.title} className="glass bg-background/50 p-8 hover:bg-surface-elevated/80 transition-colors group">
              <div className="h-10 w-10 rounded-lg border border-hairline flex items-center justify-center mb-5 group-hover:border-foreground transition-colors">
                <f.icon className="h-4 w-4" strokeWidth={2} />
              </div>
              <h3 className="text-base font-semibold tracking-tight mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
