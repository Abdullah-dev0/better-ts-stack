"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Box, Container, Database, Layout, Server, Shield, Zap, type LucideIcon } from "lucide-react";
import { MouseEvent } from "react";
import type { FeatureCardProps } from "./types";

// Icon map for string to component conversion
const iconMap: Record<string, LucideIcon> = {
	Server,
	Database,
	Box,
	Container,
	Layout,
	Shield,
	Zap,
};

export function FeatureCard({ icon: iconName, title, description, color, badge, size }: FeatureCardProps) {
	const Icon = iconMap[iconName];
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
              color-mix(in oklch, var(--color-primary) 8%, transparent),
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
