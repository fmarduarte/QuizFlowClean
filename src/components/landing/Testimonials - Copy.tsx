import { Reveal } from "./Reveal";

const testimonials = [
  {
    quote:
      "We replaced our landing page with a QuizFlow AI funnel and CPL on TikTok dropped almost in half. Same creative, better conversion.",
    name: "Maya Okafor",
    role: "UGC Creator · 480K followers",
  },
  {
    quote:
      "I ship 5–10 funnel variants a week for clients now. The AI gets us 80% there and the editor handles the rest.",
    name: "Daniel Brandt",
    role: "Senior Media Buyer, Northwind",
  },
  {
    quote:
      "Quizzes feel native on TikTok Shop. My affiliate links convert better when there's a personality test before the offer.",
    name: "Priya Shah",
    role: "TikTok Shop Affiliate",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 sm:py-32 relative section-divider scroll-mt-20">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
              From operators, not influencers
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-gradient leading-[1.1]">
              Built with the people running paid social every day
            </h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
              <figure className="glass group relative h-full rounded-2xl p-8 hover-lift overflow-hidden">
                <div className="absolute inset-0 bg-accent-gradient opacity-0 group-hover:opacity-[0.05] transition-opacity duration-500 pointer-events-none" />
                <blockquote className="relative text-[15px] leading-relaxed text-foreground/90">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="relative mt-6 pt-6 border-t border-hairline">
                  <div className="text-sm font-medium tracking-tight">{t.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{t.role}</div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
