import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section id="cta" className="py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative rounded-3xl border border-hairline bg-foreground text-background overflow-hidden p-12 sm:p-20 text-center shadow-hero">
          <div className="absolute inset-0 bg-accent-gradient opacity-30" />
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-[600px] bg-white/10 blur-3xl rounded-full" />
          <div className="absolute inset-0 dotted-grid opacity-[0.07]" />

          <div className="relative">
            <h2 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05] text-background">
              Launch Your First AI<br />Quiz Funnel Today
            </h2>
            <p className="mt-6 text-lg text-background/70 max-w-xl mx-auto">
              Build high-converting quiz funnels for paid social ads in minutes. Free to start. No credit card required.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-background/20 bg-background/5 text-xs text-background/80">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Onboarding 200+ new creators this week
            </div>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="#"
                className="group inline-flex items-center gap-2 bg-background text-foreground px-6 py-3.5 rounded-xl font-medium hover:bg-background/90 transition-all"
              >
                Generate Your First AI Funnel
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a href="#" className="text-sm text-background/70 hover:text-background transition-colors px-4 py-3.5">
                Talk to sales →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
