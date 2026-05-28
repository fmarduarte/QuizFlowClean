import { Reveal } from "./Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const faqs = [
  {
    q: "How does the AI work?",
    a: "Describe your product, audience, and goal in plain English. QuizFlowKit's AI drafts the full funnel — questions, branching logic, result variants, copy, and recommendations — in seconds. You can accept, regenerate, or edit any step.",
  },
  {
    q: "Can I export to TikTok Ads?",
    a: "Yes. Funnels are mobile-first by default and export with the TikTok Pixel, UTM parameters, and ad-ready preview links so you can plug them straight into TikTok Ads Manager.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. The Free plan includes 1 published funnel, 100 AI generations per month, and up to 500 leads — enough to test the product end-to-end before upgrading.",
  },
  {
    q: "Do I need design skills?",
    a: "No. Every funnel ships with a polished, mobile-first design out of the box. Fonts, colors, and layout are editable via a visual editor, and your brand kit is applied automatically.",
  },
  {
    q: "Can I use it for Meta Ads?",
    a: "Yes. QuizFlowKit exports with the Meta Pixel, Conversions API, and UTM tracking, so funnels plug directly into Facebook and Instagram Ads Manager.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-32">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Questions, answered
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-gradient leading-[1.1]">
              Everything you need to know before launching
            </h2>
          </div>
        </Reveal>

        <Reveal>
          <Accordion
            type="single"
            collapsible
            className="rounded-2xl border border-hairline bg-surface-elevated divide-y divide-[var(--hairline)] overflow-hidden"
          >
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`} className="border-0 px-6 sm:px-8">
                <AccordionTrigger className="text-left text-base sm:text-[17px] font-medium tracking-tight py-5 hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed pb-6">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
