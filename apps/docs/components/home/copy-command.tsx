"use client";

import { useState } from "react";

import { Check, Copy } from "lucide-react";

export function CopyCommand({ command }: { command: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Clipboard access can be blocked; the command stays selectable
    }
  };

  return (
    <div className="bg-terminal-bg flex w-full max-w-xl items-center gap-3 rounded-xl border border-white/10 py-2 pr-2 pl-5 font-mono text-base sm:text-lg">
      <span className="text-primary select-none" aria-hidden>
        $
      </span>
      <code className="min-w-0 flex-1 truncate text-left text-white">
        {command}
      </code>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={isCopied ? "Copied" : "Copy command"}
        className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary focus-visible:ring-offset-terminal-bg inline-flex h-10 shrink-0 items-center gap-2 rounded-lg px-4 font-sans text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {isCopied ? (
          <Check className="h-4 w-4" aria-hidden />
        ) : (
          <Copy className="h-4 w-4" aria-hidden />
        )}
        <span className="hidden sm:inline">{isCopied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
}
