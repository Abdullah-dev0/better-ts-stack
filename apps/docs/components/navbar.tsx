"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { Github, Menu, X, Zap } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { NAVBAR_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { ThemeToggle } from "./theme-toggle";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 border-border/50 border-b backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      {/* Announcement banner */}
      <div className="bg-primary/10 border-primary/20 border-b py-2">
        <div className="container mx-auto flex items-center justify-center gap-2 px-6 text-xs">
          <Zap className="text-primary h-3 w-3" />
          <span className="text-foreground/80">
            {NAVBAR_CONFIG.banner.text}
          </span>
          <span className="text-primary ml-2 hidden font-mono md:inline">
            {NAVBAR_CONFIG.banner.tagline}
          </span>
        </div>
      </div>

      <nav className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="rom-primary to-accent pulse-glow flex h-10 w-10 items-center justify-center rounded-xl">
            <span className="text-primary-foreground font-mono text-lg font-bold">
              {NAVBAR_CONFIG.brand.logo}
            </span>
          </div>
          <span className="text-foreground group-hover:text-primary text-lg font-bold transition-colors">
            {NAVBAR_CONFIG.brand.name}
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          {NAVBAR_CONFIG.links.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              {...(link.external && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
              className="text-muted-foreground hover:text-primary group relative text-sm transition-colors"
            >
              {link.label === "GitHub" && (
                <Github className="mr-1 inline h-4 w-4" />
              )}
              {link.label}
              <span className="bg-primary absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href={NAVBAR_CONFIG.cta.href}
            className={cn(
              buttonVariants({ size: "sm" }),
              "btn-cyber text-primary-foreground hidden font-medium md:flex"
            )}
          >
            {NAVBAR_CONFIG.cta.text}
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="glass-card rounded-lg md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="bg-background/95 border-border border-b backdrop-blur-xl md:hidden">
          <div className="container flex flex-col gap-4 px-6 py-4">
            {NAVBAR_CONFIG.links.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                {...(link.external && {
                  target: "_blank",
                  rel: "noopener noreferrer",
                })}
                className="text-muted-foreground hover:text-primary py-2 text-sm"
              >
                {link.label === "GitHub" && (
                  <Github className="mr-1 inline h-4 w-4" />
                )}
                {link.label}
              </Link>
            ))}
            <Link
              href={NAVBAR_CONFIG.cta.href}
              className={cn(
                buttonVariants({ size: "sm" }),
                "btn-cyber text-primary-foreground w-full"
              )}
            >
              {NAVBAR_CONFIG.cta.text}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
