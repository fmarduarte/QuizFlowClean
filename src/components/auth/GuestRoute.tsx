import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/routes";

export function GuestRoute() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="dark min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-violet-400 animate-spin" />
      </div>
    );
  }

  if (session) {
    return <Navigate to={ROUTES.app} replace />;
  }

  return <Outlet />;
}
