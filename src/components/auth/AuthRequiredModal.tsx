import { Link } from "react-router-dom";
import { Lock, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { loginLink, signupLink } from "@/lib/auth-redirect";

interface AuthRequiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectTo?: string;
  title?: string;
  description?: string;
}

export function AuthRequiredModal({
  open,
  onOpenChange,
  redirectTo,
  title = "Sign in to continue",
  description = "AI funnel generation, the visual builder, and your dashboard are available to signed-in users. Create a free account to get started.",
}: AuthRequiredModalProps) {
  const redirect = redirectTo ?? loginLink().state.from;
  const loginTarget = loginLink(redirect);
  const signupTarget = signupLink(redirect);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl border-hairline bg-surface-elevated p-0 gap-0 overflow-hidden">
        <div className="p-6 sm:p-8">
          <DialogHeader className="space-y-4 text-center sm:text-left">
            <div className="mx-auto sm:mx-0 h-12 w-12 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
              <Lock className="h-5 w-5 text-violet-300" aria-hidden />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-xl font-semibold tracking-tight">{title}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </DialogDescription>
            </div>
          </DialogHeader>

          <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
            {["Generate AI funnels", "Edit in the funnel builder", "Save and publish campaigns"].map(
              (item) => (
                <li key={item} className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-violet-400 flex-shrink-0" aria-hidden />
                  {item}
                </li>
              )
            )}
          </ul>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              className="flex-1 h-11 rounded-xl btn-shimmer text-white border-0 bg-accent-gradient shadow-glow font-medium"
            >
              <Link
                to={loginTarget.pathname}
                state={loginTarget.state}
                onClick={() => onOpenChange(false)}
              >
                Sign in
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 h-11 rounded-xl border-hairline font-medium"
            >
              <Link
                to={signupTarget.pathname}
                state={signupTarget.state}
                onClick={() => onOpenChange(false)}
              >
                Create account
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
