import { Link, Outlet } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { ROUTES } from "@/lib/routes";

export function AuthLayout() {
  return (
    <div className="dark min-h-screen bg-background text-foreground selection:bg-violet-500/30 relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-hero opacity-80"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/4 h-[400px] w-[400px] rounded-full blur-3xl opacity-40 glow-orb"
        style={{ background: "var(--gradient-glow)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full blur-3xl opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(120,80,255,0.25), transparent 70%)",
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link to={ROUTES.landing} className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-accent-gradient flex items-center justify-center shadow-glow">
              <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-semibold tracking-tight">QuizFlow AI</span>
          </Link>
          <Link
            to={ROUTES.landing}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to site
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center px-5 py-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
