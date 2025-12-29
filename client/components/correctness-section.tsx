import { CORRECTNESS_FEATURE_CARDS, CORRECTNESS_SECTION, STACK_ITEMS } from "@/lib/constants";
import { Check, Code2, Database, GitBranch, X } from "lucide-react";
import { FeatureCardComponent, StackItemCard } from "./correctness-section-client";
import { FadeIn, FloatingIcon } from "./motion";

export function CorrectnessSection() {
	return (
		<section className="py-24 bg-background relative overflow-hidden">
			{/* Background pattern */}
			<div className="absolute inset-0 bg-grid opacity-30" />

			{/* Floating animated icons - Reduced */}
			{/* Top left */}
			<FloatingIcon
				duration={5}
				yRange={[0, -15, 0]}
				className="absolute left-10 top-20 hidden lg:flex w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 items-center justify-center text-purple-400">
				<Database size={18} />
			</FloatingIcon>

			{/* Top right */}
			<FloatingIcon
				duration={6}
				delay={0.5}
				yRange={[0, 20, 0]}
				className="absolute right-10 top-20 hidden lg:flex w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 items-center justify-center text-blue-400">
				<Code2 size={18} />
			</FloatingIcon>

			<div className="container mx-auto px-4 relative z-10">
				{/* Header */}
				<div className="text-center mb-16">
					<div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
						{CORRECTNESS_SECTION.badge}
					</div>
					<h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
						{CORRECTNESS_SECTION.title}
					</h2>
					<p className="text-muted-foreground max-w-xl mx-auto">{CORRECTNESS_SECTION.description}</p>
				</div>

				{/* Main content grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-20 max-w-6xl mx-auto">
					{/* Left: Stack Visualization */}
					<div className="space-y-3">
						{STACK_ITEMS.map((item, i) => (
							<StackItemCard key={i} {...item} delay={i * 0.1} />
						))}

						{/* Types preserved button */}
						<FadeIn className="flex justify-center mt-6">
							<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
								<Check size={14} />
								{CORRECTNESS_SECTION.typesPreserved}
							</div>
						</FadeIn>
					</div>

					{/* Right: Comparison - NO card wrapper */}
					<div className="lg:pt-8">
						<h3 className="text-2xl font-bold text-foreground mb-4">{CORRECTNESS_SECTION.templates.title}</h3>
						<p className="text-muted-foreground mb-8 leading-relaxed">{CORRECTNESS_SECTION.templates.description}</p>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{/* Manual Setup - Bad */}
							<div className="p-4 rounded-xl border border-border bg-card/30">
								<div className="flex items-center gap-2 text-muted-foreground font-medium mb-2 text-sm">
									<X size={14} className="text-destructive" />
									{CORRECTNESS_SECTION.comparison.bad.label}
								</div>
								<p className="text-xs text-muted-foreground">{CORRECTNESS_SECTION.comparison.bad.description}</p>
							</div>

							{/* ts-better-stack - Good */}
							<div className="p-4 rounded-xl border border-primary/30 bg-primary/5">
								<div className="flex items-center gap-2 text-primary font-medium mb-2 text-sm">
									<Check size={14} />
									{CORRECTNESS_SECTION.comparison.good.label}
								</div>
								<p className="text-xs text-muted-foreground">{CORRECTNESS_SECTION.comparison.good.description}</p>
							</div>
						</div>
					</div>
				</div>

				{/* Feature Cards - 3 columns */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
					{CORRECTNESS_FEATURE_CARDS.map((card, i) => (
						<FeatureCardComponent key={i} {...card} delay={i * 0.1} />
					))}
				</div>
			</div>

			{/* Floating animated icon - Bottom right */}
			<FloatingIcon
				duration={5.5}
				delay={0.8}
				yRange={[0, 18, 0]}
				className="absolute right-12 bottom-28 hidden lg:flex w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 items-center justify-center text-emerald-400">
				<GitBranch size={18} />
			</FloatingIcon>
		</section>
	);
}
