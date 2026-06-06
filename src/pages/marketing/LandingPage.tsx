import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { LandingJsonLd } from "@/components/seo/LandingJsonLd";
import { usePageMeta } from "@/hooks/use-page-meta";
import { PAGE_META } from "@/lib/seo";
import { ROUTES } from "@/lib/routes";

/** Public landing — "/" */
export function LandingPage() {
  usePageMeta({ ...PAGE_META.landing, canonical: ROUTES.landing });

  return (
    <>
      <LandingJsonLd />
      <main id="main-content" className="relative z-[1]">
        <Hero />
        <HowItWorks />
        <Features />
        <Pricing />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
    </>
  );
}
