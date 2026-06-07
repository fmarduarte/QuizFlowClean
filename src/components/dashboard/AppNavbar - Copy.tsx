import { useNavigate } from "react-router-dom";
import { ChevronDown, Loader2, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/routes";

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
    <header className="h-12 flex-shrink-0 flex items-center gap-3 px-4 sm:px-8 border-b border-hairline/60 bg-background/40 sticky top-0 z-30">
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

      <div className="flex-1" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-9 gap-1.5 rounded-xl px-1.5 sm:px-2 hover:bg-surface-elevated/80"
          >
            <span className="h-8 w-8 rounded-full bg-accent-gradient flex items-center justify-center text-xs font-semibold text-white">
              {initial}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 rounded-xl border-hairline">
          <DropdownMenuLabel className="font-normal">
            <p className="text-sm font-medium truncate">{user?.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-destructive focus:text-destructive"
          >
            {loggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
