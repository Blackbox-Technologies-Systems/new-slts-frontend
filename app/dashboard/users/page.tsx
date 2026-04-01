"use client";

import { useState } from "react";
import { Search, UserPlus, MoreHorizontal, Shield, User } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useDebounce } from "@/hooks";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import type { User as UserType } from "@/types";

const MOCK_USERS: UserType[] = [
  { id: "usr_1", name: "Alex Johnson", email: "admin@blackbox.dev", role: "admin", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Alex", createdAt: "2024-01-01T00:00:00Z", isVerified: true },
  { id: "usr_2", name: "Sam Rivera", email: "dev@blackbox.dev", role: "user", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sam", createdAt: "2024-03-15T00:00:00Z", isVerified: true },
  { id: "usr_3", name: "Jordan Lee", email: "jordan@blackbox.dev", role: "moderator", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Jordan", createdAt: "2024-05-20T00:00:00Z", isVerified: false },
  { id: "usr_4", name: "Casey Morgan", email: "casey@blackbox.dev", role: "user", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Casey", createdAt: "2024-07-08T00:00:00Z", isVerified: true },
  { id: "usr_5", name: "Riley Chen", email: "riley@blackbox.dev", role: "user", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Riley", createdAt: "2024-09-01T00:00:00Z", isVerified: false },
];

const ROLE_BADGE: Record<string, "default" | "secondary" | "outline"> = {
  admin: "default",
  moderator: "secondary",
  user: "outline",
};

export default function UsersPage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const filtered = MOCK_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Users" description="Manage and view all users in your workspace">
        <Button size="sm" onClick={() => toast.info("Invite flow coming soon!")}>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite user
        </Button>
      </PageHeader>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total users", value: MOCK_USERS.length, icon: <User className="h-4 w-4" /> },
          { label: "Admins", value: MOCK_USERS.filter((u) => u.role === "admin").length, icon: <Shield className="h-4 w-4" /> },
          { label: "Verified", value: MOCK_USERS.filter((u) => u.isVerified).length, icon: <Shield className="h-4 w-4" /> },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-3xl font-bold mt-1">{s.value}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {s.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>{filtered.length} user{filtered.length !== 1 ? "s" : ""} found</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search users…"
                className="flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {/* Header row */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted/30">
              <span className="col-span-5">User</span>
              <span className="col-span-2 hidden md:block">Role</span>
              <span className="col-span-3 hidden sm:block">Joined</span>
              <span className="col-span-2 hidden sm:block">Status</span>
              <span className="col-span-1 text-right"></span>
            </div>

            {filtered.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-muted-foreground">
                No users match your search.
              </div>
            ) : (
              filtered.map((user) => (
                <div
                  key={user.id}
                  className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-muted/30 transition-colors"
                >
                  {/* User info */}
                  <div className="col-span-5 flex items-center gap-3 min-w-0">
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>
                        {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="col-span-2 hidden md:flex">
                    <Badge variant={ROLE_BADGE[user.role] ?? "outline"} className="capitalize">
                      {user.role}
                    </Badge>
                  </div>

                  {/* Joined */}
                  <div className="col-span-3 hidden sm:block text-sm text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </div>

                  {/* Verified */}
                  <div className="col-span-2 hidden sm:block">
                    <Badge variant={user.isVerified ? "success" : "outline"}>
                      {user.isVerified ? "Verified" : "Pending"}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast.info(`Viewing ${user.name}`)}>
                          View profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info(`Editing ${user.name}`)}>
                          Edit user
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => toast.error("Delete is disabled in demo")}
                        >
                          Delete user
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
