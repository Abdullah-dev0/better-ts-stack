import { ARCHITECTURE_FEATURES, ARCHITECTURE_SECTION } from "@/lib/constants";

import { FeatureCard } from "./FeatureCard";

export function ArchitectureGrid() {
  return (
    <section
      id="modules"
      className="bg-background relative overflow-hidden py-24"
    >
      {/* Background pattern - same as hero */}
      <div className="bg-grid absolute inset-0 opacity-30" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="mb-16 text-center">
          <div className="bg-primary/10 text-primary mb-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium">
            {ARCHITECTURE_SECTION.badge}
          </div>
          <h2 className="text-foreground mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            {ARCHITECTURE_SECTION.title.main}
            <br />
            <span className="text-muted-foreground">
              {ARCHITECTURE_SECTION.title.accent}
            </span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-xl">
            {ARCHITECTURE_SECTION.description}
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="mx-auto mb-16 grid max-w-6xl auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {ARCHITECTURE_FEATURES.map((feature, i) => (
            <FeatureCard key={i} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
