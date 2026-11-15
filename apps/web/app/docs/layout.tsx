import type { ReactNode } from "react";

import Link from "next/link";

import { DocsLayout } from "fumadocs-ui/layouts/docs";

import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...baseOptions()}
      sidebar={{
        banner: (
          <Link
            href="/builder"
            className="border-fd-border bg-fd-background hover:border-fd-primary mb-4 block border p-3 font-mono transition-colors"
          >
            <span className="text-fd-primary mb-1 block text-xs">
              &gt;_ stack builder
            </span>
            <span className="text-fd-muted-foreground block text-xs leading-relaxed">
              Pick your stack and copy the command
            </span>
          </Link>
        ),
        defaultOpenLevel: 1,
      }}
    >
      {children}
    </DocsLayout>
  );
}
