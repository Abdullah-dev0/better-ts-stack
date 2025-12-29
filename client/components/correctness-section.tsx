"use client";

import { motion } from "framer-motion";
import {
	Check,
	Code2,
	Database,
	Layers,
	Server,
	UploadCloud,
	X,
	ArrowRight,
	Zap,
	GitBranch,
	Shield,
} from "lucide-react";

const stackItems = [
	{ icon: Database, label: "Data Layer", sub: "MongoDB + Prisma + Mongoose", color: "text-primary" },
	{ icon: Layers, label: "Business Logic", sub: "TypeScript + Zod + better-auth", color: "text-purple-400" },
	{ icon: Server, label: "API Layer", sub: "Express + TypeScript", color: "text-blue-400" },
	{ icon: UploadCloud, label: "Deployment", sub: "Docker + CI/CD", color: "text-orange-400" },
];

const featureCards = [
	{
		icon: Code2,
		title: "Correctness First",
		description: "If it compiles, it works. Catch errors at build time, not in production.",
	},
	{
		icon: GitBranch,
		title: "Modular Design",
		description: "Use only what you need. Each module is independent and composable.",
	},
	{
		icon: Zap,
		title: "Zero Overhead",
		description: "No runtime type checking. All safety happens at compile time.",
	},
];

export function CorrectnessSection() {
	return (
		<section className="py-24 bg-background relative overflow-hidden">
			{/* Background pattern */}
			<div className="absolute inset-0 bg-grid opacity-30" />

			{/* Floating animated icon - top left */}
			<motion.div
				animate={{ y: [0, -15, 0] }}
				transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
				className="absolute left-10 top-20 hidden lg:flex w-10 h-10 rounded-xl bg-card border border-border items-center justify-center text-muted-foreground">
				<Database size={20} />
			</motion.div>

			{/* Floating animated icon - top right */}
			<motion.div
				animate={{ y: [0, 20, 0] }}
				transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
				className="absolute right-10 top-20 hidden lg:flex w-10 h-10 rounded-xl bg-card border border-border items-center justify-center text-muted-foreground">
				<Code2 size={20} />
			</motion.div>

			<div className="container mx-auto px-4 relative z-10">
				{/* Header */}
				<div className="text-center mb-16">
					<div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
						How It Works
					</div>
					<h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">Built for Correctness</h2>
					<p className="text-muted-foreground max-w-xl mx-auto">
						Every layer is type-safe. Every connection is validated. No more guessing—just shipping.
					</p>
				</div>

				{/* Main content grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-20 max-w-6xl mx-auto">
					{/* Left: Stack Visualization */}
					<div className="space-y-3">
						{stackItems.map((item, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ delay: i * 0.1 }}
								className="flex items-center gap-4 bg-card/50 border border-border p-4 rounded-xl group hover:border-primary/30 transition-colors">
								<div className={`p-2.5 rounded-lg bg-background border border-border ${item.color}`}>
									<item.icon size={20} />
								</div>
								<div className="flex-1">
									<div className="flex items-center gap-2">
										<span className="font-semibold text-foreground">{item.label}</span>
										<span className="inline-flex items-center gap-1 text-xs text-primary">
											<Check size={12} />
											Type-safe
										</span>
									</div>
									<div className="text-xs text-muted-foreground">{item.sub}</div>
								</div>
								<ArrowRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
							</motion.div>
						))}

						{/* Types preserved button */}
						<motion.div
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							className="flex justify-center mt-6">
							<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
								<Check size={14} />
								Types preserved across all layers
							</div>
						</motion.div>
					</div>

					{/* Right: Comparison - NO card wrapper */}
					<div className="lg:pt-8">
						<h3 className="text-2xl font-bold text-foreground mb-4">Ready-Made Templates. Zero Setup.</h3>
						<p className="text-muted-foreground mb-8 leading-relaxed">
							Pick your stack, choose your package manager (npm, yarn, pnpm, bun), and get a production-ready TypeScript
							project with Express backend, better-auth authentication, and end-to-end type safety. No configuration
							needed.
						</p>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{/* Manual Setup - Bad */}
							<div className="p-4 rounded-xl border border-border bg-card/30">
								<div className="flex items-center gap-2 text-muted-foreground font-medium mb-2 text-sm">
									<X size={14} className="text-destructive" />
									Manual Setup
								</div>
								<p className="text-xs text-muted-foreground">Hours of config, auth headaches, type mismatches.</p>
							</div>

							{/* ts-better-stack - Good */}
							<div className="p-4 rounded-xl border border-primary/30 bg-primary/5">
								<div className="flex items-center gap-2 text-primary font-medium mb-2 text-sm">
									<Check size={14} />
									ts-better-stack
								</div>
								<p className="text-xs text-muted-foreground">One command, full stack, ready to ship.</p>
							</div>
						</div>
					</div>
				</div>

				{/* Feature Cards - 3 columns */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
					{featureCards.map((card, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: i * 0.1 }}
							className="p-6 rounded-xl bg-card/30 border border-border text-center">
							<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 mx-auto">
								<card.icon size={24} />
							</div>
							<h4 className="font-bold text-foreground mb-2">{card.title}</h4>
							<p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
