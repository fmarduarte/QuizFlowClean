import { Sparkles, TrendingUp, Users, MousePointerClick, Play, Check } from "lucide-react";

export function DashboardMockup() {
  return (
    <div className="relative w-full max-w-6xl mx-auto animate-fade-up" style={{ animationDelay: "300ms" }}>
      {/* Glow */}
      <div className="absolute -inset-x-20 -inset-y-10 bg-accent-gradient opacity-20 blur-3xl rounded-full pointer-events-none" />

      <div className="relative rounded-2xl border border-hairline bg-surface-elevated shadow-hero overflow-hidden">
        {/* Browser chrome */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-hairline bg-surface-subtle">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />
            <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />
            <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />
          </div>
          <div className="text-xs text-muted-foreground font-mono">app.quizflow.ai/funnels/new</div>
          <div className="w-12" />
        </div>

        <div className="grid grid-cols-12 gap-0 min-h-[520px]">
          {/* Sidebar */}
          <aside className="hidden md:block col-span-2 border-r border-hairline p-4 bg-surface-subtle/50">
            <div className="space-y-1">
              {["Funnels", "Quizzes", "Audiences", "Analytics", "Integrations"].map((item, i) => (
                <div
                  key={item}
                  className={`px-3 py-2 rounded-md text-xs ${i === 0 ? "bg-foreground text-background font-medium" : "text-muted-foreground"}`}
                >
                  {item}
                </div>
              ))}
            </div>
          </aside>

          {/* Main */}
          <main className="col-span-12 md:col-span-7 p-6 space-y-5 border-r border-hairline">
            {/* AI prompt */}
            <div className="rounded-xl border border-hairline p-4 bg-background">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-3.5 w-3.5 text-foreground" />
                <span className="text-xs font-medium text-foreground">AI Funnel Generator</span>
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground">GPT-4o</span>
              </div>
              <div className="text-sm text-muted-foreground mb-3">
                "A skincare quiz that recommends a routine based on skin type for TikTok ads"
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full w-3/4 bg-foreground rounded-full animate-pulse-glow" />
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">Generating…</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Leads", value: "12,847", delta: "+24%", icon: Users },
                { label: "CVR", value: "38.2%", delta: "+8.1%", icon: TrendingUp },
                { label: "CTR", value: "5.7%", delta: "+12%", icon: MousePointerClick },
              ].map((m) => (
                <div key={m.label} className="rounded-xl border border-hairline p-3 bg-background">
                  <div className="flex items-center justify-between mb-1.5">
                    <m.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-[10px] text-emerald-600 font-medium">{m.delta}</span>
                  </div>
                  <div className="text-lg font-semibold tracking-tight">{m.value}</div>
                  <div className="text-[10px] text-muted-foreground">{m.label}</div>
                </div>
              ))}
            </div>

            {/* Funnel chart */}
            <div className="rounded-xl border border-hairline p-4 bg-background">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium">Conversion funnel</span>
                <span className="text-[10px] text-muted-foreground font-mono">Last 7 days</span>
              </div>
              <div className="flex items-end gap-1.5 h-24">
                {[80, 95, 70, 85, 100, 92, 78, 88, 96, 82, 90, 75, 86, 94].map((h, i) => (
                  <div key={i} className="flex-1 bg-accent-gradient rounded-sm opacity-80" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>

            {/* Ad channels */}
            <div className="flex items-center gap-2">
              {["TikTok Ads", "Instagram", "Meta Ads"].map((c) => (
                <div key={c} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-hairline text-[11px] bg-background">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {c}
                </div>
              ))}
            </div>
          </main>

          {/* Phone preview */}
          <aside className="hidden md:flex col-span-3 p-6 bg-surface-subtle/50 items-center justify-center">
            <div className="relative w-[180px] h-[360px] rounded-[28px] border-[6px] border-foreground bg-background shadow-elevated overflow-hidden animate-float">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 h-1 w-12 rounded-full bg-foreground/20" />
              <div className="p-4 pt-7 space-y-3">
                <div className="text-[10px] text-muted-foreground">Question 2 of 5</div>
                <div className="h-1 rounded-full bg-muted overflow-hidden">
                  <div className="h-full w-2/5 bg-accent-gradient" />
                </div>
                <div className="text-[13px] font-semibold leading-tight mt-3">What's your skin type?</div>
                <div className="space-y-2 mt-3">
                  {[
                    { label: "Oily", selected: true },
                    { label: "Dry", selected: false },
                    { label: "Combination", selected: false },
                    { label: "Sensitive", selected: false },
                  ].map((opt) => (
                    <div
                      key={opt.label}
                      className={`flex items-center gap-2 p-2 rounded-lg border text-[11px] ${
                        opt.selected ? "border-foreground bg-foreground text-background" : "border-hairline"
                      }`}
                    >
                      <div className={`h-3 w-3 rounded-full border flex items-center justify-center ${opt.selected ? "border-background" : "border-muted-foreground"}`}>
                        {opt.selected && <Check className="h-2 w-2" strokeWidth={3} />}
                      </div>
                      {opt.label}
                    </div>
                  ))}
                </div>
                <button className="w-full mt-3 py-2 rounded-lg bg-foreground text-background text-[11px] font-medium flex items-center justify-center gap-1">
                  Continue <Play className="h-2.5 w-2.5 fill-background" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
