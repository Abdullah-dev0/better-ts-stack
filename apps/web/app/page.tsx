import { Footer } from "@/components/footer";
import { CiMatrix } from "@/components/home/ci-matrix";
import { InitPane } from "@/components/home/init-pane";
import { ModuleTable } from "@/components/home/module-table";
import { Pane } from "@/components/home/pane";
import { StackBuilder } from "@/components/home/stack-builder";
import { StatusBar } from "@/components/home/status-bar";
import { Navbar } from "@/components/navbar";
import { CI_PANE, MODULE_ENTRIES } from "@/lib/constants";
import { getLatestVersion, getWeeklyDownloads } from "@/lib/npm-downloads";
import { listMatrixCases } from "@/lib/stack";

export default async function Home() {
  const [downloads, version] = await Promise.all([
    getWeeklyDownloads(),
    getLatestVersion(),
  ]);
  const weeklyDownloads = downloads?.downloads ?? null;
  const cases = listMatrixCases();

  return (
    <div className="home-page bg-background text-foreground selection:bg-tui-amber/30 min-h-screen md:pb-8">
      <Navbar />
      <main>
        <InitPane
          weeklyDownloads={weeklyDownloads}
          version={version}
          stackCount={cases.length}
        />

        {/* On wide screens the builder fills the screen and each pane scrolls */}
        <div className="border-border grid border-b xl:h-[calc(100svh-5rem)] xl:min-h-[40rem] xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] xl:*:min-h-0 xl:*:overflow-hidden">
          <StackBuilder />
        </div>

        <Pane
          id="modules"
          label="modules"
          index="04"
          aside={<span>{MODULE_ENTRIES.length} modules</span>}
          className="border-border border-b"
        >
          <ModuleTable />
        </Pane>

        <Pane
          id="ci"
          label="ci.matrix"
          index="05"
          aside={<span>ubuntu · windows</span>}
          className="border-border border-b"
        >
          <CiMatrix cases={cases} />
        </Pane>

        <Pane label="principles" index="06" className="border-border border-b">
          <ul className="divide-border grid divide-y md:grid-cols-3 md:divide-x md:divide-y-0">
            {CI_PANE.principles.map((principle) => (
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
        stackCount={cases.length}
      />
    </div>
  );
}
