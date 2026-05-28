import { createBrowserRouter, Navigate } from "react-router-dom";
import { MarketingLayout } from "@/layouts/MarketingLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { LandingPage } from "@/pages/marketing/LandingPage";
import { DashboardPage } from "@/pages/app/DashboardPage";
import { ROUTES } from "@/lib/routes";

export const router = createBrowserRouter([
  {
    path: ROUTES.landing,
    element: <MarketingLayout />,
    children: [{ index: true, element: <LandingPage /> }],
  },
  {
    path: ROUTES.app,
    element: <DashboardLayout />,
    children: [{ index: true, element: <DashboardPage /> }],
  },
  // Legacy app sub-routes → unified dashboard
  { path: "/app/*", element: <Navigate to={ROUTES.app} replace /> },
  { path: "*", element: <Navigate to={ROUTES.landing} replace /> },
]);
