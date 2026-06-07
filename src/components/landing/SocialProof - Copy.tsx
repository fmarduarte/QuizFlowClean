import { Reveal } from "./Reveal";

const logos = [
  "Nova Labs", "Mercury", "Loomly", "Splice", "Pillar", "Northwind", "Vantage", "Halo",
];

const metrics = [
  { value: "12,000+", label: "Creators & brands shipping funnels" },
  { value: "2.4M", label: "Leads captured in the last 90 days" },
  { value: "+58%", label: "Avg lift in opt-in rate vs. landing pages" },
  { value: "94%", label: "Of funnels launched in under 10 minutes" },
];

export function SocialProof() {
  return (
    <section className="py-20 border-y border-hairline bg-surface-subtle/40">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground mb-10">
          Trusted by creators and performance marketers
        </p>

        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="flex gap-16 animate-marquee whitespace-nowrap w-max">
            {[...logos, ...logos].map((logo, i) => (
              <span key={i} className="text-xl font-semibold tracking-tight text-muted-foreground/70">
                {logo}
              </span>
            ))}
          </div>
        </div>

        <Reveal>
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-px bg-hairline rounded-2xl overflow-hidden border border-hairline">
            {metrics.map((m) => (
              <div key={m.label} className="bg-background p-6 sm:p-8 text-center">
                <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-gradient">
                  {m.value}
                </div>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
