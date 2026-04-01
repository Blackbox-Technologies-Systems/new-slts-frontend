"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

const LINE_DATA = [
  { week: "W1", pageViews: 4200, sessions: 1800, bounceRate: 42 },
  { week: "W2", pageViews: 5100, sessions: 2200, bounceRate: 38 },
  { week: "W3", pageViews: 4700, sessions: 1950, bounceRate: 45 },
  { week: "W4", pageViews: 6300, sessions: 2800, bounceRate: 36 },
  { week: "W5", pageViews: 7100, sessions: 3100, bounceRate: 33 },
  { week: "W6", pageViews: 6800, sessions: 2950, bounceRate: 35 },
  { week: "W7", pageViews: 8400, sessions: 3600, bounceRate: 30 },
  { week: "W8", pageViews: 9200, sessions: 4100, bounceRate: 28 },
];

const PIE_DATA = [
  { name: "Organic", value: 44, color: "hsl(221.2 83.2% 53.3%)" },
  { name: "Direct", value: 24, color: "hsl(142 71% 45%)" },
  { name: "Referral", value: 18, color: "hsl(38 92% 50%)" },
  { name: "Social", value: 14, color: "hsl(280 65% 60%)" },
];

const TOP_PAGES = [
  { path: "/dashboard", views: 12400, change: 8.2 },
  { path: "/auth/login", views: 8900, change: 3.1 },
  { path: "/", views: 6700, change: 12.5 },
  { path: "/dashboard/analytics", views: 4100, change: -2.3 },
  { path: "/dashboard/settings", views: 2800, change: 5.6 },
];

const TOOLTIP_STYLE = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "6px",
  fontSize: "12px",
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Analytics"
        description="Track your traffic, engagement, and conversion metrics"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.info("Export functionality coming soon!")}
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </PageHeader>

      {/* Summary badges */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: "Last 8 weeks", variant: "secondary" as const },
          { label: "All channels", variant: "secondary" as const },
          { label: "Live data", variant: "success" as const },
        ].map((b) => (
          <Badge key={b.label} variant={b.variant}>{b.label}</Badge>
        ))}
      </div>

      {/* Line chart — page views + sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic Trends</CardTitle>
          <CardDescription>Weekly page views and sessions over the last 8 weeks</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={LINE_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line
                type="monotone"
                dataKey="pageViews"
                name="Page Views"
                stroke="hsl(221.2 83.2% 53.3%)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="sessions"
                name="Sessions"
                stroke="hsl(142 71% 45%)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pie + top pages */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Traffic sources pie */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors come from</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {PIE_DATA.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(v: number) => [`${v}%`, "Share"]}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top pages table */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most visited pages this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="grid grid-cols-3 pb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <span className="col-span-2">Page</span>
                <span className="text-right">Views</span>
              </div>
              {TOP_PAGES.map((page, i) => (
                <div
                  key={page.path}
                  className="grid grid-cols-3 items-center py-2.5 text-sm border-t"
                >
                  <div className="col-span-2 flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded truncate max-w-[180px]">
                      {page.path}
                    </code>
                  </div>
                  <div className="text-right flex items-center justify-end gap-2">
                    <span className="font-medium">{page.views.toLocaleString()}</span>
                    <span
                      className={`text-xs ${
                        page.change >= 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {page.change >= 0 ? "+" : ""}{page.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bounce rate trend */}
      <Card>
        <CardHeader>
          <CardTitle>Bounce Rate</CardTitle>
          <CardDescription>Lower is better — percentage of single-page sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={LINE_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[20, 55]} unit="%" />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(v: number) => [`${v}%`, "Bounce Rate"]}
              />
              <Line
                type="monotone"
                dataKey="bounceRate"
                name="Bounce Rate"
                stroke="hsl(38 92% 50%)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
