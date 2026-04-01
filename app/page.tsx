import Link from "next/link";
import {
  Zap, Shield, BarChart3, Users, ArrowRight,
  CheckCircle2, Github, Twitter,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES, APP_NAME } from "@/constants";

const FEATURES = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Enterprise Auth",
    description: "Secure JWT authentication with Blackbox standards. Role-based access, middleware protection, and seamless session management.",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Redux Toolkit",
    description: "Type-safe state management with Redux Toolkit. Pre-configured slices for auth, UI, and notifications — just add your business logic.",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Developer Dashboard",
    description: "Modern dashboard UI with analytics, user management, and customizable layouts. Built for productivity and ease of use.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Blackbox Components",
    description: "Pre-built UI components following Blackbox design system. Accessible, themeable, and ready for enterprise applications.",
  },
];

const INCLUDED = [
  "Next.js 14 App Router",
  "TypeScript strict mode",
  "Tailwind CSS + shadcn/ui",
  "Redux Toolkit + redux-persist",
  "Cookie-based JWT auth",
  "Middleware route protection",
  "Axios with interceptors",
  "Custom React hooks",
  "API route handlers",
  "Dark / Light / System theme",
  "Recharts analytics",
  "Sonner toast notifications",
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Image
              src="/images/bb-logo-box.png"
              alt="BB Logo"
              width={32}
              height={32}
              className="shrink-0"
            />
            <span className="font-bold text-lg">{APP_NAME}</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#whats-inside" className="text-muted-foreground hover:text-foreground transition-colors">What&apos;s Inside</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href={ROUTES.LOGIN}>Sign in</Link>
            </Button>
            <Button asChild>
              <Link href={ROUTES.REGISTER}>Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="container mx-auto px-4 py-24 md:py-32 text-center">
          <Badge variant="secondary" className="mb-6 gap-1.5">
            <Zap className="h-3 w-3" />
            Blackbox Technologies Official Starter
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-tight">
            Build faster at{" "}
            <span className="text-primary">Blackbox Technologies</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            The official Next.js starter pack for Blackbox software developers. Auth, state management, dashboard UI - everything you need to ship production apps quickly.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="gap-2">
              <Link href={ROUTES.REGISTER}>
                Start building <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={ROUTES.LOGIN}>
                View demo dashboard
              </Link>
            </Button>
          </div>

          {/* Demo credentials hint */}
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-2 text-sm text-muted-foreground">
            <span>Demo:</span>
            <code className="text-foreground font-mono">admin@blackbox.dev</code>
            <span>/</span>
            <code className="text-foreground font-mono">password</code>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="bg-muted/30 border-y py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Everything you need</h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                A carefully curated set of patterns and libraries so you can focus on building your product.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES.map((f) => (
                <Card key={f.title} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                      {f.icon}
                    </div>
                    <h3 className="font-semibold mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* What's inside */}
        <section id="whats-inside" className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Developer-First Stack</h2>
            <p className="mt-3 text-muted-foreground">Everything Blackbox developers need to build enterprise applications.</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl mx-auto">
            {INCLUDED.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button size="lg" asChild>
              <Link href={ROUTES.LOGIN}>
                Try the dashboard →
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span>{APP_NAME} - Blackbox Technologies</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
              <Github className="h-4 w-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
