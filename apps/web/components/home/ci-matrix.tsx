import { CI_PANE } from "@/lib/constants";
import {
  DATABASE_OPTIONS,
  FRAMEWORK_OPTIONS,
  type MatrixCase,
} from "@/lib/stack";

export function CiMatrix({ cases }: { cases: MatrixCase[] }) {
  const counts = FRAMEWORK_OPTIONS.map((framework) => {
    const frameworkCases = cases.filter((c) => c.framework === framework.value);
    return {
      framework,
      total: frameworkCases.length,
      byDatabase: DATABASE_OPTIONS.map(
        (database) =>
          frameworkCases.filter((c) => c.database === database.value).length
      ),
    };
  });
  const maxCell = Math.max(...counts.flatMap((row) => row.byDatabase));

  return (
    <div className="grid xl:grid-cols-[minmax(0,5fr)_minmax(0,8fr)]">
      <div className="border-border border-b px-5 py-6 sm:px-8 xl:border-r xl:border-b-0">
        <p className="text-tui-amber mb-2 text-5xl font-medium tabular-nums sm:text-6xl">
          {cases.length}
        </p>
        <p className="text-foreground mb-4 text-sm">
          stacks tested on every pull request
        </p>
        <p className="text-muted-foreground mb-6 max-w-md text-[13px] leading-relaxed">
          {CI_PANE.description}
        </p>
        <ol className="mb-5 space-y-1.5 text-[13px]">
          {CI_PANE.steps.map((step, i) => (
            <li key={step} className="flex items-center gap-3">
              <span className="text-tui-lime" aria-hidden>
                ✓
              </span>
              <span className="text-muted-foreground w-5 tabular-nums">
                {i + 1}
              </span>
              <span className="text-foreground">{step}</span>
            </li>
          ))}
        </ol>
        <p className="text-muted-foreground text-xs">
          on{" "}
          {CI_PANE.runners.map((runner, i) => (
            <span key={runner}>
              <span className="text-tui-lavender">{runner}</span>
              {i < CI_PANE.runners.length - 1 && " and "}
            </span>
          ))}
        </p>
      </div>

      <div className="min-w-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs sm:text-[13px]">
            <caption className="sr-only">
              Tested combinations by framework and database
            </caption>
            <thead>
              <tr className="border-border text-muted-foreground border-b text-[11px] uppercase sm:tracking-[0.14em]">
                <th scope="col" className="px-5 py-3 font-normal sm:px-8">
                  <span className="sr-only sm:not-sr-only">framework</span>
                </th>
                {DATABASE_OPTIONS.map((database) => (
                  <th
                    key={database.value}
                    scope="col"
                    className="px-1.5 py-3 font-normal sm:px-3"
                  >
                    {database.value === "mongoose" ? (
                      <>
                        <span className="sm:hidden">mongo</span>
                        <span className="hidden sm:inline">mongoose</span>
                      </>
                    ) : (
                      database.value
                    )}
                  </th>
                ))}
                <th
                  scope="col"
                  className="px-2 py-2.5 text-right font-normal sm:px-4"
                >
                  total
                </th>
              </tr>
            </thead>
            <tbody>
              {counts.map((row) => (
                <tr
                  key={row.framework.value}
                  className="border-border border-b"
                >
                  <th
                    scope="row"
                    className="text-foreground px-5 py-3.5 font-medium sm:px-8"
                  >
                    {row.framework.label}
                  </th>
                  {row.byDatabase.map((count, i) => (
                    <td
                      key={DATABASE_OPTIONS[i].value}
                      className="px-1.5 py-3.5 sm:px-3"
                    >
                      <span className="text-foreground tabular-nums">
                        {count}
                      </span>
                      <span
                        aria-hidden
                        className="bg-tui-amber/70 mt-1.5 block h-1"
                        style={{ width: `${(count / maxCell) * 100}%` }}
                      />
                    </td>
                  ))}
                  <td className="text-tui-amber px-2 py-3.5 text-right tabular-nums sm:px-4">
                    {row.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground border-border border-b px-5 py-3 text-[11px] leading-relaxed sm:px-8 xl:border-b-0">
          each cell × auth, rate limit (backends), docker, and npm / pnpm / bun.
          full-stack auth needs a database.
        </p>
      </div>
    </div>
  );
}
