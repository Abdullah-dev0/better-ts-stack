import { ARCHITECTURE_FEATURES, ARCHITECTURE_SECTION } from "@/lib/constants";
import { FeatureCard } from "./architecture-grid-client";

export function ArchitectureGrid() {
	return (
		<section id="modules" className="py-24 bg-background relative overflow-hidden">
			{/* Background pattern - same as hero */}
			<div className="absolute inset-0 bg-grid opacity-30" />

			<div className="container mx-auto px-4 relative z-10">
				<div className="text-center mb-16">
					<div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
						{ARCHITECTURE_SECTION.badge}
					</div>
					<h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
						{ARCHITECTURE_SECTION.title.main}
						<br />
						<span className="text-muted-foreground">{ARCHITECTURE_SECTION.title.accent}</span>
					</h2>
					<p className="text-muted-foreground max-w-xl mx-auto">{ARCHITECTURE_SECTION.description}</p>
				</div>

				{/* Bento Grid Layout */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mb-16 auto-rows-fr">
					{ARCHITECTURE_FEATURES.map((feature, i) => (
						<FeatureCard key={i} {...feature} />
					))}
				</div>
			</div>
		</section>
	);
}
