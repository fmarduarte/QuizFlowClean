import { BarChart3, Users, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { label: "Active funnels", value: "4", icon: Zap, delta: "+2 this week" },
  { label: "Leads captured", value: "2,847", icon: Users, delta: "+18%" },
  { label: "Avg. completion", value: "38%", icon: BarChart3, delta: "+4.2 pts" },
];

export function DashboardStats() {
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      {stats.map((s) => (
        <Card key={s.label} className="glass border-hairline bg-card/40 hover-lift transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
            <s.icon className="h-4 w-4 text-violet-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tracking-tight">{s.value}</p>
            <p className="text-xs text-emerald-400 mt-1">{s.delta}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
