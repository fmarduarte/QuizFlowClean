import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/lib/routes";

const HASH_REDIRECTS: Record<string, string> = {
  "#overview": ROUTES.app,
  "#generator": ROUTES.appCreate,
  "#saved": ROUTES.appFunnels,
  "#settings": ROUTES.appSettings,
  "#billing": ROUTES.appBilling,
};

/** Redirects legacy /app#section hash links to dedicated app routes. */
export function LegacyHashRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const target = HASH_REDIRECTS[window.location.hash];
    if (target) {
      navigate(target, { replace: true });
    }
  }, [navigate]);

  return null;
}
