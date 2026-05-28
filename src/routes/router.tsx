import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { GuestRoute } from "@/components/auth/GuestRoute";
import { MarketingLayout } from "@/layouts/MarketingLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { LandingPage } from "@/pages/marketing/LandingPage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { SignupPage } from "@/pages/auth/SignupPage";
import { DashboardPage } from "@/pages/app/DashboardPage";
import { ROUTES } from "@/lib/routes";

export const router = createBrowserRouter([
  {
    path: ROUTES.landing,
    element: <MarketingLayout />,
    children: [{ index: true, element: <LandingPage /> }],
  },
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: ROUTES.login, element: <LoginPage /> },
          { path: ROUTES.signup, element: <SignupPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: ROUTES.app,
        element: <DashboardLayout />,
        children: [{ index: true, element: <DashboardPage /> }],
      },
    ],
  },
  { path: "/app/*", element: <Navigate to={ROUTES.app} replace /> },
  { path: "*", element: <Navigate to={ROUTES.landing} replace /> },
]);
