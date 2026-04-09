"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export default function HomePage() {
	const [scrolled, setScrolled] = useState(false); // only needed if hero depends on scroll
	const [isMenuOpen, setIsMenuOpen] = useState(false)

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
				{/*--------  Navigation  --------*/}
				<nav className={cn(
					"sticky top-0 left-0 right-0 z-[1000] w-full transition-all duration-300 bg-white/95 backdrop-blur py-3 px-0",
					scrolled ? "shadow-[0_2px_20px_rgba(0,0,0,0.1)]" : ""
				)}>
					<div className="mx-auto flex items-center justify-between w-full px-6 sm:px-32 md:px-16 md:py-4">
						<div className="flex items-center gap-4">
							<Image
								src="/images/slts-logo-edited.png"
								alt="SLTS Logo"
								className="h-auto w-[100px] sm:w-[120px] shrink-0"
								width={120}
								height={50}
							/>
						</div>

						{/* Destop Links */}
						<div className="hidden lg:flex gap-10 list-none items-center mb-0">
							{["Solution", "Features", "About", "Contact"].map((item) => (
								<Link
									key={item}
									href={`#${item.toLowerCase()}`}
									onClick={() => setIsMenuOpen(false)}
									className="text-[#64748B] no-underline font-medium text-base cursor-pointer transition-colors hover:text-[#010427]"
								>
									{item}
								</Link>
							))}
						</div>

						{/* Desktop Links & Hamburger */}
						<div className="flex gap-10 items-center">
							<div className="flex gap-3 md:gap-4 items-center">
								<Button variant="outline" className="hidden sm:inline-flex font-medium" asChild>
									<Link href="/payment-login">Pay Violation</Link>
								</Button>
								<Button variant="primary" className="font-medium" asChild>
									<Link href="/login">Client Login</Link>
								</Button>
							</div>

							<button
								onClick={() => setIsMenuOpen(!isMenuOpen)}
								className="lg:hidden text-[#64748b] hover:text-[#010427] z-[1200]"
							>
								{/* {isMenuOpen ? (
									<svg className="w-6 h-6" fill="none" stroke="currentColor" />) : (
									<Image src="/icons/hamburgerIconBlack.svg" alt="menu icon" width={20} height={20} className="self-center scale-x-[-1]" />
								)} */}
								{isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
							</button>
						</div>
					</div>

					{/* Mobile Menu Overlay */}
					<div className={cn(
						"lg:hidden fixed inset-0 z-[1100] bg-white/95 transition-all duration-300 ease-in-out transform",
						isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
					)}>
						<div className="flex flex-col gap-8 list-none text-center p-8 bg-white">
							{["Solution", "Features", "About", "Contact"].map((item) => (
								<Link
									key={item}
									href={`#${item.toLowerCase()}`}
									onClick={() => setIsMenuOpen(false)}
									className="text-[#64748B] no-underline font-medium text-base cursor-pointer transition-colors hover:text-[#010427] mb-2"
								>
									{item}
								</Link>
							))}
							<div className="flex flex-col items-center gap-4 pt-4 sm:hidden bg-white">
								<Button variant="outline" className="font-medium" asChild>
									<Link href="/payment-login">Pay Violation</Link>
								</Button>
								<Button variant="primary" className="font-medium" asChild>
									<Link href="/login">Client Login</Link>
								</Button>
							</div>
						</div>
					</div>
				</nav>

				{/*--------  Hero section  --------*/}
				<section className="pt-32 px-8 pb-16 m-auto max-w-[1280px]">
					<div className="grid md:grid-cols-2 gap-16 items-center">
						<div className="flex flex-col justify-between text-5 leading-tight mb-6">
							<h1 className="text-4xl md:text-6xl text-[#010427] font-extrabold mb-6 leading-10 tracking-wide">
								One-Stop <span className="bg-[linear-gradient(135deg,#010427_0%,#4f46E5_100%)] bg-clip-text text-transparent">Traffic Management</span> Solution
							</h1>
							<p className="text-xl text-[#64748B] mb-10 font-normal leading-9 tracking-wider">
								The Strict Liability Traffic Systems (SLTS) is a cutting-edge platform designed to enhance traffic management, enforce road safety laws and reduce road accidents.
							</p>
							<div className="flex gap-4 mb-14">
								<Button variant="primary">Get Started</Button>
								<Button variant="outline">Learn More</Button>
							</div>
						</div>

						<div className="relative">
							<Image
								src="/images/landing-page/hero2.png"
								width={800}
								height={800}
								alt="SLTS Dashboard"
								className="rounded-[20px]"
							/>
							<div className="absolute bg-white p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] animate-[float_3s_ease-in-out_infinite] border border-[#4f46E533] top-[10%] left-[-5%]">
								<div className="text-[2rem] mb-2">🚦</div>
								<div className="font-semibold text-[#1E393B]">AI Detection</div>
							</div>
							<div className="absolute bg-white p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] animate-[float_3s_ease-in-out_infinite] border border-[#4f46E533] bottom-[15%] right-[-5%] [amintation-delay-150ms]">
								<div className="text-[2rem] mb-2">✓</div>
								<div className="font-semibold text-[#1E393B]">Automated</div>
							</div>
						</div>
					</div>
				</section>

				{/*-------  About section  --------*/}
				<section className="py-20 px-8 my-0 mx-auto bg-white">
					<div className="grid grid-cols-2 px-4 mx-8 gap-16 items-center">
						<div className="text-center">
							<div className="text-9xl opacity-10">🚦</div>
						</div>
						<div>
							<h3 className="text-[2rem] font-bold text-[#010427] mb-4">What is SLTS</h3>
							<p className="text-[#64748B] text-sm leading-loose mb-6 text-justify">
              					The SLTS is an intelligent and intuitive platform that provides a robust traffic management system using AI and big data to identify traffic offenses and alert the relevant authorities using a crowd-sourcing model.
							</p>
							<p className="text-[#64748gitB] text-sm leading-8 mb-6 text-justify">
								Our cutting-edge platform is designed to enhance traffic management, enforce road safety laws, and reduce road accidents through automated monitoring and intelligent detection.
							</p>
						</div>
					</div>
				</section>

				{/* Features section */}
				{/* Services section */}
				{/* Stats section */}
			</main>

			{/* Footer – you may also move this to a component */}
		</div>
	);
}