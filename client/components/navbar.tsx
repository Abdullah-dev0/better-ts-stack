"use client";

import { useState, useEffect } from "react";
import { Github, Menu, Moon, Sun, X, Zap } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { NAVBAR_CONFIG } from "@/lib/constants";
import { MotionDiv, MotionHeader } from "./motion";

export const Navbar = () => {
	const [scrolled, setScrolled] = useState(false);
	const [isDark, setIsDark] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		document.documentElement.classList.toggle("dark", isDark);
	}, [isDark]);

	return (
		<MotionHeader
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
				scrolled ? "bg-background/80 backdrop-blur-md border-b border-border/50" : "bg-transparent"
			}`}>
			{/* Spicy tagline banner */}
			<div className="bg-primary/10 border-b border-primary/20 py-1.5 px-4 text-center">
				<span className="text-xs md:text-sm font-medium text-foreground/80 flex items-center justify-center gap-2">
					<Zap className="w-3.5 h-3.5 text-primary" />
					<span>{NAVBAR_CONFIG.banner.text}</span>
					<span className="hidden md:inline text-muted-foreground">•</span>
					<span className="hidden md:inline text-primary font-semibold">{NAVBAR_CONFIG.banner.tagline}</span>
				</span>
			</div>

			<nav className="container mx-auto px-6 h-16 flex items-center justify-between">
				{/* Logo */}
				<Link href="/" className="flex items-center gap-2">
					<div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
						<span className="text-primary-foreground font-bold text-sm font-mono">{NAVBAR_CONFIG.brand.logo}</span>
					</div>
					<span className="font-semibold text-foreground">{NAVBAR_CONFIG.brand.name}</span>
				</Link>

				{/* Desktop Nav */}
				<div className="hidden md:flex items-center gap-8">
					{NAVBAR_CONFIG.links.map((link, i) => (
						<Link
							key={i}
							href={link.href}
							{...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
							className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
							{link.label === "GitHub" && <Github className="w-4 h-4" />}
							{link.label}
						</Link>
					))}
				</div>

				{/* Actions */}
				<div className="flex items-center gap-3">
					<Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)} className="w-9 h-9">
						{isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
					</Button>

					<Link
						href={NAVBAR_CONFIG.cta.href}
						className={cn(buttonVariants({ variant: "default", size: "sm" }), "hidden md:flex btn-depth")}>
						{NAVBAR_CONFIG.cta.text}
					</Link>

					{/* Mobile Menu Toggle */}
					<Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
						{mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
					</Button>
				</div>
			</nav>

			{/* Mobile Menu */}
			{mobileOpen && (
				<MotionDiv
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
					className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border">
					<div className="container px-6 py-4 flex flex-col gap-4">
						{NAVBAR_CONFIG.links.map((link, i) => (
							<Link
								key={i}
								href={link.href}
								{...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
								className="text-sm text-muted-foreground hover:text-foreground py-2 flex items-center gap-1.5">
								{link.label === "GitHub" && <Github className="w-4 h-4" />}
								{link.label}
							</Link>
						))}
						<Link
							href={NAVBAR_CONFIG.cta.href}
							className={cn(buttonVariants({ variant: "default", size: "sm" }), "w-full mt-2 btn-depth flex items-center justify-center")}>
							{NAVBAR_CONFIG.cta.text}
						</Link>
					</div>
				</MotionDiv>
			)}
		</MotionHeader>
	);
};
