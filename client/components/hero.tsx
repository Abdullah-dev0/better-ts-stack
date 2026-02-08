import { buttonVariants } from "@/components/ui/button";
import { HERO_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ArrowRight, Sparkles, Server, Database, Box } from "lucide-react";
import Link from "next/link";
import { FadeInUp, FloatingOrb, FloatingIcon } from "./motion";
import { TerminalPreview } from "./terminal-preview";

export const HeroSection = () => {
	return (
		<section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
			{/* Grid background */}
			<div className="absolute inset-0 bg-grid mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

			{/* Radial gradient overlay */}
			<div className="absolute inset-0 bg-gradient-radial" />

			{/* Floating orbs - very subtle */}
			<FloatingOrb
				duration={8}
				yRange={[0, -15, 0]}
				opacityRange={[0.05, 0.1, 0.05]}
				className="absolute top-1/3 left-1/4 w-48 h-48 bg-primary/5 rounded-full blur-3xl"
			/>
			<FloatingOrb
				duration={10}
				yRange={[0, 15, 0]}
				opacityRange={[0.03, 0.08, 0.03]}
				className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-muted-foreground/5 rounded-full blur-3xl"
			/>

			{/* Floating animated icons */}
			{/* Top left */}
			<FloatingIcon
				duration={6}
				yRange={[0, -20, 0]}
				className="absolute left-8 top-1/4 hidden lg:flex w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 items-center justify-center text-purple-400">
				<Server size={20} />
			</FloatingIcon>

			{/* Top right */}
			<FloatingIcon
				duration={7}
				delay={0.3}
				yRange={[0, 18, 0]}
				className="absolute right-8 top-1/3 hidden lg:flex w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 items-center justify-center text-blue-400">
				<Database size={20} />
			</FloatingIcon>

			{/* Bottom right */}
			<FloatingIcon
				duration={6.2}
				delay={0.6}
				yRange={[0, 16, 0]}
				className="absolute right-12 bottom-1/3 hidden lg:flex w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 items-center justify-center text-cyan-400">
				<Box size={19} />
			</FloatingIcon>

			<div className="relative z-10 max-w-4xl mx-auto text-center">
				{/* Badge */}
				<FadeInUp className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
					<Sparkles className="w-3.5 h-3.5 text-primary" />
					<span className="text-xs font-medium text-primary">{HERO_CONFIG.badge.text}</span>
				</FadeInUp>

				{/* Headline */}
				<FadeInUp delay={0.1} className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
					{HERO_CONFIG.headline.main}
					<br />
					<span className="text-gradient">{HERO_CONFIG.headline.accent}</span>
				</FadeInUp>

				{/* Subheadline */}
				<FadeInUp delay={0.2} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
					{HERO_CONFIG.subheadline}
				</FadeInUp>

				{/* CTA Buttons */}
				<FadeInUp delay={0.3} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
					<Link
						href={HERO_CONFIG.cta.primary.href}
						className={cn(buttonVariants({ size: "lg" }), "btn-depth gap-2 px-6")}>
						{HERO_CONFIG.cta.primary.text}
						<ArrowRight className="w-4 h-4" />
					</Link>
					<Link
						href={HERO_CONFIG.cta.secondary.href}
						className={cn(buttonVariants({ variant: "outline", size: "lg" }), "btn-depth px-6")}>
						{HERO_CONFIG.cta.secondary.text}
					</Link>
				</FadeInUp>

				{/* Terminal Preview */}
				<TerminalPreview />
			</div>
		</section>
	);
};
