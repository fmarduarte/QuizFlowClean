import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthAlertProps {
  variant: "error" | "success";
  message: string;
  className?: string;
}

export function AuthAlert({ variant, message, className }: AuthAlertProps) {
  const isError = variant === "error";

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-xl px-4 py-3 text-sm animate-fade-in border",
        isError
          ? "bg-red-500/10 border-red-500/25 text-red-200"
          : "bg-emerald-500/10 border-emerald-500/25 text-emerald-200",
        className
      )}
    >
      {isError ? (
        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
      ) : (
        <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
      )}
      <span className="leading-relaxed">{message}</span>
    </div>
  );
}
