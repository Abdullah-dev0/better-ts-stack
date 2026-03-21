import { TrendingUp } from "lucide-react";

import { getWeeklyDownloads } from "@/lib/npm-downloads";

import { FadeInUp } from "./motion";

const numberFormatter = new Intl.NumberFormat("en-US");
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
});

export async function NpmDownloadsStrip() {
  const weeklyDownloads = await getWeeklyDownloads();

  const formattedDownloads = weeklyDownloads
    ? numberFormatter.format(weeklyDownloads.downloads)
    : "Live on npm";
  const formattedRange = weeklyDownloads
    ? `${dateFormatter.format(new Date(weeklyDownloads.start))} - ${dateFormatter.format(new Date(weeklyDownloads.end))}`
    : "Stats refresh automatically when npm responds.";

  return (
    <FadeInUp delay={0.24} className="mx-auto mb-7 max-w-2xl">
      <div className="border-border/60 bg-card/78 block rounded-2xl border shadow-sm backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3 px-4 py-3 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-3">
            <div className="bg-primary/12 text-primary ring-primary/15 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="space-y-0.5">
              <p className="text-muted-foreground text-[10px] font-semibold tracking-[0.18em] uppercase">
                Weekly npm downloads
              </p>
              <div className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-0.5 sm:justify-start">
                <p className="text-foreground text-xl font-semibold tracking-tight sm:text-2xl">
                  {formattedDownloads}
                </p>
                <p className="text-muted-foreground text-xs">
                  {formattedRange}
                </p>
              </div>
            </div>
          </div>
          <div className="text-foreground/80 rounded-full border border-current/10 px-2.5 py-1 text-xs font-medium sm:ml-auto">
            npm stats
          </div>
        </div>
      </div>
    </FadeInUp>
  );
}
