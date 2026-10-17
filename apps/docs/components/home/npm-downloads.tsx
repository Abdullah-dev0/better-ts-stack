import { TrendingUp } from "lucide-react";

import { getWeeklyDownloads } from "@/lib/npm-downloads";

const numberFormatter = new Intl.NumberFormat("en-US");

export async function NpmDownloads() {
  const weeklyDownloads = await getWeeklyDownloads();
  if (!weeklyDownloads) return null;

  return (
    <p className="text-muted-foreground flex items-center gap-2 text-sm">
      <TrendingUp className="text-brand-text h-4 w-4" aria-hidden />
      <span>
        <span className="text-foreground font-medium tabular-nums">
          {numberFormatter.format(weeklyDownloads.downloads)}
        </span>{" "}
        npm downloads last week
      </span>
    </p>
  );
}
