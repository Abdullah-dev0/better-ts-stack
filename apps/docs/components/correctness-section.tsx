import { Check, Code2, Database, GitBranch, X } from "lucide-react";

import {
  CORRECTNESS_FEATURE_CARDS,
  CORRECTNESS_SECTION,
  STACK_ITEMS,
} from "@/lib/constants";

import {
  FeatureCardComponent,
  StackItemCard,
} from "./correctness-section-client";
import { FadeIn, FloatingIcon } from "./motion";

export function CorrectnessSection() {
  return (
    <section className="bg-background relative overflow-hidden py-24">
      {/* Background pattern */}
      <div className="bg-grid absolute inset-0 opacity-30" />

      {/* Floating animated icons - Reduced */}
      {/* Top left */}
      <FloatingIcon
        duration={5}
        yRange={[0, -15, 0]}
        className="bg-primary/10 border-primary/30 text-primary absolute top-20 left-10 hidden h-10 w-10 items-center justify-center rounded-xl border lg:flex"
      >
        <Database size={18} />
      </FloatingIcon>

      {/* Top right */}
      <FloatingIcon
        duration={6}
        delay={0.5}
        yRange={[0, 20, 0]}
        className="bg-secondary/50 border-border text-muted-foreground absolute top-20 right-10 hidden h-10 w-10 items-center justify-center rounded-xl border lg:flex"
      >
        <Code2 size={18} />
      </FloatingIcon>

      <div className="relative z-10 container mx-auto px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="bg-primary/10 text-primary mb-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium">
            {CORRECTNESS_SECTION.badge}
          </div>
          <h2 className="text-foreground mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            {CORRECTNESS_SECTION.title}
          </h2>
          <p className="text-muted-foreground mx-auto max-w-xl">
            {CORRECTNESS_SECTION.description}
          </p>
        </div>

        {/* Main content grid */}
        <div className="mx-auto mb-20 grid max-w-6xl grid-cols-1 items-start gap-16 lg:grid-cols-2">
          {/* Left: Stack Visualization */}
          <div className="space-y-3">
            {STACK_ITEMS.map((item, i) => (
              <StackItemCard key={i} {...item} delay={i * 0.1} />
            ))}

            {/* Types preserved button */}
            <FadeIn className="mt-6 flex justify-center">
              <div className="bg-primary/10 border-primary/20 text-primary inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm">
                <Check size={14} />
                {CORRECTNESS_SECTION.typesPreserved}
              </div>
            </FadeIn>
          </div>

          {/* Right: Comparison - NO card wrapper */}
          <div className="lg:pt-8">
            <h3 className="text-foreground mb-4 text-2xl font-bold">
              {CORRECTNESS_SECTION.templates.title}
            </h3>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              {CORRECTNESS_SECTION.templates.description}
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Manual Setup - Bad */}
              <div className="border-border bg-card/30 rounded-xl border p-4">
                <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm font-medium">
                  <X size={14} className="text-destructive" />
                  {CORRECTNESS_SECTION.comparison.bad.label}
                </div>
                <p className="text-muted-foreground text-xs">
                  {CORRECTNESS_SECTION.comparison.bad.description}
                </p>
              </div>

              {/* ts-better-stack - Good */}
              <div className="border-primary/30 bg-primary/5 rounded-xl border p-4">
                <div className="text-primary mb-2 flex items-center gap-2 text-sm font-medium">
                  <Check size={14} />
                  {CORRECTNESS_SECTION.comparison.good.label}
                </div>
                <p className="text-muted-foreground text-xs">
                  {CORRECTNESS_SECTION.comparison.good.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards - 3 columns */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
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
        className="bg-accent/50 border-border text-accent-foreground absolute right-12 bottom-28 hidden h-10 w-10 items-center justify-center rounded-xl border lg:flex"
      >
        <GitBranch size={18} />
      </FloatingIcon>
    </section>
  );
}
