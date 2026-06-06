import { useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { QuizGeneratePanel } from "@/components/app/QuizGeneratePanel";
import { WizardStepIndicator } from "@/components/app/WizardStepIndicator";
import { usePageMeta } from "@/hooks/use-page-meta";
import { FUNNEL_TYPE_IDS } from "@/lib/funnel-brief";
import { FUNNEL_TYPES } from "@/lib/funnel-types";
import { PAGE_META } from "@/lib/seo";
import { ROUTES } from "@/lib/routes";

export function CreateFunnelPage() {
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get("type") ?? "";
  const initialFunnelType = FUNNEL_TYPE_IDS.includes(typeParam) ? typeParam : undefined;
  const [wizardStep, setWizardStep] = useState<2 | 3>(2);

  const funnelType = FUNNEL_TYPES.find((t) => t.id === initialFunnelType);

  usePageMeta({
    ...PAGE_META.dashboard,
    title: `Create Funnel | QuizFlow AI`,
    canonical: ROUTES.appCreate,
  });

  if (!initialFunnelType) {
    return <Navigate to={ROUTES.app} replace />;
  }

  return (
    <div className="max-w-xl mx-auto w-full py-10 sm:py-16">
      <div className="mb-10 sm:mb-12">
        <WizardStepIndicator currentStep={wizardStep} />
      </div>

      {wizardStep === 2 && (
        <Link
          to={ROUTES.app}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground/70 hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Change type
        </Link>
      )}

      {wizardStep === 3 && (
        <button
          type="button"
          onClick={() => setWizardStep(2)}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground/70 hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Edit brief
        </button>
      )}

      <header className="mb-8 space-y-3">
        {funnelType && (
          <p className="text-xs text-violet-300/70 font-medium">{funnelType.shortTitle}</p>
        )}
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          {wizardStep === 2 ? "Describe your funnel" : "Review & generate"}
        </h1>
        {wizardStep === 2 && (
          <p className="text-sm text-muted-foreground/80">
            Tell us about your business, audience, and goal.
          </p>
        )}
      </header>

      <QuizGeneratePanel
        variant="page"
        initialFunnelType={initialFunnelType}
        wizardStep={wizardStep}
        onWizardContinue={() => setWizardStep(3)}
      />
    </div>
  );
}
