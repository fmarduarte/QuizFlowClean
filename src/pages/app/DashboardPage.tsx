import { useEffect } from "react";
import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { QuizGeneratePanel } from "@/components/app/QuizGeneratePanel";
import { SectionHeading } from "@/components/app/SectionHeading";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { SavedQuizzesSection } from "@/components/dashboard/SavedQuizzesSection";
import { SettingsSection } from "@/components/dashboard/SettingsSection";
import { BillingSection } from "@/components/dashboard/BillingSection";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/use-page-meta";
import { PAGE_META } from "@/lib/seo";
import { PRODUCT_COPY } from "@/lib/product-copy";
import { ROUTES } from "@/lib/routes";

export function DashboardPage() {
  usePageMeta({ ...PAGE_META.dashboard, canonical: ROUTES.app });
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const el = document.querySelector(hash);
    if (el) {
      requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto w-full space-y-16 pb-12">
      {/* Overview + stats */}
      <section id="overview" className="scroll-mt-24">
        <PageHeader
          title="Dashboard"
          description="Build, manage, and scale AI funnels for paid social ads."
          action={
            <Button
              asChild
              className="rounded-xl btn-shimmer text-white border-0 bg-accent-gradient shadow-glow"
            >
              <a href={`${ROUTES.app}${ROUTES.appSections.generator}`}>
                <Sparkles className="h-4 w-4" />
                {PRODUCT_COPY.funnel.new}
              </a>
            </Button>
          }
        />
        <DashboardStats />
      </section>

      {/* Funnel generator */}
      <section id="generator" className="scroll-mt-24">
        <SectionHeading
          title={PRODUCT_COPY.funnel.generator}
          description="Describe your offer. AI drafts funnel steps, result pages, and lead capture in seconds."
        />
        <div className="glass rounded-2xl border border-hairline p-6 sm:p-8">
          <QuizGeneratePanel variant="page" />
        </div>
      </section>

      {/* Saved quizzes */}
      <SavedQuizzesSection />

      {/* Settings */}
      <SettingsSection />

      {/* Billing */}
      <BillingSection />
    </div>
  );
}
