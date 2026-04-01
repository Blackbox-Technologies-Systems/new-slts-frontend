import Link from "next/link";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <Zap className="h-8 w-8 text-primary" />
      </div>
      <h1 className="text-6xl font-bold tracking-tight">404</h1>
      <p className="mt-3 text-xl font-medium">Page not found</p>
      <p className="mt-2 text-muted-foreground max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild>
          <Link href={ROUTES.HOME}>Go home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={ROUTES.DASHBOARD}>Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
