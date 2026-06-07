import { usePageMeta } from "@/hooks/use-page-meta";
import { OnboardingWizard } from "@/components/app/onboarding/OnboardingWizard";
import { PAGE_META } from "@/lib/seo";
import { ROUTES } from "@/lib/routes";

export function AppHomePage() {
  usePageMeta({ ...PAGE_META.dashboard, canonical: ROUTES.app });

  return (
    <div className="w-full py-12 sm:py-20 lg:py-24 px-4 sm:px-0">
      <OnboardingWizard />
    </div>
  );
}
