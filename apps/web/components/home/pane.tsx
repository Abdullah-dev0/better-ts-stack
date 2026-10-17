import { cn } from "@/lib/utils";

// A terminal-style pane: a labelled title bar over a body
export function Pane({
  id,
  label,
  index,
  aside,
  className,
  bodyClassName,
  children,
}: {
  id?: string;
  label: string;
  index: string;
  aside?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  const labelId = `${id ?? label.replace(/\W+/g, "-")}-label`;

  return (
    <section
      id={id}
      aria-labelledby={labelId}
      className={cn("flex min-w-0 scroll-mt-12 flex-col", className)}
    >
      <header className="border-border text-muted-foreground flex h-9 shrink-0 items-center justify-between gap-4 border-b px-5 text-[11px] tracking-[0.14em] uppercase sm:px-8">
        <h2 id={labelId} className="truncate font-normal tracking-[0.14em]">
          <span className="text-tui-amber">~</span> {label}
        </h2>
        <span className="flex shrink-0 items-center gap-3">
          {aside}
          <span className="tabular-nums">{index}</span>
        </span>
      </header>
      <div className={cn("min-h-0 flex-1", bodyClassName)}>{children}</div>
    </section>
  );
}

// A labelled block inside a pane, like the CLI's pink labels
export function PaneBlock({
  label,
  aside,
  className,
  children,
}: {
  label: string;
  aside?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("border-border border-b px-5 py-6 sm:px-8", className)}>
      <div className="mb-4 flex items-baseline justify-between gap-3 text-[11px] tracking-[0.14em] uppercase">
        <span className="text-tui-pink">{label}</span>
        {aside && <span className="text-muted-foreground">{aside}</span>}
      </div>
      {children}
    </div>
  );
}
