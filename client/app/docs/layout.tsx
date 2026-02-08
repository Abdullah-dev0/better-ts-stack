import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout 
      tree={source.getPageTree()} 
      {...baseOptions()}
      sidebar={{
        banner: (
          <div className="rounded-lg border bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 p-4 mb-4">
            <p className="text-sm font-medium mb-1">🚀 Quick Start</p>
            <p className="text-xs text-muted-foreground">
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