"use client";

import { useEffect, useState } from "react";

import { SECTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type SectionId = (typeof SECTIONS)[number]["id"];

const numberFormatter = new Intl.NumberFormat("en-US");

function scrollToSection(id: SectionId) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
}

// A tmux-style bar: the page's sections, the one in view, and number keys
// that jump between them
export function StatusBar({
  version,
  weeklyDownloads,
  stackCount,
}: {
  version: string | null;
  weeklyDownloads: number | null;
  stackCount: number;
}) {
  const [activeId, setActiveId] = useState<SectionId>("init");

  useEffect(() => {
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const first = SECTIONS.find((section) => visible.has(section.id));
        if (first) setActiveId(first.id);
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    for (const section of SECTIONS) {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement;
      const isTyping =
        target.isContentEditable ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        (target instanceof HTMLInputElement &&
          target.type !== "radio" &&
          target.type !== "checkbox");
      if (isTyping) return;

      const section = SECTIONS[Number(event.key) - 1];
      if (!section) return;
      event.preventDefault();
      scrollToSection(section.id);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <nav
      aria-label="Page sections"
      className="border-border bg-background fixed inset-x-0 bottom-0 z-40 hidden h-8 items-stretch border-t text-[11px] tracking-[0.12em] uppercase md:flex"
    >
      <span className="bg-tui-amber flex items-center px-3 font-medium text-black">
        better-ts-stack
      </span>
      <ul className="flex items-stretch">
        {SECTIONS.map((section, i) => {
          const isActive = section.id === activeId;
          return (
            <li key={section.id} className="flex">
              <button
                type="button"
                onClick={() => scrollToSection(section.id)}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "focus-visible:ring-tui-amber px-3 transition-colors focus-visible:ring-1 focus-visible:outline-none focus-visible:ring-inset",
                  isActive
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {i + 1}:{section.label}
                <span aria-hidden className="inline-block w-2">
                  {isActive ? "*" : ""}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="text-muted-foreground ml-auto hidden items-center gap-4 px-3 lg:flex">
        <span>
          <span className="text-foreground tabular-nums">{stackCount}</span>{" "}
          stacks
        </span>
        {weeklyDownloads !== null && (
          <span>
            <span className="text-foreground tabular-nums">
              {numberFormatter.format(weeklyDownloads)}
            </span>{" "}
            dl / wk
          </span>
        )}
        {version && <span className="text-tui-lavender">v{version}</span>}
        <span>
          <kbd className="border-border text-foreground border px-1">1-4</kbd>{" "}
          jump
        </span>
      </p>
    </nav>
  );
}
