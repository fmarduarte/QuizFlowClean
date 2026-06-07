import { Link, useNavigate } from "react-router-dom";
import { Bookmark, Loader2, LogOut, Plus, Settings, Sparkles } from "lucide-react";
import { useState } from "react";
import { PRODUCT_COPY } from "@/lib/product-copy";
import { ROUTES } from "@/lib/routes";
import { useAuth } from "@/context/AuthContext";
import { useAppNavActive } from "@/hooks/use-app-nav-active";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "create" as const, to: ROUTES.app, label: PRODUCT_COPY.funnel.create, icon: Plus },
  { id: "funnels" as const, to: ROUTES.appFunnels, label: PRODUCT_COPY.funnel.myFunnels, icon: Bookmark },
  { id: "settings" as const, to: ROUTES.appSettings, label: "Settings", icon: Settings },
];

interface AppSidebarProps {
  onNavigate?: () => void;
  className?: string;
}

export function AppSidebar({ onNavigate, className }: AppSidebarProps) {
  const active = useAppNavActive();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await signOut();
    onNavigate?.();
    navigate(ROUTES.login, { replace: true });
    setLoggingOut(false);
  }

  return (
    <aside
      className={cn(
        "flex flex-col h-full border-r border-hairline/60 bg-background/40",
        className
      )}
    >
      <Link
        to={ROUTES.app}
        onClick={onNavigate}
        className="h-14 flex items-center gap-2.5 px-5 border-b border-hairline/60 flex-shrink-0 hover:bg-muted/20 transition-colors"
      >
        <div className="h-7 w-7 rounded-lg bg-violet-500/15 flex items-center justify-center">
          <Sparkles className="h-3.5 w-3.5 text-violet-300" strokeWidth={2.5} />
        </div>
        <p className="text-sm font-medium tracking-tight leading-none text-foreground/90">QuizFlow</p>
      </Link>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ id, to, label, icon: Icon }) => (
          <Link
            key={id}
            to={to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              active === id
                ? "bg-violet-500/10 text-foreground"
                : "text-muted-foreground/80 hover:text-foreground hover:bg-muted/30"
            )}
          >
            <Icon className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-hairline">
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface-elevated/80 transition-all"
        >
          {loggingOut ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          Log out
        </button>
      </div>
    </aside>
  );
}
