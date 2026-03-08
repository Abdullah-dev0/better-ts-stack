"use client";

import { MouseEvent } from "react";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import {
  Box,
  Container,
  Database,
  Layout,
  type LucideIcon,
  Server,
  Shield,
  Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";

import type { FeatureCardProps } from "./types";

// Icon map for string to component conversion
const iconMap: Record<string, LucideIcon> = {
  Server,
  Database,
  Box,
  Container,
  Layout,
  Shield,
  Zap,
};

export function FeatureCard({
  icon: iconName,
  title,
  description,
  color,
  badge,
  size,
}: FeatureCardProps) {
  const Icon = iconMap[iconName];
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={cn(
        "group border-border bg-card/40 hover:border-border/80 relative overflow-hidden rounded-xl border p-6 transition-colors",
        size === "large" && "md:col-span-2"
      )}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              color-mix(in oklch, var(--color-primary) 8%, transparent),
              transparent 80%
            )
          `,
        }}
      />
      <div className="flex h-full flex-col">
        <div className="mb-4 flex items-start justify-between">
          <div
            className={cn(
              "bg-card border-border inline-flex items-center justify-center rounded-lg border p-3",
              color
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
          {badge && (
            <span className="bg-muted text-muted-foreground border-border rounded border px-2 py-0.5 text-[10px] font-medium">
              {badge}
            </span>
          )}
        </div>

        <h3 className="text-foreground mb-2 text-lg font-bold">{title}</h3>
        <p className="text-muted-foreground grow text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
