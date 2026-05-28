import { Link } from "react-router-dom";
import {
  CreditCard,
  LayoutDashboard,
  Bookmark,
  Settings,
  Sparkles,
  Wand2,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "overview" as const, hash: ROUTES.appSections.overview, label: "Overview", icon: LayoutDashboard },
  { id: "generator" as const, hash: ROUTES.appSections.generator, label: "Quiz Generator", icon: Wand2 },
  { id: "saved" as const, hash: ROUTES.appSections.saved, label: "Saved Quizzes", icon: Bookmark },
  { id: "billing" as const, hash: ROUTES.appSections.billing, label: "Billing", icon: CreditCard },
  { id: "settings" as const, hash: ROUTES.appSections.settings, label: "Settings", icon: Settings },
];

interface AppSidebarProps {
  onNavigate?: () => void;
  className?: string;
}

export function AppSidebar({ onNavigate, className }: AppSidebarProps) {
  const active = useActiveSection();

  return (
    <aside
      className={cn(
        "flex flex-col h-full border-r border-hairline bg-surface-subtle/50 backdrop-blur-xl",
        className
      )}
    >
      <Link
        to={ROUTES.app}
        onClick={onNavigate}
        className="h-16 flex items-center gap-2.5 px-5 border-b border-hairline flex-shrink-0 hover:bg-surface-elevated/30 transition-colors"
      >
        <div className="h-8 w-8 rounded-lg bg-accent-gradient flex items-center justify-center shadow-glow">
          <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight leading-none">QuizFlow AI</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Workspace</p>
        </div>
      </Link>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="px-3 pt-2 pb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>
        {navItems.map(({ id, hash, label, icon: Icon }) => (
          <a
            key={id}
            href={`${ROUTES.app}${hash}`}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              active === id
                ? "bg-violet-500/15 text-violet-200 border border-violet-500/25 shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-surface-elevated/80"
            )}
          >
            <Icon className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
            {label}
          </a>
        ))}
      </nav>

      <div className="p-4 border-t border-hairline">
        <div className="glass rounded-xl p-3 text-xs">
          <p className="font-medium text-foreground/90">Pro trial</p>
          <p className="text-muted-foreground mt-1 leading-relaxed">12 days left · Unlimited AI</p>
          <a
            href={`${ROUTES.app}${ROUTES.appSections.billing}`}
            onClick={onNavigate}
            className="mt-2 inline-block text-violet-300 hover:text-violet-200 font-medium transition-colors"
          >
            Manage billing →
          </a>
        </div>
      </div>
    </aside>
  );
}
