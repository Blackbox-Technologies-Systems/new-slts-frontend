"use client";

import { Users, DollarSign, TrendingUp, ShoppingCart, Activity } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Legend,
} from "recharts";
import { StatsCard } from "@/components/common/StatsCard";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector } from "@/hooks";
import { formatRelativeTime } from "@/lib/utils";

const STATS = [
  { title: "Active Projects", value: "12", change: 15.3, changeType: "increase" as const, icon: <Users className="h-5 w-5" /> },
  { title: "Commits This Week", value: "247", change: 8.2, changeType: "increase" as const, icon: <TrendingUp className="h-5 w-5" /> },
  { title: "Open Issues", value: "23", change: -12.5, changeType: "decrease" as const, icon: <ShoppingCart className="h-5 w-5" /> },
  { title: "Deployments", value: "8", change: 25.0, changeType: "increase" as const, icon: <DollarSign className="h-5 w-5" /> },
];

const AREA_DATA = [
  { month: "Jan", commits: 420, contributors: 24 },
  { month: "Feb", commits: 580, contributors: 31 },
  { month: "Mar", commits: 520, contributors: 29 },
  { month: "Apr", commits: 710, contributors: 42 },
  { month: "May", commits: 640, contributors: 38 },
  { month: "Jun", commits: 890, contributors: 51 },
  { month: "Jul", commits: 980, contributors: 59 },
  { month: "Aug", commits: 840, contributors: 50 },
];

const BAR_DATA = [
  { day: "Mon", prs: 12, issues: 8 },
  { day: "Tue", prs: 18, issues: 12 },
  { day: "Wed", prs: 15, issues: 10 },
  { day: "Thu", prs: 21, issues: 15 },
  { day: "Fri", prs: 26, issues: 18 },
  { day: "Sat", prs: 9, issues: 5 },
  { day: "Sun", prs: 7, issues: 3 },
];

const RECENT_ACTIVITY = [
  { id: "1", user: "Alex Chen", action: "Merged PR #247 - API optimization", time: new Date(Date.now() - 300000).toISOString(), avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Alex", status: "success" },
  { id: "2", user: "Sam Rivera", action: "Deployed v2.1.4 to production", time: new Date(Date.now() - 1800000).toISOString(), avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sam", status: "info" },
  { id: "3", user: "Jordan Lee", action: "Created new feature branch", time: new Date(Date.now() - 7200000).toISOString(), avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Jordan", status: "success" },
  { id: "4", user: "Casey Morgan", action: "Fixed critical bug in auth flow", time: new Date(Date.now() - 14400000).toISOString(), avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Casey", status: "warning" },
];

const STATUS_BADGE: Record<string, "success" | "warning" | "default"> = {
  success: "success",
  warning: "warning",
  info: "default",
};

export default function DashboardPage() {
  const user = useAppSelector((s) => s.auth.user);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] ?? "Developer"} 👋`}
        description="Your Blackbox development dashboard. Track projects, manage deployments, and collaborate with the team."
      />

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((s) => (
          <StatsCard key={s.title} {...s} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Area chart */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Code Activity</CardTitle>
            <CardDescription>Monthly commits and active contributors</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={AREA_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(221.2 83.2% 53.3%)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(221.2 83.2% 53.3%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                <YAxis tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    fontSize: "12px",
                  }}
                  formatter={(v: number) => [`${v}`, "Commits"]}
                />
                <Area
                  type="monotone"
                  dataKey="commits"
                  stroke="hsl(208 74% 26%)"
                  strokeWidth={2}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>PRs merged vs issues closed this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={BAR_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="prs" fill="hsl(208 74% 26%)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="issues" fill="hsl(142 71% 45%)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Recent Activity</CardTitle>
          </div>
          <CardDescription>Latest actions across your workspace</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {RECENT_ACTIVITY.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarImage src={item.avatar} />
                  <AvatarFallback>{item.user.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.user}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.action}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant={STATUS_BADGE[item.status] ?? "default"} className="hidden sm:inline-flex capitalize">
                    {item.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{formatRelativeTime(item.time)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
