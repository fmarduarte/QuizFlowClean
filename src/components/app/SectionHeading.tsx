import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeading({ title, description, action, className }: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6",
        className
      )}
    >
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
