import { ReactNode } from "react";
import type { StackItem, FeatureCard } from "@/lib/constants";

// ============================================================================
// Component Types
// ============================================================================

// FeatureCard Component Types
export interface FeatureCardProps {
	icon: string;
	title: string;
	description: string;
	color: string;
	badge: string | null;
	size: "normal" | "large";
}

// Correctness Section Client Component Types
export interface StackItemCardProps extends StackItem {
	delay?: number;
}

export interface FeatureCardComponentProps extends FeatureCard {
	delay?: number;
}

// Motion Component Types
export interface BaseAnimationProps {
	children?: ReactNode;
	delay?: number;
	duration?: number;
	className?: string;
}

export interface FloatingAnimationProps {
	className?: string;
	duration?: number;
	delay?: number;
	yRange?: [number, number, number];
}
