import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PRODUCT_COPY } from "@/lib/product-copy";
import { ROUTES } from "@/lib/routes";

export function SettingsSection() {
  const { user } = useAuth();

  return (
    <div className="space-y-10 max-w-lg">
      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground/80">Account</h2>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={user?.email ?? ""}
            readOnly
            className="border-hairline/80 bg-background/30 rounded-xl h-11"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground/80">Notifications</h2>
        <div className="space-y-4">
          {[
            { label: "Funnel generation complete", desc: "When a new funnel is ready" },
            { label: "New leads", desc: "When a funnel captures a lead" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground/70 mt-0.5">{item.desc}</p>
              </div>
              <Switch defaultChecked={item.label === "Funnel generation complete"} />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground/80">Plan</h2>
        <Link
          to={ROUTES.appBilling}
          className="flex items-center justify-between gap-3 rounded-xl border border-hairline/80 px-4 py-3.5 text-sm hover:bg-muted/20 transition-colors"
        >
          <span>{PRODUCT_COPY.app.billingTitle}</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
        </Link>
      </section>
    </div>
  );
}
