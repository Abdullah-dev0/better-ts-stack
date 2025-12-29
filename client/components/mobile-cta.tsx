"use client";

import * as React from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { Button } from "./ui/button";

export function MobileCTA() {
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = React.useState(false);
  const [lastScrollY, setLastScrollY] = React.useState(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 300 && latest < lastScrollY) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
    setLastScrollY(latest);
  });

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 sm:hidden p-4 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800"
      initial={{ y: 100 }}
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Button variant="default" size="lg" className="w-full">
        Get Started
      </Button>
    </motion.div>
  );
}
