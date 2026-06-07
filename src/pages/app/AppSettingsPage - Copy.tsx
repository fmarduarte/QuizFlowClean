import { usePageMeta } from "@/hooks/use-page-meta";
import { SettingsSection } from "@/components/dashboard/SettingsSection";
import { PRODUCT_COPY } from "@/lib/product-copy";
import { PAGE_META } from "@/lib/seo";
import { ROUTES } from "@/lib/routes";

export function AppSettingsPage() {
  usePageMeta({
    ...PAGE_META.dashboard,
    title: `${PRODUCT_COPY.app.settingsTitle} | QuizFlow AI`,
    canonical: ROUTES.appSettings,
  });

  return (
    <div className="max-w-2xl mx-auto w-full py-8 sm:py-12">
      <header className="mb-10">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          {PRODUCT_COPY.app.settingsTitle}
        </h1>
      </header>
      <SettingsSection />
    </div>
  );
}
