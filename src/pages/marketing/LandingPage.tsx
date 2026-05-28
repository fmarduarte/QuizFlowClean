import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";
import { FinalCTA } from "@/components/landing/FinalCTA";

/** Public landing — "/" */
export function LandingPage() {
  return (
    <main className="relative z-[1]">
      <Hero />
      <Features />
      <Pricing />
      <Testimonials />
      <FinalCTA />
    </main>
  );
}
