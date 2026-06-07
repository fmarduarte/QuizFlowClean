import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { GuestRoute } from "@/components/auth/GuestRoute";
import { MarketingLayout } from "@/layouts/MarketingLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { LandingPage } from "@/pages/marketing/LandingPage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { SignupPage } from "@/pages/auth/SignupPage";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "@/pages/auth/ResetPasswordPage";
import { AppHomePage } from "@/pages/app/AppHomePage";
import { CreateFunnelPage } from "@/pages/app/CreateFunnelPage";
import { MyFunnelsPage } from "@/pages/app/MyFunnelsPage";
import { AppSettingsPage } from "@/pages/app/AppSettingsPage";
import { AppBillingPage } from "@/pages/app/AppBillingPage";
import { QuizBuilderPage } from "@/pages/app/QuizBuilderPage";
import { NotFoundPage } from "@/pages/marketing/NotFoundPage";
import { ROUTES } from "@/lib/routes";

export const router = createBrowserRouter([
  {
    path: ROUTES.landing,
    element: <MarketingLayout />,
    children: [{ index: true, element: <LandingPage /> }],
  },
  {
    element: <AuthLayout />,
    children: [{ path: ROUTES.resetPassword, element: <ResetPasswordPage /> }],
  },
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: ROUTES.login, element: <LoginPage /> },
          { path: ROUTES.signup, element: <SignupPage /> },
          { path: ROUTES.forgotPassword, element: <ForgotPasswordPage /> },
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
        children: [
          { index: true, element: <AppHomePage /> },
          { path: "create", element: <CreateFunnelPage /> },
          { path: "funnels", element: <MyFunnelsPage /> },
          { path: "settings", element: <AppSettingsPage /> },
          { path: "billing", element: <AppBillingPage /> },
          { path: "quiz/:quizId", element: <QuizBuilderPage /> },
        ],
      },
    ],
  },
  {
    element: <MarketingLayout />,
    children: [{ path: "*", element: <NotFoundPage /> }],
  },
]);
