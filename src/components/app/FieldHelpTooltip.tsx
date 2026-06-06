import type { ReactNode } from "react";
import { CircleHelp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface FieldHelpTooltipProps {
  help: string;
  example: string;
  className?: string;
}

export function FieldHelpTooltip({ help, example, className }: FieldHelpTooltipProps) {
  const content: ReactNode = (
    <div className="space-y-2 text-left">
      <p>{help}</p>
      <p className="text-primary-foreground/80">
        <span className="font-medium text-primary-foreground">Example: </span>
        {example}
      </p>
    </div>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            className
          )}
          aria-label="Field help"
        >
          <CircleHelp className="h-3.5 w-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="max-w-[280px] border-hairline bg-popover px-3 py-2.5 text-xs text-popover-foreground shadow-elevated"
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
}
