import Link from "next/link";

import { INIT_PANE } from "@/lib/constants";

import { Pane } from "./pane";
import { PixelWordmark } from "./pixel-wordmark";
import { PmCommand } from "./pm-command";

const numberFormatter = new Intl.NumberFormat("en-US");

export function InitPane({
  weeklyDownloads,
  version,
  stackCount,
}: {
  weeklyDownloads: number | null;
  version: string | null;
  stackCount: number;
}) {
  const stats = [
    {
      label: "npm",
      value:
        weeklyDownloads === null
          ? "live"
          : numberFormatter.format(weeklyDownloads),
      caption: "downloads last week",
    },
    {
      label: "ci",
      value: String(stackCount),
      caption: "stacks tested per PR",
    },
    {
      label: "version",
      value: version ? `v${version}` : "latest",
      caption: "on npm",
    },
  ];

  return (
    <Pane id="init" label="init" index="01" className="border-border border-b">
      {/* Fills the first screen below the top bar, status bar, and title bar */}
      <div className="mx-auto flex w-full max-w-6xl flex-col justify-center gap-14 px-5 py-14 sm:px-10 sm:py-20 xl:min-h-[calc(100svh-7.25rem)] xl:py-12">
        <div>
          <h1 className="sr-only">better-ts-stack</h1>
          <PixelWordmark className="mb-10 w-full max-w-3xl" />
          <p className="text-tui-lavender mb-4 text-base sm:text-lg">
            {INIT_PANE.tagline}
          </p>
          <p className="text-muted-foreground max-w-xl text-sm leading-relaxed sm:text-[15px]">
            {INIT_PANE.description}
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,30rem)_minmax(0,1fr)] lg:items-end">
          <div>
            <PmCommand />
            <p className="text-muted-foreground mt-4 text-[13px]">
              {INIT_PANE.hint}{" "}
              <Link
                href="#builder"
                className="text-tui-lavender underline-offset-4 hover:underline"
              >
                {INIT_PANE.builder.link} -&gt;
              </Link>
            </p>
          </div>

          <dl className="grid grid-cols-3 gap-6 sm:gap-10 lg:justify-self-end">
            {stats.map((stat) => (
              <div key={stat.label} className="min-w-0">
                <dt className="text-muted-foreground mb-2 text-[11px] tracking-[0.14em] uppercase">
                  {stat.label}
                </dt>
                <dd className="text-foreground truncate text-2xl font-medium tabular-nums sm:text-3xl">
                  {stat.value}
                </dd>
                <dd className="text-muted-foreground mt-1.5 text-xs">
                  {stat.caption}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Pane>
  );
}
