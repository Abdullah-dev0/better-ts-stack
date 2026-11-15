import Link from "next/link";

import {
  buildCommand,
  DEFAULT_CHOICES,
  listProjectFiles,
  STACK_PRESETS,
  type StackChoices,
  toSearchParams,
} from "@/lib/stack";

import { CopyButton } from "./copy-button";

function listParts(choices: StackChoices): string[] {
  const parts: string[] = [choices.framework];
  if (choices.database !== "none") parts.push(choices.database);
  if (choices.useAuth) parts.push("auth");
  if (choices.useRateLimit) parts.push("rate-limit");
  if (choices.useDocker) parts.push("docker");
  if (choices.useCi) parts.push("ci");
  if (choices.useVscode) parts.push("vscode");
  return parts;
}

// Ready-made stacks: a command to copy, or a starting point for the builder
export function Recipes() {
  return (
    <ul className="bg-border grid gap-px md:grid-cols-2">
      {STACK_PRESETS.map((preset, i) => {
        const choices: StackChoices = {
          ...preset.choices,
          packageManager: DEFAULT_CHOICES.packageManager,
        };
        const command = buildCommand(choices).join(" ");

        return (
          <li
            key={preset.id}
            className="bg-background flex min-w-0 flex-col px-5 py-7 sm:px-8"
          >
            <p className="mb-2 flex items-baseline justify-between gap-3">
              <span className="text-foreground text-base font-medium">
                {preset.label}
              </span>
              <span className="text-muted-foreground text-[11px] tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
            </p>
            <p className="text-muted-foreground mb-4 text-[13px] leading-relaxed">
              {preset.description}
            </p>
            <ul className="mb-5 flex flex-wrap gap-1.5 text-[11px]">
              {listParts(choices).map((part, partIndex) => (
                <li
                  key={part}
                  className={
                    partIndex === 0
                      ? "border-tui-amber/60 text-tui-amber border px-1.5 py-0.5"
                      : "border-border text-muted-foreground border px-1.5 py-0.5"
                  }
                >
                  {part}
                </li>
              ))}
            </ul>
            <div className="border-border bg-card mt-auto flex items-center gap-3 border py-2 pr-2 pl-3">
              <code className="min-w-0 flex-1 truncate text-xs">
                <span className="text-tui-lime select-none" aria-hidden>
                  ${" "}
                </span>
                {command}
              </code>
              <CopyButton text={command} />
            </div>
            <p className="text-muted-foreground mt-3 flex items-baseline justify-between gap-3 text-xs">
              <span className="tabular-nums">
                {listProjectFiles(choices).length} files
              </span>
              <Link
                href={`/builder?${toSearchParams(choices)}`}
                className="text-tui-lavender focus-visible:ring-tui-amber underline-offset-4 hover:underline focus-visible:ring-1 focus-visible:outline-none"
              >
                customize -&gt;
              </Link>
            </p>
          </li>
        );
      })}
    </ul>
  );
}
