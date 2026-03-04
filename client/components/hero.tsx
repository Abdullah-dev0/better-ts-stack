import { buttonVariants } from "@/components/ui/button";
import { HERO_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ArrowRight, Sparkles, Server, Database, Box } from "lucide-react";
import Link from "next/link";
import { FadeInUp, FloatingOrb, FloatingIcon } from "./motion";
import { TerminalPreview } from "./terminal-preview";

export const HeroSection = () => {
	return (
		<section className="relative mt-10 min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
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
				className="absolute left-8 top-1/4 hidden lg:flex w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 items-center justify-center text-primary">
				<Server size={20} />
			</FloatingIcon>

			{/* Top right */}
			<FloatingIcon
				duration={7}
				delay={0.3}
				yRange={[0, 18, 0]}
				className="absolute right-8 top-1/3 hidden lg:flex w-12 h-12 rounded-xl bg-secondary/50 border border-border items-center justify-center text-muted-foreground">
				<Database size={20} />
			</FloatingIcon>

			{/* Bottom right */}
			<FloatingIcon
				duration={6.2}
				delay={0.6}
				yRange={[0, 16, 0]}
				className="absolute right-12 bottom-1/3 hidden lg:flex w-11 h-11 rounded-xl bg-accent/50 border border-border items-center justify-center text-accent-foreground">
				<Box size={19} />
			</FloatingIcon>

			<div className="relative z-10 max-w-4xl mx-auto text-center">
				{/* Badge row: Beta + tagline */}
				<FadeInUp className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8">
					{/* Beta badge - floating, visible, animated */}
					<FloatingIcon
						duration={3.5}
						yRange={[0, -8, 0]}
						className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full
							border border-primary/25 bg-primary/8 dark:bg-primary/10 backdrop-blur-sm
							shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]
							ring-1 ring-primary/10 ring-offset-2 ring-offset-background
							hover:border-primary/40 hover:bg-primary/12 transition-colors duration-200">
						<span
							className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"
							aria-hidden
						/>
						<span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-primary/95">
							Beta
						</span>
					</FloatingIcon>
					{/* Tagline */}
					<span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
						<Sparkles className="w-3.5 h-3.5 text-primary/70" />
						{HERO_CONFIG.badge.text}
					</span>
				</FadeInUp>

				{/* Headline — three lines, tight leading, tilted animated underline on accent only */}
				<FadeInUp delay={0.1} className="mb-6">
					<h1
						className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.08]
							font-sans text-center">
						<span className="block">{HERO_CONFIG.headline.main}</span>
						<span className="block">{HERO_CONFIG.headline.second}</span>
						<span className="block font-mono text-[0.92em] tracking-tight">
							<span className="relative inline-block text-gradient">
								{HERO_CONFIG.headline.accent}
								{/* Tilted animated underline — thicker, slanted, draws in */}
								<span
									className="absolute -bottom-1 left-0 right-0 h-1.5 rounded-sm
										bg-linear-to-r from-primary/80 via-primary to-primary/80
										origin-left -skew-x-8 animate-(--animate-underline-grow)"
									aria-hidden
								/>
							</span>
						</span>
					</h1>
				</FadeInUp>

				{/* Subheadline */}
				<FadeInUp
					delay={0.2}
					className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 leading-relaxed">
					{HERO_CONFIG.subheadline}
				</FadeInUp>

				{/* Tech stack keyword pills */}
				<FadeInUp delay={0.25} className="flex flex-wrap items-center justify-center gap-2 mb-10">
					{["TypeScript", "Express", "Prisma", "MongoDB", "Docker", "Zod", "JWT", "Next.js"].map((word, i) => (
						<span
							key={word}
							style={{ animationDelay: `${0.3 + i * 0.07}s` }}
							className="animate-fade-in px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border hover:border-primary/40 hover:text-primary transition-colors duration-200">
							{word}
						</span>
					))}
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
