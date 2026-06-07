import { Sparkles } from "lucide-react";

interface AuthShellProps {
  badge: string;
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthShell({ badge, title, description, children, footer }: AuthShellProps) {
  return (
    <div className="w-full max-w-md animate-fade-up">
      <div className="glass-strong rounded-2xl border border-hairline p-8 sm:p-10 shadow-elevated">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-hairline bg-surface-elevated text-xs font-medium mb-4">
            <Sparkles className="h-3 w-3 text-violet-400" aria-hidden />
            {badge}
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gradient">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>

        {children}

        {footer && <div className="mt-6">{footer}</div>}
      </div>
    </div>
  );
}
