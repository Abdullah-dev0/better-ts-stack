"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TerminalPreview } from "./terminal-preview";

export const HeroSection = () => {
	return (
		<section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
			{/* Grid background */}
			<div className="absolute inset-0 bg-grid mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

			{/* Radial gradient overlay */}
			<div className="absolute inset-0 bg-gradient-radial" />

			{/* Floating orbs - very subtle */}
			<motion.div
				animate={{
					y: [0, -15, 0],
					opacity: [0.05, 0.1, 0.05],
				}}
				transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
				className="absolute top-1/3 left-1/4 w-48 h-48 bg-primary/5 rounded-full blur-3xl"
			/>
			<motion.div
				animate={{
					y: [0, 15, 0],
					opacity: [0.03, 0.08, 0.03],
				}}
				transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
				className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-muted-foreground/5 rounded-full blur-3xl"
			/>

			<div className="relative z-10 max-w-4xl mx-auto text-center">
				{/* Badge */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
					<Sparkles className="w-3.5 h-3.5 text-primary" />
					<span className="text-xs font-medium text-primary">Full-Stack CLI Tool</span>
				</motion.div>

				{/* Headline */}
				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
					Ship Type-Safety
					<br />
					<span className="text-gradient">by Default.</span>
				</motion.h1>

				{/* Subheadline */}
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
					ts-better-stack scaffolds production-ready TypeScript projects with modular architecture—Prisma, MongoDB,
					Docker, and more. Zero configuration required.
				</motion.p>

				{/* CTA Buttons */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
					<Button size="lg" className="btn-depth gap-2 px-6">
						Get Started
						<ArrowRight className="w-4 h-4" />
					</Button>
					<Button variant="outline" size="lg" className="btn-depth px-6">
						View Documentation
					</Button>
				</motion.div>

				{/* Terminal Preview */}
				<TerminalPreview />
			</div>
		</section>
	);
};
