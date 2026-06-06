import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { signupLink } from "@/lib/auth-redirect";
import { FUNNEL_TYPES } from "@/lib/funnel-types";
import { PRODUCT_COPY } from "@/lib/product-copy";
import { ROUTES } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FunnelTypePicker() {
  const { isAuthenticated, loading } = useAuth();
  const redirect = `${ROUTES.app}${ROUTES.appSections.generator}`;

  const ctaTo = isAuthenticated
    ? { pathname: ROUTES.app, hash: ROUTES.appSections.generator }
    : signupLink(redirect);

  return (
    <div className="w-full max-w-4xl mx-auto text-left">
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
          {PRODUCT_COPY.hero.funnelPickerHeading}
        </h2>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
          {PRODUCT_COPY.hero.funnelPickerSubhead}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
        {FUNNEL_TYPES.map((type, i) => {
          const Icon = type.icon;
          return (
            <div
              key={type.id}
              className={cn(
                "group glass rounded-2xl border border-hairline p-5 sm:p-6 transition-all duration-300",
                "hover:border-violet-500/30 hover:bg-violet-500/5 hover-lift animate-fade-up"
              )}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center flex-shrink-0 group-hover:bg-violet-500/20 transition-colors">
                  <Icon className="h-5 w-5 text-violet-300" strokeWidth={2} aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm sm:text-base font-semibold tracking-tight leading-snug">
                    {type.title}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {type.description}
                  </p>
                  <p className="mt-2 text-[11px] text-muted-foreground/70">{type.useCase}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {type.platforms.map((p) => (
                      <span
                        key={p}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-hairline bg-surface-subtle/80 text-muted-foreground"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
        {!loading && (
          <Button
            asChild
            className="h-12 px-6 rounded-xl btn-shimmer text-white border-0 bg-accent-gradient shadow-glow font-medium min-w-[220px]"
          >
            <Link to={ctaTo}>
              {PRODUCT_COPY.hero.primaryCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
        <a
          href={ROUTES.landingSections.how}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-3"
        >
          {PRODUCT_COPY.hero.secondaryCta} →
        </a>
      </div>
    </div>
  );
}
