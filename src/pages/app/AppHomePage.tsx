import { usePageMeta } from "@/hooks/use-page-meta";
import { AppFunnelTypeGrid } from "@/components/app/AppFunnelTypeGrid";
import { WizardStepIndicator } from "@/components/app/WizardStepIndicator";
import { PRODUCT_COPY } from "@/lib/product-copy";
import { PAGE_META } from "@/lib/seo";
import { ROUTES } from "@/lib/routes";

export function AppHomePage() {
  usePageMeta({ ...PAGE_META.dashboard, canonical: ROUTES.app });

  return (
    <div className="max-w-3xl mx-auto w-full py-12 sm:py-20 lg:py-24">
      <div className="mb-12 sm:mb-16">
        <WizardStepIndicator currentStep={1} />
      </div>

      <header className="text-center mb-10 sm:mb-14">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          {PRODUCT_COPY.app.homeHeadline}
        </h1>
      </header>

      <AppFunnelTypeGrid />
    </div>
  );
}
