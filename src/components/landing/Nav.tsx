import { Sparkles, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const links = [
  { href: "#features", label: "Features" },
  { href: "#templates", label: "Templates" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full backdrop-blur-xl transition-all duration-300 ${
        scrolled
          ? "bg-background/70 border-b border-hairline shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_8px_24px_-12px_rgba(15,15,30,0.08)]"
          : "bg-background/40 border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <div className="relative h-8 w-8 rounded-lg bg-foreground flex items-center justify-center overflow-hidden">
            <Sparkles className="h-4 w-4 text-background" strokeWidth={2.5} />
            <div className="absolute inset-0 bg-accent-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="font-semibold tracking-tight text-foreground">QuizFlowKit</span>
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-foreground transition-colors">{l.label}</a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign in</a>
          <a href="#cta" className="text-sm font-medium bg-foreground text-background px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
            Get started
          </a>
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

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden border-t border-hairline bg-background/95 backdrop-blur-xl transition-[max-height,opacity] duration-300 ease-out ${
          open ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="px-5 py-4 flex flex-col gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-3 px-2 text-[15px] text-foreground/90 hover:bg-surface-subtle rounded-lg transition-colors"
            >
              {l.label}
            </a>
          ))}
          <div className="mt-3 pt-3 border-t border-hairline flex flex-col gap-2">
            <a
              href="#"
              onClick={() => setOpen(false)}
              className="py-3 px-2 text-[15px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign in
            </a>
            <a
              href="#cta"
              onClick={() => setOpen(false)}
              className="text-center text-[15px] font-medium bg-foreground text-background px-4 py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              Get started
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
