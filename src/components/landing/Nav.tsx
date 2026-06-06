import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sparkles, Menu, X, LogOut, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { signupLink } from "@/lib/auth-redirect";
import { PRODUCT_COPY } from "@/lib/product-copy";
import { ROUTES } from "@/lib/routes";
import { APP_VERSION_LABEL } from "@/lib/version";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const SUPPORT_HREF = "mailto:hello@quizflow.ai?subject=Support";

const publicLinks = [
  { href: ROUTES.landingSections.features, label: "Features" },
  { href: ROUTES.landingSections.pricing, label: "Pricing" },
  { href: ROUTES.landingSections.faq, label: "FAQ" },
];

const appLinks = [
  { href: ROUTES.app, label: "Dashboard", isRoute: true },
  { href: `${ROUTES.app}${ROUTES.appSections.saved}`, label: PRODUCT_COPY.funnel.myFunnels, isRoute: true },
  { href: `${ROUTES.app}${ROUTES.appSections.billing}`, label: "Credits", isRoute: true },
  { href: `${ROUTES.app}${ROUTES.appSections.settings}`, label: "Settings", isRoute: true },
];

export function Nav() {
  const { user, isAuthenticated, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === ROUTES.landing;

  const initial = user?.email?.[0]?.toUpperCase() ?? "Q";
  const getStartedTo = isAuthenticated
    ? { pathname: ROUTES.app, hash: ROUTES.appSections.generator }
    : signupLink(`${ROUTES.app}${ROUTES.appSections.generator}`);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleSignOut() {
    await signOut();
    navigate(ROUTES.landing, { replace: true });
    setOpen(false);
  }

  const navLinks = isAuthenticated ? appLinks : isHome ? publicLinks : [];

  return (
    <header
      className={`sticky top-0 z-50 w-full backdrop-blur-xl transition-all duration-300 ${
        scrolled
          ? "bg-background/70 border-b border-hairline shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_8px_24px_-12px_rgba(15,15,30,0.08)]"
          : "bg-background/40 border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 h-16 flex items-center justify-between">
        <Link to={ROUTES.landing} className="flex items-center gap-2 group">
          <div className="relative h-8 w-8 rounded-lg bg-accent-gradient flex items-center justify-center shadow-glow">
            <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} aria-hidden />
          </div>
          <span className="font-semibold tracking-tight text-foreground">QuizFlow AI</span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden md:flex items-center gap-7 text-sm text-muted-foreground"
        >
          {!isAuthenticated && !isHome && (
            <Link to={ROUTES.landing} className="hover:text-foreground transition-colors">
              Home
            </Link>
          )}
          {navLinks.map((l) =>
            "isRoute" in l && l.isRoute ? (
              <Link key={l.label} to={l.href} className="hover:text-foreground transition-colors">
                {l.label}
              </Link>
            ) : (
              <a key={l.label} href={l.href} className="hover:text-foreground transition-colors">
                {l.label}
              </a>
            )
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href={SUPPORT_HREF}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Support
          </a>
          <span className="text-[11px] text-muted-foreground/45 select-none tabular-nums">
            {APP_VERSION_LABEL}
          </span>

          {!loading && isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-9 gap-2 rounded-xl px-2 text-sm font-medium hover:bg-surface-elevated/80"
                >
                  <span className="h-7 w-7 rounded-full bg-accent-gradient flex items-center justify-center text-xs font-semibold text-white">
                    {initial}
                  </span>
                  <span className="hidden lg:inline max-w-[140px] truncate text-muted-foreground">
                    {user?.email}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl border-hairline">
                <DropdownMenuLabel className="font-normal">
                  <p className="text-sm font-medium truncate">{user?.email}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">QuizFlow AI workspace</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={ROUTES.app}>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={`${ROUTES.app}${ROUTES.appSections.settings}`}>Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            !loading && (
              <>
                <Link
                  to={ROUTES.login}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to={getStartedTo}
                  className="btn-glow text-sm font-medium bg-accent-gradient text-white px-4 py-2 rounded-lg hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-glow"
                >
                  Get started
                </Link>
              </>
            )
          )}
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-hairline bg-surface-elevated active:scale-95 transition-transform"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden border-t border-hairline bg-background/95 backdrop-blur-xl transition-[max-height,opacity] duration-300 ease-out ${
          open ? "max-h-[640px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav aria-label="Mobile navigation" className="px-5 py-4 flex flex-col gap-1">
          {navLinks.map((l) =>
            "isRoute" in l && l.isRoute ? (
              <Link
                key={l.label}
                to={l.href}
                onClick={() => setOpen(false)}
                className="py-3 px-2 text-[15px] text-foreground/90 hover:bg-surface-subtle rounded-lg transition-colors"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 px-2 text-[15px] text-foreground/90 hover:bg-surface-subtle rounded-lg transition-colors"
              >
                {l.label}
              </a>
            )
          )}

          <div className="mt-3 pt-3 border-t border-hairline flex flex-col gap-2">
            <a
              href={SUPPORT_HREF}
              onClick={() => setOpen(false)}
              className="py-3 px-2 text-[15px] text-foreground/90 hover:bg-surface-subtle rounded-lg transition-colors"
            >
              Support
            </a>
            <p className="px-2 text-[11px] text-muted-foreground/45 select-none">{APP_VERSION_LABEL}</p>

            {isAuthenticated ? (
              <>
                <p className="px-2 py-2 text-xs text-muted-foreground truncate">{user?.email}</p>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="py-3 px-2 text-[15px] text-left text-muted-foreground hover:text-foreground transition-colors"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to={ROUTES.login}
                  onClick={() => setOpen(false)}
                  className="py-3 px-2 text-[15px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to={getStartedTo}
                  onClick={() => setOpen(false)}
                  className="text-center text-[15px] font-medium btn-shimmer text-white px-4 py-3 rounded-xl shadow-glow"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
