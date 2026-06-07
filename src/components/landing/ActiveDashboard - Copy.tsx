import { TrendingUp, Users, MousePointerClick, DollarSign, Play, Pause, MoreHorizontal, Sparkles, ArrowUpRight } from "lucide-react";

const funnels = [
  {
    name: "Skincare Routine Finder",
    status: "Live",
    channel: "TikTok Ads",
    leads: 4821,
    cvr: 41.2,
    cpl: "$0.38",
    completion: 78,
    trend: "+18%",
  },
  {
    name: "Protein Powder Quiz",
    status: "Live",
    channel: "Meta Ads",
    leads: 3104,
    cvr: 36.7,
    cpl: "$0.52",
    completion: 72,
    trend: "+12%",
  },
  {
    name: "Coaching Match",
    status: "Testing",
    channel: "Instagram",
    leads: 1287,
    cvr: 28.4,
    cpl: "$0.71",
    completion: 64,
    trend: "+6%",
  },
];

const metrics = [
  { label: "Leads captured", value: "12,847", delta: "+24%", icon: Users },
  { label: "Avg. CVR", value: "38.2%", delta: "+8.1%", icon: TrendingUp },
  { label: "Avg. CPL", value: "$0.46", delta: "-12%", icon: DollarSign },
  { label: "Click-through", value: "5.7%", delta: "+0.9%", icon: MousePointerClick },
];

export function ActiveDashboard() {
  return (
    <section className="py-32 bg-surface-subtle/40 border-y border-hairline">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Inside the product</p>
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gradient leading-[1.1]">
            A real dashboard. Real funnels. Real numbers.
          </h2>
          <p className="mt-5 text-base text-muted-foreground">
            Every campaign you launch shows up here — generation status, conversion rate, cost per lead, and the
            channels driving them.
          </p>
        </div>

        <div className="relative rounded-2xl border border-hairline bg-surface-elevated shadow-hero overflow-hidden hover-lift">
          <div className="absolute -inset-x-20 -top-24 h-64 bg-accent-gradient opacity-10 blur-3xl pointer-events-none" />

          {/* Top bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-surface-subtle/60">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-md bg-foreground flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 text-background" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-sm font-semibold leading-none">Funnels overview</div>
                <div className="text-[11px] text-muted-foreground mt-1 font-mono">workspace · acme-co</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-hairline text-[11px] bg-background">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                3 campaigns live
              </div>
              <button className="text-[11px] px-3 py-1.5 rounded-md bg-foreground text-background font-medium">+ New funnel</button>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-hairline border-b border-hairline">
            {metrics.map((m) => (
              <div key={m.label} className="bg-background p-5">
                <div className="flex items-center justify-between mb-2">
                  <m.icon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className={`text-[10px] font-medium ${m.delta.startsWith("-") ? "text-emerald-600" : "text-emerald-600"}`}>{m.delta}</span>
                </div>
                <div className="text-2xl font-semibold tracking-tight">{m.value}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>

          {/* Funnel rows */}
          <div className="p-2 sm:p-4">
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-[10px] uppercase tracking-wider text-muted-foreground">
              <div className="col-span-4">Funnel</div>
              <div className="col-span-2">Channel</div>
              <div className="col-span-1 text-right">Leads</div>
              <div className="col-span-1 text-right">CVR</div>
              <div className="col-span-1 text-right">CPL</div>
              <div className="col-span-2">Completion</div>
              <div className="col-span-1 text-right">7d</div>
            </div>

            {funnels.map((f) => (
              <div
                key={f.name}
                className="grid md:grid-cols-12 gap-3 md:gap-4 items-center px-4 py-4 rounded-xl hover:bg-surface-subtle/60 transition-colors group"
              >
                <div className="md:col-span-4 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-md bg-foreground/[0.04] border border-hairline flex items-center justify-center">
                    {f.status === "Live" ? <Play className="h-3 w-3 fill-foreground" /> : <Pause className="h-3 w-3 fill-muted-foreground text-muted-foreground" />}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{f.name}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${f.status === "Live" ? "bg-emerald-500/10 text-emerald-700" : "bg-amber-500/10 text-amber-700"}`}>
                        {f.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2 text-xs text-muted-foreground">{f.channel}</div>
                <div className="md:col-span-1 text-sm font-medium md:text-right tabular-nums">{f.leads.toLocaleString()}</div>
                <div className="md:col-span-1 text-sm font-medium md:text-right tabular-nums">{f.cvr}%</div>
                <div className="md:col-span-1 text-sm font-medium md:text-right tabular-nums">{f.cpl}</div>
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-accent-gradient rounded-full" style={{ width: `${f.completion}%` }} />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground tabular-nums">{f.completion}%</span>
                  </div>
                </div>
                <div className="md:col-span-1 flex items-center justify-end gap-1 text-xs text-emerald-600 font-medium">
                  <ArrowUpRight className="h-3 w-3" />
                  {f.trend}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
