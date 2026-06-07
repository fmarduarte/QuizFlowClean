import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { usePageMeta } from "@/hooks/use-page-meta";
import { BillingSection } from "@/components/dashboard/BillingSection";
import { PRODUCT_COPY } from "@/lib/product-copy";
import { PAGE_META } from "@/lib/seo";
import { ROUTES } from "@/lib/routes";

export function AppBillingPage() {
  usePageMeta({
    ...PAGE_META.dashboard,
    title: `${PRODUCT_COPY.app.billingTitle} | QuizFlow AI`,
    canonical: ROUTES.appBilling,
  });

  return (
    <div className="max-w-2xl mx-auto w-full py-8 sm:py-12">
      <Link
        to={ROUTES.appSettings}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground/70 hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Settings
      </Link>

      <header className="mb-10">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          {PRODUCT_COPY.app.billingTitle}
        </h1>
      </header>
      <BillingSection />
    </div>
  );
}
