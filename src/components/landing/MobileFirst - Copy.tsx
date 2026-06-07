import { Check } from "lucide-react";

export function MobileFirst() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Mobile-first</p>
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gradient leading-[1.1]">
            Designed for the way your audience actually scrolls
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Your funnel opens inside TikTok, Instagram, and Facebook in-app browsers. We obsess over the
            details so your conversion rate doesn't drop on tap one.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              "Native gesture interactions and snappy transitions",
              "Sub-second load times on 3G mobile networks",
              "Auto-adapts to safe areas, notches, and dynamic islands",
              "WCAG-compliant contrast and tap targets",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <div className="h-5 w-5 rounded-full bg-foreground flex items-center justify-center mt-0.5 shrink-0">
                  <Check className="h-3 w-3 text-background" strokeWidth={3} />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex justify-center">
          <div className="absolute inset-0 bg-accent-gradient opacity-20 blur-3xl rounded-full" />
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="relative w-[240px] h-[480px] rounded-[36px] border-[8px] border-foreground bg-background shadow-hero overflow-hidden -mx-6"
              style={{
                transform: `translateY(${i === 1 ? -20 : 0}px) rotate(${(i - 1) * 4}deg)`,
                zIndex: i === 1 ? 10 : 1,
              }}
            >
              <div className="absolute top-2 left-1/2 -translate-x-1/2 h-1.5 w-16 rounded-full bg-foreground/20" />
              <div className="p-5 pt-9 space-y-3">
                <div className="text-[10px] text-muted-foreground">Question {i + 1} of 5</div>
                <div className="h-1 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-accent-gradient" style={{ width: `${(i + 1) * 20}%` }} />
                </div>
                <div className="text-base font-semibold leading-tight mt-4">
                  {["What's your skin type?", "Pick your main concern", "How often do you shop online?"][i]}
                </div>
                <div className="space-y-2 mt-3">
                  {["Option A", "Option B", "Option C", "Option D"].map((o, j) => (
                    <div
                      key={o}
                      className={`p-3 rounded-xl border text-xs ${j === i ? "bg-foreground text-background border-foreground" : "border-hairline"}`}
                    >
                      {o}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
