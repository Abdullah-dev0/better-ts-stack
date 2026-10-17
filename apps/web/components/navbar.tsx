"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { Menu, X } from "lucide-react";

import { Github } from "@/components/icons/github";
import { GITHUB_URL, NAV_LINKS } from "@/lib/constants";

import { ThemeToggle } from "./theme-toggle";

const LINK_CLASS =
  "text-muted-foreground hover:text-foreground focus-visible:ring-tui-amber text-[11px] tracking-[0.14em] uppercase transition-colors focus-visible:ring-1 focus-visible:outline-none";

export const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <header className="border-border bg-background/90 sticky top-0 z-40 border-b backdrop-blur-md">
      <nav className="flex h-12 items-center gap-6 px-4 sm:px-5">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/icon.png"
            alt=""
            width={22}
            height={22}
            className="rounded-sm"
            priority
          />
          <span className="text-foreground text-[13px] font-medium">
            better-ts-stack
          </span>
        </Link>

        <ul className="hidden items-center gap-5 md:flex">
          {NAV_LINKS.filter((link) => !link.isSection).map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={LINK_CLASS}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-1">
          <Link
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
            className="text-muted-foreground hover:text-foreground focus-visible:ring-tui-amber inline-flex h-9 w-9 items-center justify-center transition-colors focus-visible:ring-1 focus-visible:outline-none"
          >
            <Github className="h-4 w-4" />
          </Link>
          <ThemeToggle />
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground inline-flex h-9 w-9 items-center justify-center md:hidden"
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </nav>

      {isMobileOpen && (
        <ul
          id="mobile-menu"
          className="border-border flex flex-col border-t px-4 py-2 md:hidden"
        >
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={`${LINK_CLASS} block py-2.5`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
};
