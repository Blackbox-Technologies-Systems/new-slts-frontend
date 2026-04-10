"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowLeftRight, ChartNoAxesCombined, Clipboard, Headset, Lightbulb, Menu, Settings, Shield, User, Wallet, X } from "lucide-react";
// import "themify-icons/css/themify-icons.css";
import {
	FiSmartphone,
	FiShield,
	FiRefreshCw,
	FiGrid,
} from "react-icons/fi";

const features = [
	{
		icon: <FiSmartphone />,
		title: "Violation Detection",
		description: "The violation detection system uses advanced AI."
	},
	{
		icon: <FiShield />,
		title: "Data Transmission",
		description: "Data transmission is a critical component..."
	},
	{
		icon: <Wallet className="w-10 h-10" />,
		title: "Offense Registration",
		description: "The offense registration system records all traffic violations."
	},
	{
		icon: <FiRefreshCw />,
		title: "Automated Notification",
		description: "This system automatically notifies violators."
	},
	{
		icon: <Headset className="w-10 h-10" />,
		title: "Appeals",
		description: "The appeals system provides a platform for individuals."
	},
	{
		icon: <FiGrid />,
		title: "Payment",
		description: "The payment system facilitates easy and secure settlement."
	},
]

const services = [
	{
		icon: <Settings className="w-6 h-6 sm:w-10 sm:h-10" />,
		title: "Maintenanceof Traffic Lights",
		desc: "Our comprehensive traffic light maintenance service..."
	},
	{
		icon: <Lightbulb className="w-10 h-10" />,
		title: "Installation of Traffic Lights",
		desc: "Our expert installation service ensures that new traffic lights..."
	},
	{
		icon: <Clipboard className="w-10 h-10" />,
		title: "Traffic Offense Management",
		desc: "Our traffic offense management system enhances..."
	},
]

