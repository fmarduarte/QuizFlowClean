import { Cpu, Megaphone, GitBranch, Target } from "lucide-react";
import { Reveal } from "./Reveal";

const pillars = [
  {
    icon: Cpu,
    title: "AI automation systems",
    desc: "Quiz generation, branching logic, and personalization powered by models tuned on real funnel data.",
  },
  {
    icon: Megaphone,
    title: "Paid media infrastructure",
    desc: "UTM-aware tracking, pixel events, and ad-ready exports for TikTok, Meta, and Instagram.",
  },
  {
    icon: GitBranch,
    title: "Scalable growth systems",
    desc: "Duplicate winners, run multivariate hooks, and ship dozens of funnel variants without engineering.",
  },
  {
    icon: Target,
    title: "Conversion-focused workflows",
    desc: "Every default — from question count to result pacing — is benchmarked against high-CVR funnels.",
  },
];

export function Trust() {
  return (
    <section className="py-32 relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-hairline to-transparent" />
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
              The platform underneath
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-gradient leading-[1.1]">
              An honest stack for modern growth teams
            </h2>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
              No black boxes. Just the systems modern marketing teams actually need — wired together,
              tuned for paid social, and ready on day one.
            </p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <div className="group relative h-full rounded-2xl border border-hairline bg-surface-elevated p-6 sm:p-8 hover-lift overflow-hidden">
                <div className="absolute inset-0 bg-accent-gradient opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500 pointer-events-none" />
                <div className="relative flex items-start gap-4 sm:gap-5">
                  <div className="h-11 w-11 shrink-0 rounded-xl border border-hairline bg-background flex items-center justify-center group-hover:border-foreground/40 transition-colors">
                    <p.icon className="h-4.5 w-4.5" strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold tracking-tight">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
