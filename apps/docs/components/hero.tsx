import Link from "next/link";

import { ArrowRight, Box, Database, Server, Sparkles } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { HERO_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { FadeInUp, FloatingIcon, FloatingOrb } from "./motion";
import { NpmDownloadsStrip } from "./npm-downloads-strip";
import { TerminalPreview } from "./terminal-preview";

export const HeroSection = () => {
  return (
    <section className="relative mt-10 flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16">
      {/* Grid background */}
      <div className="bg-grid absolute inset-0 mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Radial gradient overlay */}
      <div className="bg-gradient-radial absolute inset-0" />

      {/* Floating orbs - very subtle */}
      <FloatingOrb
        duration={8}
        yRange={[0, -15, 0]}
        opacityRange={[0.05, 0.1, 0.05]}
        className="bg-primary/5 absolute top-1/3 left-1/4 h-48 w-48 rounded-full blur-3xl"
      />
      <FloatingOrb
        duration={10}
        yRange={[0, 15, 0]}
        opacityRange={[0.03, 0.08, 0.03]}
        className="bg-muted-foreground/5 absolute right-1/4 bottom-1/3 h-64 w-64 rounded-full blur-3xl"
      />

      {/* Floating animated icons */}
      {/* Top left */}
      <FloatingIcon
        duration={6}
        yRange={[0, -20, 0]}
        className="bg-primary/10 border-primary/30 text-primary absolute top-1/4 left-8 hidden h-12 w-12 items-center justify-center rounded-xl border lg:flex"
      >
        <Server size={20} />
      </FloatingIcon>

      {/* Top right */}
      <FloatingIcon
        duration={7}
        delay={0.3}
        yRange={[0, 18, 0]}
        className="bg-secondary/50 border-border text-muted-foreground absolute top-1/3 right-8 hidden h-12 w-12 items-center justify-center rounded-xl border lg:flex"
      >
        <Database size={20} />
      </FloatingIcon>

      {/* Bottom right */}
      <FloatingIcon
        duration={6.2}
        delay={0.6}
        yRange={[0, 16, 0]}
        className="bg-accent/50 border-border text-accent-foreground absolute right-12 bottom-1/3 hidden h-11 w-11 items-center justify-center rounded-xl border lg:flex"
      >
        <Box size={19} />
      </FloatingIcon>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Badge row: Beta + tagline */}
        <FadeInUp className="mb-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          {/* Beta badge - floating, visible, animated */}
          <FloatingIcon
            duration={3.5}
            yRange={[0, -8, 0]}
            className="group border-primary/25 bg-primary/8 dark:bg-primary/10 ring-primary/10 ring-offset-background hover:border-primary/40 hover:bg-primary/12 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] ring-1 ring-offset-2 backdrop-blur-sm transition-colors duration-200"
          >
            <span
              className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full"
              aria-hidden
            />
            <span className="text-primary/95 text-[11px] font-semibold tracking-[0.18em] uppercase">
              Beta
            </span>
          </FloatingIcon>
          {/* Tagline */}
          <span className="text-muted-foreground inline-flex items-center gap-2 text-sm">
            <Sparkles className="text-primary/70 h-3.5 w-3.5" />
            {HERO_CONFIG.badge.text}
          </span>
        </FadeInUp>

        {/* Headline — three lines, tight leading, tilted animated underline on accent only */}
        <FadeInUp delay={0.1} className="mb-6">
          <h1 className="text-foreground text-center font-sans text-5xl leading-[1.08] font-bold tracking-tight md:text-7xl">
            <span className="block">{HERO_CONFIG.headline.main}</span>
            <span className="block">{HERO_CONFIG.headline.second}</span>
            <span className="block font-mono text-[0.92em] tracking-tight">
              <span className="text-gradient relative inline-block">
                {HERO_CONFIG.headline.accent}
                {/* Tilted animated underline — thicker, slanted, draws in */}
                <span
                  className="from-primary/80 via-primary to-primary/80 absolute right-0 -bottom-1 left-0 h-1.5 origin-left -skew-x-8 animate-(--animate-underline-grow) rounded-sm bg-linear-to-r"
                  aria-hidden
                />
              </span>
            </span>
          </h1>
        </FadeInUp>

        {/* Subheadline */}
        <FadeInUp
          delay={0.2}
          className="text-muted-foreground mx-auto mb-6 max-w-2xl text-lg leading-relaxed md:text-xl"
        >
          {HERO_CONFIG.subheadline}
        </FadeInUp>

        <NpmDownloadsStrip />

        {/* Tech stack keyword pills */}
        <FadeInUp
          delay={0.28}
          className="mb-10 flex flex-wrap items-center justify-center gap-2"
        >
          {[
            "TypeScript",
            "Express",
            "Prisma",
            "MongoDB",
            "Docker",
            "Zod",
            "JWT",
            "Next.js",
          ].map((word, i) => (
            <span
              key={word}
              style={{ animationDelay: `${0.3 + i * 0.07}s` }}
              className="animate-fade-in bg-secondary text-secondary-foreground border-border hover:border-primary/40 hover:text-primary rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-200"
            >
              {word}
            </span>
          ))}
        </FadeInUp>

        {/* CTA Buttons */}
        <FadeInUp
          delay={0.34}
          className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href={HERO_CONFIG.cta.primary.href}
            className={cn(
              buttonVariants({ size: "lg" }),
              "btn-depth gap-2 px-6"
            )}
          >
            {HERO_CONFIG.cta.primary.text}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={HERO_CONFIG.cta.secondary.href}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "btn-depth px-6"
            )}
          >
            {HERO_CONFIG.cta.secondary.text}
          </Link>
        </FadeInUp>

        {/* Terminal Preview */}
        <TerminalPreview />
      </div>
    </section>
  );
};
