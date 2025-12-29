"use client";

import {
	Database,
	Layers,
	Server,
	UploadCloud,
	Code2,
	GitBranch,
	Zap,
	Check,
	ArrowRight,
	type LucideIcon,
} from "lucide-react";
import { ScrollRevealLeft, ScrollReveal } from "./motion";
import type { StackItem, FeatureCard } from "@/lib/constants";

// Icon maps for string to component conversion
const stackIconMap: Record<string, LucideIcon> = {
	Database,
	Layers,
	Server,
	UploadCloud,
};

const featureIconMap: Record<string, LucideIcon> = {
	Code2,
	GitBranch,
	Zap,
};

interface StackItemCardProps extends StackItem {
	delay?: number;
}

export function StackItemCard({ icon: iconName, label, sub, color, delay = 0 }: StackItemCardProps) {
	const Icon = stackIconMap[iconName];
	if (!Icon) return null;

	return (
		<ScrollRevealLeft delay={delay} className="flex items-center gap-4 bg-card/50 border border-border p-4 rounded-xl group hover:border-primary/30 transition-colors">
			<div className={`p-2.5 rounded-lg bg-background border border-border ${color}`}>
				<Icon size={20} />
			</div>
			<div className="flex-1">
				<div className="flex items-center gap-2">
					<span className="font-semibold text-foreground">{label}</span>
					<span className="inline-flex items-center gap-1 text-xs text-primary">
						<Check size={12} />
						Type-safe
					</span>
				</div>
				<div className="text-xs text-muted-foreground">{sub}</div>
			</div>
			<ArrowRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
		</ScrollRevealLeft>
	);
}

interface FeatureCardComponentProps extends FeatureCard {
	delay?: number;
}

export function FeatureCardComponent({ icon: iconName, title, description, delay = 0 }: FeatureCardComponentProps) {
	const Icon = featureIconMap[iconName];
	if (!Icon) return null;

	return (
		<ScrollReveal delay={delay} className="p-6 rounded-xl bg-card/30 border border-border text-center">
			<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 mx-auto">
				<Icon size={24} />
			</div>
			<h4 className="font-bold text-foreground mb-2">{title}</h4>
			<p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
		</ScrollReveal>
	);
}
