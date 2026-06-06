import { Link, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, Loader2, LogOut, Menu, Search, Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { PRODUCT_COPY } from "@/lib/product-copy";
import { ROUTES } from "@/lib/routes";
import { APP_VERSION_LABEL } from "@/lib/version";

const SUPPORT_HREF = "mailto:hello@quizflow.ai?subject=Support";

const navLinks = [
  { to: ROUTES.app, label: "Dashboard" },
  { to: `${ROUTES.app}${ROUTES.appSections.saved}`, label: PRODUCT_COPY.funnel.myFunnels },
  { to: `${ROUTES.app}${ROUTES.appSections.billing}`, label: "Credits" },
  { to: `${ROUTES.app}${ROUTES.appSections.settings}`, label: "Settings" },
];

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

      <nav
        aria-label="Workspace navigation"
        className="hidden lg:flex items-center gap-1 text-sm text-muted-foreground"
      >
        {navLinks.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            className="px-3 py-1.5 rounded-lg hover:text-foreground hover:bg-surface-elevated/60 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="hidden md:flex flex-1 max-w-xs relative ml-auto lg:ml-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden />
        <Input
          placeholder="Search funnels…"
          className="pl-9 h-9 bg-background/60 border-hairline rounded-xl"
        />
      </div>

      <div className="flex-1 lg:flex-none" />

      <div className="flex items-center gap-2 sm:gap-3">
        <a
          href={SUPPORT_HREF}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:inline-flex"
        >
          Support
        </a>
        <span className="text-[11px] text-muted-foreground/45 select-none tabular-nums hidden sm:inline">
          {APP_VERSION_LABEL}
        </span>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl hidden sm:inline-flex"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </Button>

        <Button
          asChild
          className="rounded-xl btn-shimmer text-white border-0 bg-accent-gradient shadow-glow h-9 hidden md:inline-flex"
        >
          <a href={`${ROUTES.app}${ROUTES.appSections.generator}`}>{PRODUCT_COPY.funnel.new}</a>
        </Button>

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
              <p className="text-xs text-muted-foreground mt-0.5">QuizFlow AI workspace</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={`${ROUTES.app}${ROUTES.appSections.settings}`}>
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
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
      </div>
    </header>
  );
}
