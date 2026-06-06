import { usePageMeta } from "@/hooks/use-page-meta";
import { SavedQuizzesSection } from "@/components/dashboard/SavedQuizzesSection";
import { PRODUCT_COPY } from "@/lib/product-copy";
import { PAGE_META } from "@/lib/seo";
import { ROUTES } from "@/lib/routes";

export function MyFunnelsPage() {
  usePageMeta({
    ...PAGE_META.dashboard,
    title: `${PRODUCT_COPY.app.funnelsTitle} | QuizFlow AI`,
    canonical: ROUTES.appFunnels,
  });

  return (
    <div className="max-w-2xl mx-auto w-full py-8 sm:py-12">
      <header className="mb-10">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          {PRODUCT_COPY.app.funnelsTitle}
        </h1>
      </header>
      <SavedQuizzesSection />
    </div>
  );
}
