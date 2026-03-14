import type { ReactNode } from "react";

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
          <div className="mb-4 rounded-lg border bg-linear-to-br from-blue-50 to-cyan-50 p-4 dark:from-blue-950 dark:to-cyan-950">
            <p className="mb-1 text-sm font-medium">🚀 Quick Start</p>
            <p className="text-muted-foreground text-xs">
              Generate your TypeScript stack in minutes
            </p>
          </div>
        ),
        defaultOpenLevel: 1,
      }}
    >
      {children}
    </DocsLayout>
  );
}
