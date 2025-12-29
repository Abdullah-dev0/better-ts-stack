"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

// ============================================================================
// Direct Motion Component Exports
// ============================================================================

export const MotionDiv = motion.div;
export const MotionHeader = motion.header;

// ============================================================================
// Common Types
// ============================================================================

interface BaseAnimationProps {
	children?: ReactNode;
	delay?: number;
	duration?: number;
	className?: string;
}

interface FloatingAnimationProps {
	className?: string;
	duration?: number;
	delay?: number;
	yRange?: [number, number, number];
}

// ============================================================================
// Common Animation Components
// ============================================================================

export const FadeInUp = ({ children, delay = 0, duration = 0.5, className }: BaseAnimationProps) => {
	return (
		<MotionDiv
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration, delay }}
			className={className}>
			{children}
		</MotionDiv>
	);
};

export const FadeIn = ({ children, delay = 0, duration = 0.5, className }: BaseAnimationProps) => {
	return (
		<MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration, delay }} className={className}>
			{children}
		</MotionDiv>
	);
};

export const ScrollReveal = ({ children, delay = 0, duration = 0.5, className }: BaseAnimationProps) => {
	return (
		<MotionDiv
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration, delay }}
			className={className}>
			{children}
		</MotionDiv>
	);
};

export const ScrollRevealLeft = ({ children, delay = 0, duration = 0.5, className }: BaseAnimationProps) => {
	return (
		<MotionDiv
			initial={{ opacity: 0, x: -20 }}
			whileInView={{ opacity: 1, x: 0 }}
			viewport={{ once: true }}
			transition={{ duration, delay }}
			className={className}>
			{children}
		</MotionDiv>
	);
};

export const FloatingOrb = ({
	className,
	duration = 8,
	delay = 0,
	yRange = [0, -15, 0],
	opacityRange = [0.05, 0.1, 0.05],
}: FloatingAnimationProps & { opacityRange?: [number, number, number] }) => {
	return (
		<MotionDiv
			animate={{
				y: yRange,
				opacity: opacityRange,
			}}
			transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
			className={className}
		/>
	);
};

export const FloatingIcon = ({
	children,
	className,
	duration = 5,
	delay = 0,
	yRange = [0, -15, 0],
}: FloatingAnimationProps & { children: ReactNode }) => {
	return (
		<MotionDiv
			animate={{ y: yRange }}
			transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
			className={className}>
			{children}
		</MotionDiv>
	);
};
