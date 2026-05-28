import { ArrowRight, Sparkles } from "lucide-react";
import { DashboardMockup } from "./DashboardMockup";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-28 sm:pb-32">
      <div className="absolute inset-0 bg-hero pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[600px] dotted-grid opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />

      {/* Animated gradient blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full blur-3xl opacity-40 animate-float" style={{ background: "radial-gradient(circle at 30% 30%, rgba(120,140,255,0.35), transparent 60%)" }} />
        <div className="absolute -top-10 right-[-10%] h-[480px] w-[480px] rounded-full blur-3xl opacity-40 animate-float" style={{ animationDelay: "1.2s", background: "radial-gradient(circle at 70% 30%, rgba(200,140,255,0.30), transparent 60%)" }} />
        <div className="absolute top-[40%] left-[40%] h-[380px] w-[380px] rounded-full blur-3xl opacity-30 animate-float" style={{ animationDelay: "2.4s", background: "radial-gradient(circle, rgba(140,220,255,0.25), transparent 60%)" }} />
      </div>

      {/* Floating UI chips (desktop only — keep mobile clean) */}
      <div aria-hidden className="hidden lg:block pointer-events-none absolute inset-0">
        <div className="absolute top-32 left-[6%] px-3 py-2 rounded-xl border border-hairline bg-surface-elevated/80 backdrop-blur-md shadow-card text-[11px] font-medium animate-float" style={{ animationDelay: "0.3s" }}>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2 align-middle" />
          CPL ↓ 42%
        </div>
        <div className="absolute top-48 right-[6%] px-3 py-2 rounded-xl border border-hairline bg-surface-elevated/80 backdrop-blur-md shadow-card text-[11px] font-medium animate-float" style={{ animationDelay: "1.1s" }}>
          ✨ AI quiz generated in 47s
        </div>
        <div className="absolute top-[58%] left-[4%] px-3 py-2 rounded-xl border border-hairline bg-surface-elevated/80 backdrop-blur-md shadow-card text-[11px] font-medium animate-float" style={{ animationDelay: "1.8s" }}>
          📈 +28% CTR on TikTok
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-hairline bg-surface-elevated shadow-sm text-xs font-medium animate-fade-in">
            <Sparkles className="h-3 w-3" />
            <span>Introducing QuizFlowKit 2.0</span>
            <span className="text-muted-foreground">— now with one-click ad export</span>
          </div>

          <h1 className="mt-7 sm:mt-8 text-[2rem] leading-[1.1] sm:text-6xl sm:leading-[1.05] lg:text-7xl font-semibold tracking-tight text-gradient animate-fade-up text-balance">
            Interactive AI Quiz Funnels<br className="hidden sm:block" /> Built for Paid Social Ads
          </h1>

          <p className="mt-6 text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl leading-relaxed animate-fade-up" style={{ animationDelay: "100ms" }}>
            Create high-converting AI-powered quiz funnels for TikTok, Instagram, and Facebook Ads in minutes.
          </p>

          <div className="mt-9 sm:mt-10 w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3 animate-fade-up" style={{ animationDelay: "200ms" }}>
            <a
              href="#cta"
              className="btn-glow group inline-flex items-center justify-center gap-2 bg-foreground text-background px-6 py-3.5 rounded-xl font-medium shadow-elevated hover:shadow-glow transition-all duration-300 hover:-translate-y-0.5"
            >
              Start Building Funnels
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="#how"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium border border-hairline bg-surface-elevated/60 backdrop-blur hover:bg-surface-elevated hover:-translate-y-0.5 transition-all duration-300"
            >
              Watch Demo
            </a>
          </div>
        </div>

        <div className="mt-16 sm:mt-20">
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}
