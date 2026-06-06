import { Navigate } from "react-router-dom";
import { ROUTES } from "@/lib/routes";

/** Legacy route — onboarding now lives at /app */
export function CreateFunnelPage() {
  return <Navigate to={ROUTES.app} replace />;
}
