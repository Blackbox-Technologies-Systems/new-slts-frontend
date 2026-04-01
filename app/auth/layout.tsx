import Link from "next/link";
import { Zap } from "lucide-react";
import Image from "next/image";
import { APP_NAME, ROUTES } from "@/constants";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col bg-primary p-12 text-primary-foreground">
        <Link href={ROUTES.HOME} className="flex items-center gap-2 mb-auto">
          <Image
            src="/images/bb-logo-box.png"
            alt="BB Logo"
            width={32}
            height={32}
            className="shrink-0"
          />
          <span className="font-bold text-xl">{APP_NAME}</span>
        </Link>

        <div className="mb-auto space-y-4">
          <blockquote className="text-xl font-medium leading-relaxed">
            &ldquo;The best time to set up your project structure was yesterday.
            The second best time is with {APP_NAME}.&rdquo;
          </blockquote>
          <p className="text-primary-foreground/70 text-sm">
            — Every developer, after onboarding week
          </p>
        </div>

        {/* Decorative grid */}
        <div className="mt-12 grid grid-cols-3 gap-2 opacity-20">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-8 rounded bg-primary-foreground/30" />
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-col items-center justify-center p-8">
        {/* Mobile logo */}
        <Link href={ROUTES.HOME} className="flex items-center gap-2 mb-8 lg:hidden">
          <Image
            src="/images/bb-logo-box.png"
            alt="BB Logo"
            width={32}
            height={32}
            className="shrink-0"
          />
          <span className="font-bold text-xl">{APP_NAME}</span>
        </Link>

        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
