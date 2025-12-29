"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Box, Container, Database, Layout, Server, Shield, Zap } from "lucide-react";
import { MouseEvent } from "react";

interface Feature {
	icon: typeof Server;
	title: string;
	description: string;
	color: string;
	badge: string | null;
	size: "normal" | "large";
}

const features: Feature[] = [
	{
		icon: Server,
		title: "Backend Module",
		description:
			"TypeScript backend with Express or Fastify. Fully type-safe REST API with automatic validation using Zod.",
		color: "text-purple-400",
		badge: null,
		size: "large",
	},
	{
		icon: Database,
		title: "Prisma ORM",
		description: "Type-safe database access with auto-generated types. Seamless integration with the backend module.",
		color: "text-orange-400",
		badge: null,
		size: "normal",
	},
	{
		icon: Box,
		title: "MongoDB + Mongoose",
		description: "Better MongoDB support with Mongoose schemas. Full type inference for documents.",
		color: "text-primary",
		badge: null,
		size: "normal",
	},
	{
		icon: Container,
		title: "Docker Ready",
		description: "Pre-configured Docker Compose setup. One command to spin up your entire dev environment.",
		color: "text-blue-400",
		badge: null,
		size: "normal",
	},
	{
		icon: Layout,
		title: "Frontend Module",
		description: "Next.js/Vite Integration coming soon. Pre-configured with Tailwind and key libraries.",
		color: "text-muted-foreground",
		badge: "Coming Soon",
		size: "large",
	},
	{
		icon: Shield,
		title: "Auth Module",
		description: "JWT authentication with session management. Role-based access control out of the box.",
		color: "text-primary",
		badge: "Coming Soon",
		size: "normal",
	},
	{
		icon: Zap,
		title: "Edge Functions",
		description: "Deploy to Vercel Edge, Cloudflare Workers, or any edge runtime with ease.",
		color: "text-teal-400",
		badge: "Coming Soon",
		size: "normal",
	},
];

export function ArchitectureGrid() {
	return (
		<section id="modules" className="py-24 bg-background relative overflow-hidden">
			{/* Background pattern - same as hero */}
			<div className="absolute inset-0 bg-grid opacity-30" />

			<div className="container mx-auto px-4 relative z-10">
				<div className="text-center mb-16">
					<div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
						Modular Architecture
					</div>
					<h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
						Everything You Need.
						<br />
						<span className="text-muted-foreground">Nothing You Don&apos;t.</span>
					</h2>
					<p className="text-muted-foreground max-w-xl mx-auto">
						Pick the modules you need. Each one is designed to work perfectly alone or together.
					</p>
				</div>

				{/* Bento Grid Layout */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mb-16 auto-rows-fr">
					{features.map((feature, i) => (
						<FeatureCard key={i} {...feature} />
					))}
				</div>
			</div>
		</section>
	);
}

function FeatureCard({
	icon: Icon,
	title,
	description,
	color,
	badge,
	size,
}: {
	icon: typeof Server;
	title: string;
	description: string;
	color: string;
	badge: string | null;
	size: "normal" | "large";
}) {
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);

	function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
		const { left, top } = currentTarget.getBoundingClientRect();
		mouseX.set(clientX - left);
		mouseY.set(clientY - top);
	}

	return (
		<div
			className={cn(
				"group relative border border-border bg-card/40 overflow-hidden rounded-xl p-6 hover:border-border/80 transition-colors",
				size === "large" && "md:col-span-2",
			)}
			onMouseMove={handleMouseMove}>
			<motion.div
				className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
				style={{
					background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              hsl(var(--primary) / 0.08),
              transparent 80%
            )
          `,
				}}
			/>
			<div className="h-full flex flex-col">
				<div className="flex justify-between items-start mb-4">
					<div
						className={cn(
							"inline-flex items-center justify-center rounded-lg bg-card p-3 border border-border",
							color,
						)}>
						<Icon className="h-6 w-6" />
					</div>
					{badge && (
						<span className="px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground border border-border">
							{badge}
						</span>
					)}
				</div>

				<h3 className="mb-2 text-lg font-bold text-foreground">{title}</h3>
				<p className="text-sm leading-relaxed text-muted-foreground grow">{description}</p>
			</div>
		</div>
	);
}
