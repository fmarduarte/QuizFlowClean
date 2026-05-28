import { Link } from "react-router-dom";
import { Bell, Menu, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/lib/routes";

interface AppNavbarProps {
  onMenuClick: () => void;
}

export function AppNavbar({ onMenuClick }: AppNavbarProps) {
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
          asChild
          className="rounded-xl btn-shimmer text-white border-0 bg-accent-gradient shadow-glow h-9 hidden xs:inline-flex"
        >
          <a href={`${ROUTES.app}${ROUTES.appSections.generator}`}>New quiz</a>
        </Button>
        <Link
          to={ROUTES.landing}
          className="h-8 w-8 rounded-full bg-accent-gradient flex items-center justify-center text-xs font-semibold text-white ml-1 hover:opacity-90 transition-opacity"
          title="Back to site"
        >
          Q
        </Link>
      </div>
    </header>
  );
}
