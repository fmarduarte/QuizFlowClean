import { Link, useNavigate } from "react-router-dom";
import { Bell, Loader2, LogOut, Menu, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/routes";
import { useState } from "react";

interface AppNavbarProps {
  onMenuClick: () => void;
}

export function AppNavbar({ onMenuClick }: AppNavbarProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await signOut();
    navigate(ROUTES.login, { replace: true });
    setLoggingOut(false);
  }

  const initial = user?.email?.[0]?.toUpperCase() ?? "Q";

  return (
    <header className="h-16 flex-shrink-0 flex items-center gap-4 px-4 sm:px-6 border-b border-hairline glass sticky top-0 z-30">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="lg:hidden rounded-xl"
        onClick={onMenuClick}
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="hidden sm:flex flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search quizzes, funnels…"
          className="pl-9 h-9 bg-background/60 border-hairline rounded-xl"
        />
      </div>

      <div className="flex-1 lg:flex-none" />

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl hidden sm:inline-flex"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-xl" asChild aria-label="Settings">
          <a href={`${ROUTES.app}${ROUTES.appSections.settings}`}>
            <Settings className="h-4 w-4" />
          </a>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="rounded-xl text-muted-foreground hover:text-foreground hidden sm:inline-flex gap-2"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          Log out
        </Button>
        <Button
          asChild
          className="rounded-xl btn-shimmer text-white border-0 bg-accent-gradient shadow-glow h-9 hidden md:inline-flex"
        >
          <a href={`${ROUTES.app}${ROUTES.appSections.generator}`}>New quiz</a>
        </Button>
        <div
          className="h-8 w-8 rounded-full bg-accent-gradient flex items-center justify-center text-xs font-semibold text-white ml-1"
          title={user?.email ?? "Account"}
        >
          {initial}
        </div>
      </div>
    </header>
  );
}
