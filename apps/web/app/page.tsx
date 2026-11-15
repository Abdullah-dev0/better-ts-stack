import Link from "next/link";

import { Footer } from "@/components/footer";
import { InitPane } from "@/components/home/init-pane";
import { ModuleTable } from "@/components/home/module-table";
import { Pane } from "@/components/home/pane";
import { Recipes } from "@/components/home/recipes";
import { StatusBar } from "@/components/home/status-bar";
import { Navbar } from "@/components/navbar";
import { MODULE_ENTRIES, PRINCIPLES } from "@/lib/constants";
import { getLatestVersion, getWeeklyDownloads } from "@/lib/npm-downloads";
import { countMatrixCases, STACK_PRESETS } from "@/lib/stack";

export default async function Home() {
  const [downloads, version] = await Promise.all([
    getWeeklyDownloads(),
    getLatestVersion(),
  ]);
  const weeklyDownloads = downloads?.downloads ?? null;
  const stackCount = countMatrixCases();

  return (
    <div className="home-page bg-background text-foreground selection:bg-tui-amber/30 min-h-screen md:pb-8">
      <Navbar />
      <main>
        <InitPane
          weeklyDownloads={weeklyDownloads}
          version={version}
          stackCount={stackCount}
        />

        <Pane
          id="recipes"
          label="recipes"
          index="02"
          aside={
            <>
              <span>{STACK_PRESETS.length} stacks</span>
              <Link
                href="/builder"
                className="text-tui-lavender focus-visible:ring-tui-amber underline-offset-4 hover:underline focus-visible:ring-1 focus-visible:outline-none"
              >
                build your own -&gt;
              </Link>
            </>
          }
          className="border-border border-b"
        >
          <Recipes />
        </Pane>

        <Pane
          id="modules"
          label="modules"
          index="03"
          aside={<span>{MODULE_ENTRIES.length} modules</span>}
          className="border-border border-b"
        >
          <ModuleTable />
        </Pane>

        <Pane label="principles" index="04" className="border-border border-b">
          <ul className="divide-border grid divide-y md:grid-cols-3 md:divide-x md:divide-y-0">
            {PRINCIPLES.map((principle) => (
              <li key={principle.title} className="px-5 py-6 sm:px-8">
                <h3 className="text-tui-amber mb-2 text-[13px] font-medium">
                  {principle.title}
                </h3>
                <p className="text-muted-foreground text-[13px] leading-relaxed">
                  {principle.description}
                </p>
              </li>
            ))}
          </ul>
        </Pane>

        <Footer />
      </main>
      <StatusBar
        version={version}
        weeklyDownloads={weeklyDownloads}
        stackCount={stackCount}
      />
    </div>
  );
}
