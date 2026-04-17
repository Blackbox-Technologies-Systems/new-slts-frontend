import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication | SLTS",
  description: "Strict Liability Traffic System — sign in to access the dashboard.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-950 p-4 md:p-8 font-sans transition-colors duration-300">
      <div className="w-full max-w-[1200px]">
        {children}
      </div>
    </div>
  );
}