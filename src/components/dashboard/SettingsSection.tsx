import { SectionHeading } from "@/components/app/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export function SettingsSection() {
  return (
    <section id="settings" className="scroll-mt-24 pt-4">
      <SectionHeading
        title="Settings"
        description="Manage your workspace, notifications, and integrations."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass border-hairline">
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display name</Label>
              <Input id="name" defaultValue="Creator Workspace" className="border-hairline bg-background/80" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue="you@example.com"
                className="border-hairline bg-background/80"
              />
            </div>
            <Button className="rounded-xl">Save changes</Button>
          </CardContent>
        </Card>

        <Card className="glass border-hairline">
          <CardHeader>
            <CardTitle className="text-base">Notifications</CardTitle>
            <CardDescription>Alerts for leads and performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "New leads", desc: "Email when a quiz captures a lead" },
              { label: "Weekly digest", desc: "Summary every Monday" },
              { label: "AI generation complete", desc: "When quiz drafts are ready" },
            ].map((item, i) => (
              <div key={item.label}>
                {i > 0 && <Separator className="mb-4 bg-hairline" />}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={i < 2} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass border-hairline lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Integrations</CardTitle>
            <CardDescription>Connect ad platforms and CRMs</CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-3 gap-3">
            {["Meta Pixel", "TikTok Events", "Klaviyo"].map((name) => (
              <div
                key={name}
                className="flex items-center justify-between rounded-xl border border-hairline px-4 py-3"
              >
                <span className="text-sm font-medium">{name}</span>
                <Button variant="outline" size="sm" className="rounded-lg border-hairline">
                  Connect
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
