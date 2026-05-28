import { Link } from "react-router-dom";
import { Sparkles, MapPin, Mail } from "lucide-react";
import { ROUTES } from "@/lib/routes";

const companyLinks = [
  { label: "About", href: "#" },
  { label: "Features", href: ROUTES.landingSections.features },
  { label: "Pricing", href: ROUTES.landingSections.pricing },
  { label: "Dashboard", href: ROUTES.app, isRoute: true },
  { label: "Contact", href: "mailto:hello@quizflow.ai" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-surface-subtle/40">
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left — brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-foreground flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-background" strokeWidth={2.5} />
              </div>
              <span className="font-semibold tracking-tight">QuizFlow AI</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              AI-powered quiz funnels for modern creators and paid social brands.
            </p>
          </div>

          {/* Center — company */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-4">Company</h3>
            <ul className="space-y-2.5">
              {companyLinks.map((l) => (
                <li key={l.label}>
                  {"isRoute" in l && l.isRoute ? (
                    <Link
                      to={l.href}
                      className="text-sm text-foreground/80 hover:text-foreground transition-colors"
                    >
                      {l.label}
                    </Link>
                  ) : (
                    <a
                      href={l.href}
                      className="text-sm text-foreground/80 hover:text-foreground transition-colors"
                    >
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — company info */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-4">Company Information</h3>
            <div className="space-y-3 text-sm text-foreground/80">
              <p className="font-semibold text-foreground">QuizFlow AI</p>
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-none text-muted-foreground" />
                <span>
                  Bragança Paulista — SP<br />
                  Brazil
                </span>
              </p>
              <p>
                <a
                  href="mailto:hello@quizflow.ai"
                  className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  hello@quizflow.ai
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2026 QuizFlow AI. All rights reserved.</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
