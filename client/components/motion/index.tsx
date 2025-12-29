"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

// ============================================================================
// Direct Motion Component Exports
// ============================================================================

export const MotionDiv = motion.div;
export const MotionHeader = motion.header;
export const MotionSection = motion.section;
export const MotionH1 = motion.h1;
export const MotionP = motion.p;
export const MotionSpan = motion.span;

// ============================================================================
// Pre-configured Animation Variants
// ============================================================================

export const fadeInUp = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
};

export const fadeInLeft = {
	initial: { opacity: 0, x: -20 },
	animate: { opacity: 1, x: 0 },
};

export const fadeIn = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
};

export const slideDown = {
	initial: { opacity: 0, y: -10 },
	animate: { opacity: 1, y: 0 },
};

// ============================================================================
// Common Animation Components
// ============================================================================

interface FadeInUpProps {
	children: ReactNode;
	delay?: number;
	duration?: number;
	className?: string;
}

export const FadeInUp = ({ children, delay = 0, duration = 0.5, className }: FadeInUpProps) => {
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

interface FadeInLeftProps {
	children: ReactNode;
	delay?: number;
	duration?: number;
	className?: string;
}

export const FadeInLeft = ({ children, delay = 0, duration = 0.5, className }: FadeInLeftProps) => {
	return (
		<MotionDiv
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration, delay }}
			className={className}>
			{children}
		</MotionDiv>
	);
};

interface FadeInProps {
	children: ReactNode;
	delay?: number;
	duration?: number;
	className?: string;
}

export const FadeIn = ({ children, delay = 0, duration = 0.5, className }: FadeInProps) => {
	return (
		<MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration, delay }} className={className}>
			{children}
		</MotionDiv>
	);
};

interface ScrollRevealProps {
	children: ReactNode;
	delay?: number;
	duration?: number;
	className?: string;
}

export const ScrollReveal = ({ children, delay = 0, duration = 0.5, className }: ScrollRevealProps) => {
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

interface ScrollRevealLeftProps {
	children: ReactNode;
	delay?: number;
	duration?: number;
	className?: string;
}

export const ScrollRevealLeft = ({ children, delay = 0, duration = 0.5, className }: ScrollRevealLeftProps) => {
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

interface FloatingOrbProps {
	className?: string;
	duration?: number;
	delay?: number;
	yRange?: [number, number, number];
	opacityRange?: [number, number, number];
}

export const FloatingOrb = ({
	className,
	duration = 8,
	delay = 0,
	yRange = [0, -15, 0],
	opacityRange = [0.05, 0.1, 0.05],
}: FloatingOrbProps) => {
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

interface FloatingIconProps {
	children: ReactNode;
	className?: string;
	duration?: number;
	delay?: number;
	yRange?: [number, number, number];
}

export const FloatingIcon = ({
	children,
	className,
	duration = 5,
	delay = 0,
	yRange = [0, -15, 0],
}: FloatingIconProps) => {
	return (
		<MotionDiv
			animate={{ y: yRange }}
			transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
			className={className}>
			{children}
		</MotionDiv>
	);
};
