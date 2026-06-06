import { Link } from "react-router-dom";
import { FUNNEL_TYPES } from "@/lib/funnel-types";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function AppFunnelTypeGrid() {
  return (
    <div className="grid sm:grid-cols-2 gap-3 max-w-xl mx-auto w-full">
      {FUNNEL_TYPES.map((type) => {
        const Icon = type.icon;
        return (
          <Link
            key={type.id}
            to={ROUTES.appCreateWithType(type.id)}
            className={cn(
              "group flex items-center gap-4 rounded-2xl border border-hairline/60 bg-background/20 p-5",
              "transition-all duration-200 hover:border-violet-500/25 hover:bg-violet-500/[0.04]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/30"
            )}
          >
            <div className="h-9 w-9 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
              <Icon className="h-4 w-4 text-violet-300/80" strokeWidth={1.75} aria-hidden />
            </div>
            <h3 className="text-sm font-medium tracking-tight">{type.shortTitle}</h3>
          </Link>
        );
      })}
    </div>
  );
}
