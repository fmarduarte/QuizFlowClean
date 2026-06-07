import { Reveal } from "./Reveal";

const integrations = [
  "TikTok Ads",
  "Meta Ads",
  "Instagram",
  "Facebook",
  "Shopify",
  "Stripe",
  "Google Analytics",
];

export function Integrations() {
  return (
    <section className="py-24 sm:py-28 border-y border-hairline bg-surface-subtle/40">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Native integrations
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gradient leading-[1.1]">
              Plugs into the tools your funnel already runs on
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-px bg-hairline rounded-2xl overflow-hidden border border-hairline">
          {integrations.map((name, i) => (
            <Reveal key={name} delay={i * 40}>
              <div className="group relative bg-background h-24 flex items-center justify-center px-4 hover:bg-surface-elevated transition-colors">
                <span className="text-sm font-medium tracking-tight text-foreground/70 group-hover:text-foreground transition-colors">
                  {name}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