const stats = [
	{ 	number: '60', 
		label: 'Support Countries', 
		icon: <Shield className="w-11 h-11 opacity-35" />
	},
	{ 
		number: '12K', 
		label: 'Transactions per hour', 
		icon: <ArrowLeftRight className="w-11 h-11 opacity-35"/> 
	},
	{ 	number: '5B', 
		label: 'Largest Transactions', 
		icon: <ChartNoAxesCombined className="w-11 h-11 opacity-35" /> 
	},
	{ 	number: '5', 
		label: 'Years of Experience', 
		icon: <User className="w-11 h-11 opacity-35" /> 
	}
]

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
					"sticky top-0 left-0 right-0 z-1000 w-full transition-all duration-300 bg-white/95 backdrop-blur py-3 px-0",
					scrolled ? "shadow-[0_2px_20px_rgba(0,0,0,0.1)]" : ""
				)}>
					<div className="mx-auto flex items-center justify-between w-full px-6 sm:px-32 md:px-16 md:py-4">
						<div className="flex items-center gap-4">
							<Image
								src="/images/slts-logo-edited.png"
								alt="SLTS Logo"
								className="h-auto w-25 sm:w-30 shrink-0"
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
								className="lg:hidden text-[#64748b] hover:text-[#010427] z-1200"
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
						"lg:hidden fixed inset-0 z-1100 bg-white/95 transition-all duration-300 ease-in-out transform",
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
				<section className="pt-32 px-8 pb-16 m-auto max-w-7xl">
					<div className="grid md:grid-cols-2 gap-16 items-center">
						<div className="flex flex-col justify-between text-5 leading-tight mb-6">
							<h1 className="text-4xl md:text-6xl text-[#010427] font-extrabold mb-6 leading-[1.2] tracking-wide">
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
				<section id="about" className="py-20 sm:px-8 my-0 mx-auto bg-white">
					<div className="grid md:grid-cols-2 px-4 mx-8 gap-16 items-center">
						<div className="text-center">
							<div className="text-9xl opacity-10">🚦</div>
						</div>
						<div>
							<h3 className="text-[2rem] font-bold text-[#010427] mb-4">What is SLTS</h3>
							<p className="text-[#64748B] text-sm leading-loose mb-6 text-justify">
								The SLTS is an intelligent and intuitive platform that provides a robust traffic management system using AI and big data to identify traffic offenses and alert the relevant authorities using a crowd-sourcing model.
							</p>
							<p className="text-[#64748B] text-sm leading-8 mb-6 text-justify">
								Our cutting-edge platform is designed to enhance traffic management, enforce road safety laws, and reduce road accidents through automated monitoring and intelligent detection.
							</p>
						</div>
					</div>
				</section>

				{/* Features section */}
				<section id="features" className="py-20 px-8 bg-[linear-gradient(135deg,#010427_0%,#0A1853_50%,#4f46E5_100%)] text-white max-w-full relative overflow-hidden">
					<div className="px-2 sm:px-4 sm:mx-8">
						<h2 className="text-center text-[2.5rem] font-extrabold mb-4">Our System</h2>
						<p className="text-center text-lg mb-16 max-w-150 ml-auto mr-auto">
							Our comprehensive system ensures efficient traffic management
						</p>
						<div className="grid md:grid-cols-3 gap-5 sm:gap-3 relative 2-[1]">
							{features.map((feature, index) => (
								<div className="bg-[#FFFFFF1A] backdrop-blur-[10px] p-8 rounded-2xl transition-all duration-300 border border-[#FFFFFF33] hover:-translate-y-2 hover:bg-[#FFFFFF26] hover:shadow-[0_12px_40px_#4F46E54D] hover:border-[#4F46E580]" key={index}>
									<div className="text-[2.5rem] mb-6 text-white">
										{feature.icon}
									</div>
									<h4 className="text-xl font-bold mb-3">{feature.title}</h4>
									<p className="text-[.85rem] leading-[1.6] text-[#FFFFFFE6]">{feature.description}</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Services section */}
				<section className="py-20 sm:px-8 my-0 mx-auto bg-[#F8FAFC]">
					<div className="sm:gap-3 px-8 sm:px-4 sm:mx-8">
						<h2 className="text-center text-[2.5rem] font-extrabold text-[#1E293B] mb-4">What We Do</h2>
						<p className="text-center text-lg text-[#64748B] mb-16 max-w-150 ml-auto mr-auto">
							Comprehensive traffic management solutions
						</p>

						<div className="grid sm:grid-cols-3 gap-8 ">
							{services.map((services, index) => (
								<div className="flex flex-col justify-center items-center bg-white p-8 rounded-2xl leading-[1.6] shadow-[0_4px_20px_#00000014] transition-all duration-30 text-center border border-transparent hover:-translate-y-2 hover:shadow-[0_12px_40px_#0104271f] hover:border-[#6366f1]" key={index}>
									<div className="mb-6 font-medium text-center">
										{services.icon}
									</div>
									<h4 className="text-xl font-bold text-[#1E293B]  mb-3">{services.title}</h4>
									<p className="text-[#64748B]">{services.desc}</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Stats section */}
				<section className="py-20 px-9 sm:px-8 my-0 mx-auto bg-[linear-gradient(135deg,#010427_0%,#0A1854_50%,#4F46E5_100%)] text-white relative overflow-hidden">
					<div className="sm:px-4 sm:mx-8">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-9 sm:gap-8 my-0 mx-auto relative z-1">
							{stats.map((stats, index) => (
								<div key={index} className="text-center relative flex flex-col items-center justify-3">
									<div className="text-5xl font-extrabold mb-2">{stats.number}</div>
									<div className="text-sm opacity-90 mb-4">{stats.label}</div>
									{stats.icon}
								</div>
							))}
						</div>
					</div>
				</section>
			</main>

			{/* Footer – you may also move this to a component */}
		</div>
	);
}