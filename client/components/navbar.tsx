"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { NAVBAR_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Github, Menu, X, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./theme-toggle";

export const Navbar = () => {
	const [scrolled, setScrolled] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border/50" : "bg-transparent"
			}`}>
			{/* Announcement banner */}
			<div className="bg-primary/10 border-b border-primary/20 py-2">
				<div className="container mx-auto px-6 flex items-center justify-center gap-2 text-xs">
					<Zap className="w-3 h-3 text-primary" />
					<span className="text-foreground/80">{NAVBAR_CONFIG.banner.text}</span>
					<span className="hidden md:inline text-primary font-mono ml-2">{NAVBAR_CONFIG.banner.tagline}</span>
				</div>
			</div>

			<nav className="container mx-auto px-6 h-16 flex items-center justify-between">
				{/* Logo */}
				<Link href="/" className="flex items-center gap-3 group">
					<div className="w-10 h-10 rounded-xl 	rom-primary to-accent flex items-center justify-center pulse-glow">
						<span className="text-primary-foreground font-bold text-lg font-mono">{NAVBAR_CONFIG.brand.logo}</span>
					</div>
					<span className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
						{NAVBAR_CONFIG.brand.name}
					</span>
				</Link>

				{/* Desktop Nav */}
				<div className="hidden md:flex items-center gap-8">
					{NAVBAR_CONFIG.links.map((link, i) => (
						<Link
							key={i}
							href={link.href}
							{...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
							className="text-sm text-muted-foreground hover:text-primary transition-colors relative group">
							{link.label === "GitHub" && <Github className="w-4 h-4 inline mr-1" />}
							{link.label}
							<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
						</Link>
					))}
				</div>

				{/* Actions */}
				<div className="flex items-center gap-3">
					<ThemeToggle />
					<Link
						href={NAVBAR_CONFIG.cta.href}
						className={cn(
							buttonVariants({ size: "sm" }),
							"hidden md:flex btn-cyber text-primary-foreground font-medium",
						)}>
						{NAVBAR_CONFIG.cta.text}
					</Link>

					<Button
						variant="ghost"
						size="icon"
						className="md:hidden glass-card rounded-lg"
						onClick={() => setMobileOpen(!mobileOpen)}>
						{mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
					</Button>
				</div>
			</nav>

			{/* Mobile Menu */}
			{mobileOpen && (
				<div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border">
					<div className="container px-6 py-4 flex flex-col gap-4">
						{NAVBAR_CONFIG.links.map((link, i) => (
							<Link
								key={i}
								href={link.href}
								{...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
								className="text-sm text-muted-foreground hover:text-primary py-2">
								{link.label === "GitHub" && <Github className="w-4 h-4 inline mr-1" />}
								{link.label}
							</Link>
						))}
						<Link
							href={NAVBAR_CONFIG.cta.href}
							className={cn(buttonVariants({ size: "sm" }), "w-full btn-cyber text-primary-foreground")}>
							{NAVBAR_CONFIG.cta.text}
						</Link>
					</div>
				</div>
			)}
		</div>
	);
};
