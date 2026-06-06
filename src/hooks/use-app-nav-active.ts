import { useLocation } from "react-router-dom";
import { ROUTES, type AppNavId } from "@/lib/routes";

export function useAppNavActive(): AppNavId {
  const { pathname } = useLocation();

  if (pathname.startsWith(ROUTES.appCreate)) return "create";
  if (pathname.startsWith(ROUTES.appFunnels)) return "funnels";
  if (pathname.startsWith(ROUTES.appSettings)) return "settings";
  if (pathname.startsWith(ROUTES.appBilling)) return "billing";
  if (pathname === ROUTES.app) return "create";

  return "create";
}
