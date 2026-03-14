"use client";

import {
  ArrowRight,
  Check,
  Code2,
  Database,
  GitBranch,
  Layers,
  type LucideIcon,
  Server,
  UploadCloud,
  Zap,
} from "lucide-react";

import { ScrollReveal, ScrollRevealLeft } from "./motion";
import type { FeatureCardComponentProps, StackItemCardProps } from "./types";

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

export function StackItemCard({
  icon: iconName,
  label,
  sub,
  color,
  delay = 0,
}: StackItemCardProps) {
  const Icon = stackIconMap[iconName];
  if (!Icon) return null;

  return (
    <ScrollRevealLeft
      delay={delay}
      className="bg-card/50 border-border group hover:border-primary/30 flex items-center gap-4 rounded-xl border p-4 transition-colors"
    >
      <div
        className={`bg-background border-border rounded-lg border p-2.5 ${color}`}
      >
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-foreground font-semibold">{label}</span>
          <span className="text-primary inline-flex items-center gap-1 text-xs">
            <Check size={12} />
            Type-safe
          </span>
        </div>
        <div className="text-muted-foreground text-xs">{sub}</div>
      </div>
      <ArrowRight
        size={16}
        className="text-muted-foreground group-hover:text-primary transition-colors"
      />
    </ScrollRevealLeft>
  );
}

export function FeatureCardComponent({
  icon: iconName,
  title,
  description,
  delay = 0,
}: FeatureCardComponentProps) {
  const Icon = featureIconMap[iconName];
  if (!Icon) return null;

  return (
    <ScrollReveal
      delay={delay}
      className="bg-card/30 border-border rounded-xl border p-6 text-center"
    >
      <div className="bg-primary/10 text-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
        <Icon size={24} />
      </div>
      <h4 className="text-foreground mb-2 font-bold">{title}</h4>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </ScrollReveal>
  );
}
