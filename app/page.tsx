"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false); // only needed if hero depends on scroll

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 bg-[linear-gradient(to_bottom_right,#f8fafc,#f1f5f9)]">
        {/* Navigation */}
        <nav className={cn(
          "sticky top-0 left-0 right-0 z-[1000] w-full transition-all duration-300 bg-white/95 backdrop-blur py-4 px-0",
          scrolled ? "shadow-[0_2px_20px_rgba(0,0,0,0.1)]" : ""
        )}>
          <div className="max-w-7xl mx-auto flex items-center justify-between w-full px-6 sm:px-32">
            <div className="flex items-center gap-4">
              <Image
                src="/images/slts-logo-edited.png"
                alt="SLTS Logo"
                className="h-auto w-[100px] md:w-[120px] shrink-0"
                width={500}
                height={500}
              />
            </div>

            <div className="hidden lg:flex gap-10 list-none items-center mb-0">
              <Link
                href="#solution"
                className="text-[#64748B] no-underline font-medium text-base cursor-pointer transition-colors hover:text-[#010427]" 
              >
                  Solution
              </Link>
              <Link
                href="#features"
                className="text-[#64748B] no-underline font-medium text-base cursor-pointer transition-colors hover:text-[#010427]" 
              >
                  Features
              </Link>
              <Link
                href="#about" 
                className="text-[#64748B] no-underline font-medium text-base cursor-pointer transition-colors hover:text-[#010427]" 
              >
                  About
              </Link>
              <Link
                href="#contact"
                className="text-[#64748B] no-underline font-medium text-base cursor-pointer transition-colors hover:text-[#010427]" 
              >
                  Contact
              </Link>
            </div>

            <div className="flex gap-3 md:gap-4 items-center">
              <Button variant="outline" className="hidden sm:inline-flex font-medium" asChild>
                <Link href="/payment-login">Pay Violation</Link>
              </Button>
              <Button variant="primary" className="font-medium" asChild>
                <Link href="/login">Client Login</Link>
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero section */}
        <section className="pt-32 px-8 pb-16 m-auto max-w-[1280px]">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col justify-between text-5.5 leading-tight mb-6">
              <h1 className="text-4xl md:text-6xl text-[#010427] font-extrabold mb-6 leading-10 tracking-wide">
                One-Stop <span className="bg-[linear-gradient(135deg,#010427_0%,#4f46E5_100%)] bg-clip-text text-transparent">Traffic Management</span> Solution
              </h1>
              <p className="text-xl text-[#64748B] mb-10 font-normal leading-9 tracking-wider">
                The Strict Liability Traffic Systems (SLTS) is a cutting-edge platform designed to enhance traffic management, enforce road safety laws and reduce road accidents.
              </p>
              <div className="flex gap-4">
                <Button variant="primary">Get Started</Button>
                <Button variant="outline">Learn More</Button>

              </div>
            </div>
          </div>
        </section>
        {/* About section */}
        {/* Features section */}
        {/* Services section */}
        {/* Stats section */}
      </main>

      {/* Footer – you may also move this to a component */}
    </div>
  );
}