import { ChevronRight } from "lucide-react";

import { MATRIX_SECTION } from "@/lib/constants";
import { FRAMEWORK_OPTIONS, listMatrixCases } from "@/lib/stack";

export function TestMatrix() {
  const cases = listMatrixCases();

  return (
    <section className="bg-muted/50 border-border border-t py-20 sm:py-28">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 max-w-3xl">
          <p className="text-brand-text mb-4 font-mono text-xs tracking-[0.16em] uppercase">
            {MATRIX_SECTION.eyebrow}
          </p>
          <h2 className="text-foreground mb-5 text-4xl leading-[1.05] font-semibold tracking-[-0.03em] sm:text-5xl">
            <span className="text-brand-text tabular-nums">{cases.length}</span>{" "}
            stacks, checked on every pull request.
          </h2>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            {MATRIX_SECTION.description}
          </p>
        </div>

        <ol className="text-muted-foreground mb-10 flex flex-wrap items-center gap-y-2 font-mono text-xs">
          {MATRIX_SECTION.steps.map((step, i) => (
            <li key={step} className="flex items-center">
              <span className="border-border bg-background text-foreground rounded-md border px-2.5 py-1">
                {step}
              </span>
              {i < MATRIX_SECTION.steps.length - 1 && (
                <ChevronRight className="mx-1 h-3.5 w-3.5" aria-hidden />
              )}
            </li>
          ))}
          <li className="ml-3">on ubuntu-latest and windows-latest</li>
        </ol>

        <div className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FRAMEWORK_OPTIONS.map((framework) => {
            const frameworkCases = cases.filter(
              (c) => c.framework === framework.value
            );
            return (
              <figure
                key={framework.value}
                className="border-border bg-background rounded-xl border p-4"
              >
                <figcaption className="mb-3 flex items-baseline justify-between gap-2">
                  <span className="text-foreground text-sm font-medium">
                    {framework.label}
                  </span>
                  <span className="text-muted-foreground font-mono text-xs tabular-nums">
                    {frameworkCases.length}
                  </span>
                </figcaption>
                <ul
                  className="grid grid-cols-[repeat(16,minmax(0,1fr))] gap-[3px]"
                  aria-label={`${frameworkCases.length} ${framework.label} combinations`}
                >
                  {frameworkCases.map((c) => (
                    <li
                      key={c.name}
                      title={c.name}
                      className="bg-primary/75 hover:bg-primary aspect-square rounded-[2px] transition-colors"
                    />
                  ))}
                </ul>
              </figure>
            );
          })}
        </div>

        <ul className="border-border grid gap-px overflow-hidden rounded-xl border bg-(--border) sm:grid-cols-3">
          {MATRIX_SECTION.principles.map((principle) => (
            <li key={principle.title} className="bg-background p-6">
              <h3 className="text-foreground mb-2 font-semibold tracking-tight">
                {principle.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {principle.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
