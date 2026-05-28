import { Check, CreditCard, Download, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/app/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Pro",
    price: "$49",
    period: "per month",
    active: true,
    features: ["Unlimited funnels", "Unlimited AI", "Pixel automation", "Priority support"],
  },
  {
    name: "Creator",
    price: "$199",
    period: "per month",
    active: false,
    features: ["White-label", "Custom domains", "Multi-brand", "Dedicated success"],
  },
];

const invoices = [
  { id: "INV-2026-004", date: "May 1, 2026", amount: "$49.00", status: "Paid" },
  { id: "INV-2026-003", date: "Apr 1, 2026", amount: "$49.00", status: "Paid" },
];

export function BillingSection() {
  return (
    <section id="billing" className="scroll-mt-24 pt-4 pb-8">
      <SectionHeading
        title="Billing"
        description="Manage your subscription, payment method, and invoices."
      />

      <Card className="glass border-hairline border-violet-500/20 mb-6">
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              Current plan
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/25">
                Pro trial
              </span>
            </CardTitle>
            <CardDescription className="mt-1">12 days remaining · Renews Jun 1, 2026</CardDescription>
          </div>
          <Button className="rounded-xl btn-shimmer text-white border-0 bg-accent-gradient shadow-glow">
            <Sparkles className="h-4 w-4" />
            Upgrade
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold tracking-tight">
            $49<span className="text-sm font-normal text-muted-foreground">/month</span>
          </p>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              "glass border-hairline hover-lift transition-all duration-300",
              plan.active && "border-violet-500/30 ring-1 ring-violet-500/20"
            )}
          >
            <CardHeader>
              <CardTitle className="text-base">{plan.name}</CardTitle>
              <p className="text-2xl font-semibold mt-1">
                {plan.price}
                <span className="text-xs text-muted-foreground font-normal"> {plan.period}</span>
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-violet-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.active ? "secondary" : "default"}
                className={cn("w-full rounded-xl", !plan.active && "btn-shimmer text-white border-0 bg-accent-gradient")}
                disabled={plan.active}
              >
                {plan.active ? "Current plan" : `Switch to ${plan.name}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass border-hairline">
          <CardHeader>
            <CardTitle className="text-base">Payment method</CardTitle>
            <CardDescription>Default card on file</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="h-10 w-14 rounded-lg bg-surface-subtle border border-hairline flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Visa ···· 4242</p>
                <p className="text-xs text-muted-foreground">Expires 12/2028</p>
              </div>
            </div>
            <Button variant="outline" className="rounded-xl border-hairline">
              Update
            </Button>
          </CardContent>
        </Card>

        <Card className="glass border-hairline">
          <CardHeader>
            <CardTitle className="text-base">Invoices</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {invoices.map((inv, i) => (
              <div key={inv.id}>
                {i > 0 && <Separator className="bg-hairline" />}
                <div className="flex items-center justify-between gap-4 px-6 py-3.5 hover:bg-surface-subtle/50 transition-colors">
                  <div>
                    <p className="text-sm font-medium">{inv.id}</p>
                    <p className="text-xs text-muted-foreground">{inv.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{inv.amount}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" aria-label="Download">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
