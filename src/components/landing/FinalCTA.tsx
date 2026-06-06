import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { signupLink } from "@/lib/auth-redirect";
import { PRODUCT_COPY } from "@/lib/product-copy";
import { ROUTES } from "@/lib/routes";

export function FinalCTA() {
  const { isAuthenticated, loading } = useAuth();

  const ctaTo = isAuthenticated
    ? ROUTES.app
    : signupLink(ROUTES.app);

  return (
    <section id="cta" className="py-24 sm:py-32 scroll-mt-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative rounded-3xl border border-hairline bg-foreground text-background overflow-hidden p-12 sm:p-20 text-center shadow-hero">
          <div className="absolute inset-0 bg-accent-gradient opacity-30" />
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-[600px] bg-white/10 blur-3xl rounded-full" />
          <div className="absolute inset-0 dotted-grid opacity-[0.07]" />

          <div className="relative">
            <h2 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05] text-background">
              Launch Your First AI<br />Funnel Today
            </h2>
            <p className="mt-6 text-lg text-background/70 max-w-xl mx-auto">
              Build high-converting funnels for TikTok, Facebook and Instagram Ads in minutes. Free
              to start. No credit card required.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-background/20 bg-background/5 text-xs text-background/80">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Onboarding 200+ new creators this week
            </div>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              {!loading && (
                <Link
                  to={ctaTo}
                  className="btn-glow btn-shimmer group inline-flex items-center gap-2 bg-background text-foreground px-6 py-3.5 rounded-xl font-medium hover:bg-background/90 hover:-translate-y-0.5 transition-all shadow-elevated"
                >
                  {isAuthenticated ? PRODUCT_COPY.funnel.create : "Get started free"}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              )}
              <a
                href={ROUTES.landingSections.pricing}
                className="text-sm text-background/70 hover:text-background transition-colors px-4 py-3.5"
              >
                View pricing →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
