"use client";

import { useState } from "react";

import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

export function CopyButton({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Clipboard access can be blocked; the command stays selectable
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "border-border text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-tui-amber inline-flex h-7 shrink-0 items-center gap-1.5 border px-2 text-[11px] tracking-[0.14em] uppercase transition-colors focus-visible:ring-1 focus-visible:outline-none",
        className
      )}
    >
      {isCopied ? (
        <Check className="text-tui-lime h-3.5 w-3.5" aria-hidden />
      ) : (
        <Copy className="h-3.5 w-3.5" aria-hidden />
      )}
      {isCopied ? "copied" : "copy"}
      <span className="sr-only" aria-live="polite">
        {isCopied ? "Command copied" : ""}
      </span>
    </button>
  );
}
