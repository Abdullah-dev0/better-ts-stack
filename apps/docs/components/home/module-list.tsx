import { MODULE_ENTRIES, MODULES_SECTION } from "@/lib/constants";
import { FRAMEWORK_OPTIONS } from "@/lib/stack";
import { cn } from "@/lib/utils";

export function ModuleList() {
  return (
    <section
      id="modules"
      className="border-border scroll-mt-20 border-t py-20 sm:py-28"
    >
      <div className="container mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-brand-text mb-4 font-mono text-xs tracking-[0.16em] uppercase">
            {MODULES_SECTION.eyebrow}
          </p>
          <h2 className="text-foreground mb-5 text-4xl leading-[1.05] font-semibold tracking-[-0.03em] sm:text-5xl">
            {MODULES_SECTION.title.main}
            <br />
            <span className="text-muted-foreground">
              {MODULES_SECTION.title.accent}
            </span>
          </h2>
          <p className="text-muted-foreground max-w-md leading-relaxed">
            {MODULES_SECTION.description}
          </p>
        </div>

        <ol className="border-border divide-border divide-y border-y">
          {MODULE_ENTRIES.map((entry, i) => (
            <li
              key={entry.title}
              className="group grid gap-x-6 gap-y-3 py-6 sm:grid-cols-[2.5rem_minmax(0,1fr)]"
            >
              <span className="text-muted-foreground/70 font-mono text-xs tabular-nums sm:pt-1.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-foreground text-xl font-semibold tracking-tight">
                    {entry.title}
                  </h3>
                  <code className="text-brand-text font-mono text-xs break-all">
                    {entry.flag}
                  </code>
                </div>
                <p className="text-muted-foreground mb-4 max-w-xl text-sm leading-relaxed">
                  {entry.description}
                </p>
                <ul
                  className="flex flex-wrap gap-1.5"
                  aria-label="Available with"
                >
                  {FRAMEWORK_OPTIONS.map((framework) => {
                    const isAvailable = entry.frameworks.includes(
                      framework.value
                    );
                    return (
                      <li
                        key={framework.value}
                        aria-hidden={!isAvailable}
                        className={cn(
                          "rounded-md border px-2 py-0.5 font-mono text-[11px]",
                          isAvailable
                            ? "border-border bg-secondary text-secondary-foreground"
                            : "text-muted-foreground/40 border-dashed border-current/20 line-through"
                        )}
                      >
                        {framework.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
