import Link from "next/link";

import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Github } from "@/components/icons/github";
import { buttonVariants } from "@/components/ui/button";
import { HERO_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { NpmDownloads } from "./npm-downloads";
import { StackComposer } from "./stack-composer";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div
        aria-hidden
        className="bg-grid absolute inset-0 mask-[radial-gradient(ellipse_70%_55%_at_50%_0%,#000_40%,transparent_100%)]"
      />
      <div
        aria-hidden
        className="bg-primary/15 absolute -top-40 left-1/2 h-80 w-[44rem] -translate-x-1/2 rounded-full blur-3xl"
      />

      <div className="relative container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 grid grid-cols-[minmax(0,1fr)] gap-8 lg:mb-14 lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-end lg:gap-16">
          <div>
            <Link
              href={HERO_CONFIG.badge.href}
              className="border-border bg-card/70 text-muted-foreground hover:text-foreground hover:border-foreground/20 mb-7 inline-flex max-w-full items-center gap-2 rounded-full border py-1 pr-3 pl-1 text-xs backdrop-blur transition-colors"
            >
              <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold">
                NEW
              </span>
              <span className="truncate">{HERO_CONFIG.badge.text}</span>
              <ArrowRight className="h-3 w-3 shrink-0" aria-hidden />
            </Link>
            <h1 className="text-foreground text-[2.75rem] leading-[1.02] font-semibold tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              {HERO_CONFIG.headline.main}
              <br />
              <span className="text-muted-foreground">
                {HERO_CONFIG.headline.accent}
              </span>
            </h1>
          </div>

          <div className="space-y-6">
            <p className="text-muted-foreground text-base leading-relaxed sm:text-lg lg:text-base">
              {HERO_CONFIG.subheadline}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={HERO_CONFIG.cta.primary.href}
                className={cn(buttonVariants({ size: "lg" }), "gap-2 px-5")}
              >
                {HERO_CONFIG.cta.primary.text}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href={HERO_CONFIG.cta.secondary.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "gap-2 px-5"
                )}
              >
                <Github className="h-4 w-4" />
                {HERO_CONFIG.cta.secondary.text}
                <ArrowUpRight
                  className="text-muted-foreground h-3.5 w-3.5"
                  aria-hidden
                />
              </Link>
            </div>
            <NpmDownloads />
          </div>
        </div>

        <StackComposer />
      </div>
    </section>
  );
}
