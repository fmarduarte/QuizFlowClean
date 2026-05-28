import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/routes";

export function ProtectedRoute() {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="dark min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <Loader2 className="h-10 w-10 text-violet-400 animate-spin" />
          <p className="text-sm text-muted-foreground">Loading workspace…</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to={ROUTES.login} state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}
