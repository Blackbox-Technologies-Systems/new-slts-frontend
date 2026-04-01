"use client";

import { BookOpen, Code, Settings, Shield, Zap, Database, Palette, GitBranch } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const DOC_SECTIONS = [
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Getting Started",
    description: "Quick setup guide for new Blackbox developers",
    items: [
      "Environment setup and dependencies",
      "Project structure overview",
      "Development workflow",
      "Deployment guidelines"
    ]
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Authentication",
    description: "User auth, roles, and security patterns",
    items: [
      "JWT token management",
      "Role-based access control",
      "Middleware protection",
      "API authentication"
    ]
  },
  {
    icon: <Database className="h-6 w-6" />,
    title: "State Management",
    description: "Redux Toolkit patterns and best practices",
    items: [
      "Store configuration",
      "Creating typed slices",
      "Async thunks and actions",
      "State persistence"
    ]
  },
  {
    icon: <Code className="h-6 w-6" />,
    title: "Components",
    description: "UI components and design system",
    items: [
      "shadcn/ui primitives",
      "Custom component patterns",
      "Theme customization",
      "Accessibility guidelines"
    ]
  },
  {
    icon: <Settings className="h-6 w-6" />,
    title: "API Integration",
    description: "Backend communication and data fetching",
    items: [
      "Axios configuration",
      "Error handling",
      "Request/response interceptors",
      "Type-safe API calls"
    ]
  },
  {
    icon: <GitBranch className="h-6 w-6" />,
    title: "Development Tools",
    description: "Essential tools and utilities",
    items: [
      "Custom hooks library",
      "Utility functions",
      "TypeScript patterns",
      "Testing setup"
    ]
  }
];

const QUICK_START = [
  {
    step: 1,
    title: "Clone & Install",
    code: "git clone <repo-url>\ncd bb-starter-pack\nnpm install"
  },
  {
    step: 2,
    title: "Environment Setup",
    code: "cp .env.example .env.local\n# Set JWT_SECRET and API_URL"
  },
  {
    step: 3,
    title: "Start Development",
    code: "npm run dev\n# Open http://localhost:3000"
  },
  {
    step: 4,
    title: "Begin Building",
    code: "# Authenticate and start coding!\n# Check dashboard/docs for guides"
  }
];

export default function DocsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="BB Starter Pack Documentation"
        description="Everything you need to know about building with Blackbox Technologies' Next.js starter pack."
      />

      {/* Quick Start */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Quick Start Guide
          </CardTitle>
          <CardDescription>
            Get up and running in minutes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {QUICK_START.map((item) => (
              <div key={item.step} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                    {item.step}
                  </Badge>
                  <h3 className="font-medium">{item.title}</h3>
                </div>
                <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
                  <code>{item.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documentation Sections */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {DOC_SECTIONS.map((section) => (
          <Card key={section.title} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  {section.icon}
                </div>
                <div>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                    {item}
                  </li>
                ))}
              </ul>
              <Separator className="my-4" />
              <Button variant="outline" size="sm" className="w-full">
                View Documentation
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Key Features */}
      <Card>
        <CardHeader>
          <CardTitle>Key Features & Architecture</CardTitle>
          <CardDescription>
            Core technologies and patterns used in the BB Starter Pack
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Frontend Stack
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                  <li>• Next.js 14 with App Router</li>
                  <li>• TypeScript for type safety</li>
                  <li>• Tailwind CSS + shadcn/ui</li>
                  <li>• Redux Toolkit for state</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security & Auth
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                  <li>• JWT-based authentication</li>
                  <li>• HTTP-only cookies</li>
                  <li>• Route protection middleware</li>
                  <li>• Role-based permissions</li>
                </ul>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Data Management
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                  <li>• Axios for API calls</li>
                  <li>• Redux persist for state</li>
                  <li>• Type-safe API clients</li>
                  <li>• Error handling patterns</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Developer Experience
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                  <li>• Custom React hooks</li>
                  <li>• Utility functions</li>
                  <li>• ESLint + Prettier</li>
                  <li>• Hot reload development</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}