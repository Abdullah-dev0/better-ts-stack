"use client";

import * as React from "react";
import { motion } from "motion/react";
import { ThemeToggle } from "./ui/theme-toggle";
import { Github } from "lucide-react";
import { Button } from "./ui/button";

export function Navigation() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
        ${scrolled ? "backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200 dark:border-zinc-800" : "bg-transparent"}
      `}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300 bg-clip-text text-transparent">
              Nexus
            </span>
          </div>
          <div className="flex items-center gap-4">
            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="inline-flex items-center justify-center h-9 w-9 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github className="h-4 w-4" />
            </motion.a>
            <ThemeToggle />
            <Button variant="default" size="sm" className="hidden sm:inline-flex">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
