import { MODULE_ENTRIES } from "@/lib/constants";
import { FRAMEWORK_OPTIONS } from "@/lib/stack";
import { cn } from "@/lib/utils";

const COLUMN_LABELS: Record<string, string> = {
  express: "express",
  nestjs: "nestjs",
  nextjs: "next",
  tanstack: "tanstack",
};

export function ModuleTable() {
  return (
    <>
      {/* Phones get a list; the table needs about 46rem */}
      <ol className="divide-border divide-y md:hidden">
        {MODULE_ENTRIES.map((entry, i) => (
          <li key={entry.flag} className="px-5 py-4">
            <p className="mb-1 flex items-baseline gap-3 text-[13px]">
              <span className="text-muted-foreground tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-foreground font-medium">{entry.title}</span>
            </p>
            <p className="text-tui-amber mb-1.5 text-xs">{entry.flag}</p>
            <p className="text-muted-foreground mb-2.5 text-xs leading-relaxed">
              {entry.description}
            </p>
            <ul className="flex flex-wrap gap-x-3 gap-y-1 text-[11px]">
              {FRAMEWORK_OPTIONS.map((framework) => {
                const isAvailable = entry.frameworks.includes(framework.value);
                return (
                  <li
                    key={framework.value}
                    className={
                      isAvailable ? "text-tui-lime" : "text-muted-foreground/50"
                    }
                  >
                    <span aria-hidden>{isAvailable ? "✓" : "·"}</span>{" "}
                    {COLUMN_LABELS[framework.value]}
                    {!isAvailable && <span className="sr-only"> (no)</span>}
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[46rem] border-collapse text-left text-[13px]">
          <caption className="sr-only">
            Modules, the flag that adds each one, and the frameworks it works
            with
          </caption>
          <thead>
            <tr className="border-border text-muted-foreground border-b text-[11px] tracking-[0.14em] uppercase">
              <th scope="col" className="w-12 px-5 py-3 font-normal sm:px-8">
                #
              </th>
              <th scope="col" className="px-3 py-3 font-normal">
                flag
              </th>
              <th scope="col" className="px-3 py-3 font-normal">
                module
              </th>
              {FRAMEWORK_OPTIONS.map((framework) => (
                <th
                  key={framework.value}
                  scope="col"
                  className="w-20 px-2 py-2.5 text-center font-normal"
                >
                  <span aria-hidden>{COLUMN_LABELS[framework.value]}</span>
                  <span className="sr-only">{framework.label}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MODULE_ENTRIES.map((entry, i) => (
              <tr
                key={entry.flag}
                className="border-border hover:bg-muted/60 border-b transition-colors last:border-b-0"
              >
                <td className="text-muted-foreground px-5 py-5 align-top tabular-nums sm:px-8">
                  {String(i + 1).padStart(2, "0")}
                </td>
                <td className="text-tui-amber px-3 py-5 align-top whitespace-nowrap">
                  {entry.flag}
                </td>
                <td className="px-3 py-5 align-top">
                  <span className="text-foreground font-medium">
                    {entry.title}
                  </span>
                  <span className="text-muted-foreground mt-0.5 block max-w-md text-xs leading-relaxed">
                    {entry.description}
                  </span>
                </td>
                {FRAMEWORK_OPTIONS.map((framework) => {
                  const isAvailable = entry.frameworks.includes(
                    framework.value
                  );
                  return (
                    <td
                      key={framework.value}
                      className={cn(
                        "px-2 py-5 text-center align-top",
                        isAvailable
                          ? "text-tui-lime"
                          : "text-muted-foreground/40"
                      )}
                    >
                      <span aria-hidden>{isAvailable ? "✓" : "·"}</span>
                      <span className="sr-only">
                        {isAvailable ? "Yes" : "No"}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
