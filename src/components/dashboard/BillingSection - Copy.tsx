import { CreditCard, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const invoices = [
  { id: "INV-2026-004", date: "May 1, 2026", amount: "$49.00", status: "Paid" },
  { id: "INV-2026-003", date: "Apr 1, 2026", amount: "$49.00", status: "Paid" },
];

export function BillingSection() {
  return (
    <div className="space-y-6">
      <Card className="glass border-hairline">
        <CardHeader>
          <CardTitle className="text-base">Current plan</CardTitle>
          <CardDescription>Pro trial · 12 days remaining</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold tracking-tight">
            $49<span className="text-sm font-normal text-muted-foreground">/month</span>
          </p>
          <p className="text-xs text-muted-foreground mt-2">Renews Jun 1, 2026</p>
        </CardContent>
      </Card>

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
    </div>
  );
}
