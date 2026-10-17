import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { CLOSING_SECTION } from "@/lib/constants";

import { CopyCommand } from "./copy-command";

export function ClosingCta() {
  return (
    <section className="border-border relative overflow-hidden border-t py-24 sm:py-32">
      <div
        aria-hidden
        className="bg-primary/10 absolute -bottom-40 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full blur-3xl"
      />
      <div className="relative container mx-auto flex max-w-3xl flex-col items-center px-4 text-center sm:px-6">
        <h2 className="text-foreground mb-5 text-4xl leading-[1.05] font-semibold tracking-[-0.03em] sm:text-5xl">
          {CLOSING_SECTION.title}
        </h2>
        <p className="text-muted-foreground mb-10 max-w-xl leading-relaxed">
          {CLOSING_SECTION.description}
        </p>
        <CopyCommand command={CLOSING_SECTION.command} />
        <Link
          href="/docs/usage"
          className="text-muted-foreground hover:text-foreground mt-6 inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          See every flag
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
