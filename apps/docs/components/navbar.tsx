"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { Menu, X } from "lucide-react";

import { Github } from "@/components/icons/github";
import { Button, buttonVariants } from "@/components/ui/button";
import { NAVBAR_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { ThemeToggle } from "./theme-toggle";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        isScrolled || isMobileOpen
          ? "bg-background/85 border-border backdrop-blur-xl"
          : "border-transparent bg-transparent"
      )}
    >
      <nav className="container mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/icon.png"
            alt=""
            width={28}
            height={28}
            className="rounded-md"
            priority
          />
          <span className="text-foreground font-semibold tracking-tight">
            {NAVBAR_CONFIG.brand.name}
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {NAVBAR_CONFIG.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              {...(link.external && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
            >
              {link.label === "GitHub" && <Github className="h-4 w-4" />}
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href={NAVBAR_CONFIG.cta.href}
            className={cn(buttonVariants({ size: "sm" }), "hidden md:flex")}
          >
            {NAVBAR_CONFIG.cta.text}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>

      {isMobileOpen && (
        <div id="mobile-menu" className="border-border border-t md:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            {NAVBAR_CONFIG.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                {...(link.external && {
                  target: "_blank",
                  rel: "noopener noreferrer",
                })}
                className="text-muted-foreground hover:text-foreground flex items-center gap-2 rounded-md py-2.5 text-sm"
              >
                {link.label === "GitHub" && <Github className="h-4 w-4" />}
                {link.label}
              </Link>
            ))}
            <Link
              href={NAVBAR_CONFIG.cta.href}
              className={cn(buttonVariants(), "mt-2 w-full")}
            >
              {NAVBAR_CONFIG.cta.text}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
